import React, { useState, useEffect, useRef} from 'react';
import { fetchSeats, holdSeats, releaseSeats, releaseSeatsKeepAlive} from '../../services/ShowtimeSeatService';
import {createBooking} from '../../services/BookingsService';
import {useNavigate, useLocation} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

// === HÀM HELPER ===
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(amount);
};

const groupSeatsByRow = (seats) => {
  const rows = {};
  seats.forEach((s) => {
    if (!rows[s.row]) rows[s.row] = [];
    rows[s.row].push(s);
  });

  Object.values(rows).forEach((r) =>
    r.sort((a, b) => a.seatNumber - b.seatNumber)
  );

  return rows;
};

const SeatSelection = ({ showtimeId, ticketQuantity, onNext }) => {
  const [seatRows, setSeatRows] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTicketQty, setCurrentTicketQty] = useState(ticketQuantity || 0); 
  const [countdown, setCountdown] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Dùng Ref để xác định xem component unmount do chuyển trang có chủ đích hay do tắt tab
  const isProceeding = useRef(false);

  const navigator = useNavigate();
  const location = useLocation();
  
  // === EFFECT 0: Sync Props Ticket Quantity ===
  useEffect(() => {
    // Chỉ cập nhật từ props nếu session không có dữ liệu (tránh ghi đè khi vừa restore xong)
    const savedStateJSON = sessionStorage.getItem("bookingState");
    if (!savedStateJSON && ticketQuantity && ticketQuantity > 0) {
      setCurrentTicketQty(ticketQuantity);
    }
  }, [ticketQuantity]);

  // === EFFECT 1: Load Ghế & Restore State ===
  useEffect(() => {
    if(!showtimeId) return;

    const initData = async () => {
        try {
            setLoading(true);
            // Không reset selectedSeats ngay lập tức để tránh nháy giao diện nếu restore
            
            // 1. Load API Ghế
            const response = await fetchSeats(showtimeId);
            const seats = response.data.result.map(item => ({
                ...item.seat,
                status: item.status,
                showtimeSeatId: item.id,
                price: item.seat.seatType ? item.seat.seatType.price : 0,
                seatTypeName: item.seat.seatType ? item.seat.seatType.name : 'NORMAL'
            }));
            setSeatRows(groupSeatsByRow(seats));

            // 2. Logic KHÔI PHỤC (Restore) từ SessionStorage
            const savedStateJSON = sessionStorage.getItem("bookingState");
            
            if(savedStateJSON){
                const savedState = JSON.parse(savedStateJSON);
                
                // Chỉ khôi phục nếu đúng suất chiếu này
                if(savedState.showtimeId === showtimeId){
                    console.log("♻️ Đã khôi phục trạng thái chọn ghế sau khi quay lại.");
                    
                    setSelectedSeats(savedState.selectedSeats);

                    // Khôi phục số lượng vé
                    if (savedState.ticketQuantity) {
                        setCurrentTicketQty(savedState.ticketQuantity);
                    }

                    // Tính lại thời gian đếm ngược
                    const now = Date.now();
                    const remainingTime = Math.floor((savedState.holdDealine - now) / 1000);  
                    
                    if(remainingTime > 0){
                        setCountdown(remainingTime);
                        setIsTimerActive(true);
                    } else {
                        // Nếu đã hết giờ trong lúc đi vắng
                        sessionStorage.removeItem("bookingState");
                        alert("Thời gian giữ ghế đã hết trong lúc bạn rời đi. Vui lòng chọn lại.");
                        setSelectedSeats([]);
                        setCountdown(300);
                        setIsTimerActive(false);
                    }
                } else {
                    // Nếu là suất chiếu khác -> Xóa data cũ
                    sessionStorage.removeItem("bookingState");
                    setSelectedSeats([]);
                    setCountdown(300);
                }
            } else {
                // Không có data save -> Reset mới
                setSelectedSeats([]);
                setCountdown(300);
            }
        } catch (err) {
            console.error(err);
            setError("Không thể tải sơ đồ ghế");
        } finally {
            setLoading(false);
        }
    };

    initData();

  }, [showtimeId]);

  // === EFFECT: Xử lý khi rời khỏi trang (Cleanup) ===
  useEffect(() => {
    // 1. Sự kiện tắt Tab/Trình duyệt
    const handleBeforeUnload = (e) => {
        if (selectedSeats.length > 0 && !isProceeding.current) {
            // Gọi API keep-alive hoặc release tùy logic server
            releaseSeatsKeepAlive(showtimeId, selectedSeats.map(s => s.showtimeSeatId));
        }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 2. Cleanup function: Chạy khi component unmount (User bấm Link khác trong React)
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        
        // Nếu unmount mà KHÔNG PHẢI do bấm nút "Thanh toán/Đăng nhập" -> Nhả ghế
        if (selectedSeats.length > 0 && !isProceeding.current) {
            console.log("👋 Người dùng hủy chọn -> Tự động nhả ghế");
            releaseSeats(showtimeId, selectedSeats.map(s => s.showtimeSeatId)); // Dùng releaseSeats thay vì keepAlive để nhả luôn
            sessionStorage.removeItem("bookingState");
            // sessionStorage.removeItem("bookingStep1State"); // Tùy chọn: có muốn xóa step 1 không
        }
    };
  }, [selectedSeats, showtimeId]);

  // === EFFECT 2: Timer đếm ngược ===
  useEffect(() => {
    if (!isTimerActive || countdown <= 0) return;
    const intervalId = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(intervalId);
  }, [isTimerActive, countdown]);

  // === EFFECT 3: Hết giờ ===
  useEffect(() => {
    if (countdown === 0 && isTimerActive && selectedSeats.length > 0) {
      releaseSeats(
        showtimeId,
        selectedSeats.map((s) => s.showtimeSeatId)
      );
      setIsTimerActive(false);
      setSelectedSeats([]);
      sessionStorage.removeItem("bookingState");
      alert("Đã hết thời gian giữ ghế!");
    }
  }, [countdown]);

  // === EFFECT 4: Reset timer nếu không chọn ghế nào ===
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setIsTimerActive(false);
      setCountdown(300);
    }
  }, [selectedSeats]);

  const getSeatTicketValue = (seat) => {
      return seat.seatType?.name === 'COUPLE' ? 2 : 1;
  };

  // === HANDLER: Click ghế ===
  const handleSeatClick = async (seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id); 
    
    // Check trạng thái ghế
    if(!isSelected){
      if(seat.status !== "AVAILABLE"){
        if(seat.status === "BOOKED"){
          alert("Ghế này đã được đặt trước đó!");
          return;
        }
        // Có thể thêm check cho OCCUPIED nếu muốn
      }
    }   

    if(isSelected){
      // --- BỎ CHỌN GHẾ ---
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      try{
        await releaseSeats(showtimeId, [seat.id]);
        console.log("Đã nhả ghế: ", seat.seatNumber);
      }catch(err){
        console.error("Lỗi nhả ghế: ", err);
      }
    }
    else{
      // --- CHỌN GHẾ ---
      const currentTicketCount = selectedSeats.reduce((sum, s) => sum + getSeatTicketValue(s), 0);
      const newSeatValue = getSeatTicketValue(seat);
      const limit = currentTicketQty > 0 ? currentTicketQty : 8; // Mặc định 8 nếu chưa set số lượng
      
      if (currentTicketCount + newSeatValue > limit) {
        alert(`Chỉ được chọn tối đa ${limit} vé. (Ghế đôi tính là 2 vé)`);
        return;
      }

      // Optimistic update (Cập nhật UI trước)
      setSelectedSeats((prev) => [...prev, seat]);
      setIsTimerActive(true);

      try{
        await holdSeats(showtimeId, [seat.id]);
      }catch(err){
        console.error("Lỗi giữ ghế: ", err);
        alert("Ghế này vừa bị người khác chọn hoặc lỗi kết nối. Vui lòng chọn ghế khác.");
        // Rollback nếu lỗi
        setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id)); 
      }
    }
  };

  // === HANDLER: Xác nhận / Thanh toán ===
  const handleConfirm = async () => {
    const currentTicketCount = selectedSeats.reduce((sum, s) => sum + getSeatTicketValue(s), 0);
    
    // Validate số lượng
    if (currentTicketQty > 0 && currentTicketCount !== currentTicketQty) {
      alert(`Vui lòng chọn đủ ${currentTicketQty} vé. Hiện tại bạn mới chọn ${currentTicketCount} vé.`);
      return;
    }

    // 1. Đánh dấu đang xử lý để không bị cleanup khi unmount
    isProceeding.current = true;

    // 2. Lưu trạng thái vào SessionStorage
    const bookingState = {
      selectedSeats: selectedSeats,
      showtimeId: showtimeId,
      ticketQuantity: currentTicketQty,
      holdDealine: Date.now() + countdown * 1000 // Lưu thời điểm hết hạn
    }
    sessionStorage.setItem("bookingState", JSON.stringify(bookingState));

    // 3. Kiểm tra đăng nhập
    const token = localStorage.getItem("accessToken");
    if(!token){
      const wantToLogin = window.confirm("Bạn cần đăng nhập để tiếp tục thanh toán. Bạn có muốn đăng nhập ngay bây giờ?");
      if(wantToLogin){
        // isProceeding.current vẫn là TRUE, nên dữ liệu không bị xóa
        navigator("/login", {state: {from: location}}); 
      }
      else{
        // Nếu user bấm Cancel, trả lại cờ false để nếu họ thoát thì xóa ghế
        isProceeding.current = false;
      }
      return;
    }

    // 4. Nếu đã đăng nhập -> Gọi API tạo Booking
    try{
      setIsBooking(true);
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.id;
      
      const bookingRequest = {
        userId: userId,
        showtimeId: showtimeId,
        showtimeSeatIds: selectedSeats.map(s => s.showtimeSeatId),
      }
      
      const response = await createBooking(bookingRequest);
      const bookingData = response.data.result || response.data;
      
      // Tạo booking thành công -> Xóa state tạm
      sessionStorage.removeItem("bookingState");
      
      onNext(bookingData.id); // Chuyển sang bước thanh toán
    }catch (err){
      isProceeding.current = false; // Reset cờ để user có thể thao tác lại
      console.error("Booking error: ", err);
      const errorMessage = err.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.";
      alert(errorMessage);
    }finally{
      setIsBooking(false);
    }
  };

  if (loading) return <div className="text-center py-5" style={{color:'#fff'}}>Đang tải sơ đồ ghế...</div>;
  if (error) return <p className="error-message">{error}</p>;

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    return sum + (seat.seatType?.basePrice || 0);
  }, 0);
  const currentSelectedUnits = selectedSeats.reduce((sum, s) => sum + getSeatTicketValue(s), 0);

  return (
    <div className="seat-selection-container fade-in">
      <h3 className="section-title text-center my-4" style={{color: '#fff'}}>CHỌN GHẾ NGỒI</h3>
      
      {/* Màn hình 3D */}
      <div className="screen-container">
        <div className="screen"></div>
        <p style={{textAlign: 'center', color: '#fff', marginTop: '10px', opacity: 0.5}}>MÀN HÌNH</p>
      </div>

      {/* Sơ đồ ghế */}
      <div className="seat-map">
        {Object.entries(seatRows).sort(([rowA], [rowB]) => rowA.localeCompare(rowB)).map(([row, seatsInRow]) => (
          <div className="seat-row" key={row}>
            <div className="row-label">{row}</div> 
            <div className="seats-list"> 
              {seatsInRow.map(seat => {
                const isSelected = selectedSeats.some(s => s.id === seat.id);
                const isBooked = seat.status === 'BOOKED';       
                const isOccupied = seat.status === 'OCCUPIED';   
                const isDisabled = isBooked || isOccupied;       
                const typeName = seat.seatType?.name?.toLowerCase() || 'normal';
                
                return (
                  <div
                    key={seat.id}
                    className={`seat ${typeName} ${isDisabled ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isDisabled && handleSeatClick(seat)}
                    title={`${seat.seatName} - ${formatCurrency(seat.seatType.basePrice)}`}
                    style={{
                      opacity: isBooked ? 0.4 : (isOccupied ? 0.7 : 1),
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      pointerEvents: isDisabled ? 'none' : 'auto'
                    }}
                  >
                    {seat.seatNumber}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Chú thích */}
      <div className="seat-footer-panel" style={{marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px'}}>
        <div className="seat-legend" style={{display:'flex', justifyContent:'center', gap:'20px', flexWrap:'wrap', marginBottom:'20px'}}>
             <div style={{display:'flex', alignItems:'center', gap:'5px', color:'white'}}><span className="seat normal" style={{width:'20px', height:'20px', display:'inline-block'}}></span> Thường</div>
             <div style={{display:'flex', alignItems:'center', gap:'5px', color:'white'}}><span className="seat vip" style={{width:'20px', height:'20px', display:'inline-block'}}></span> VIP</div>
             <div style={{display:'flex', alignItems:'center', gap:'5px', color:'white'}}><span className="seat couple" style={{width:'40px', height:'20px', display:'inline-block'}}></span> Đôi</div>
             <div style={{display:'flex', alignItems:'center', gap:'5px', color:'white', opacity: 0.5}}><span className="seat occupied" style={{width:'20px', height:'20px', display:'inline-block'}}></span> Đã đặt</div>
             <div style={{display:'flex', alignItems:'center', gap:'5px', color:'white'}}><span className="seat selected" style={{width:'20px', height:'20px', display:'inline-block'}}></span> Đang chọn</div>
        </div>
        
        {/* Footer info & Button */}
        <div className="booking-summary" style={{background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div className="timerbox" style={{color: '#fff'}}>
                Thời gian giữ ghế: <strong style={{color: '#F4F169', fontSize: '1.2rem'}}>{formatTime(countdown)}</strong>
            </div>
            
            <div className="price-box" style={{textAlign: 'right', color: '#fff'}}>
                <p style={{margin:0}}>Đã chọn: <strong>{currentSelectedUnits}</strong> / {ticketQuantity > 0 ? ticketQuantity : '...'} ghế</p>
                <p style={{margin:0, fontSize: '1.2rem'}}>Tổng cộng: <strong style={{color: '#F4F169'}}>{formatCurrency(totalPrice)}</strong></p>
            </div>
            
            <button 
                className="btn-continue"
                onClick={handleConfirm}
                disabled={isBooking || (ticketQuantity > 0 ? currentSelectedUnits !== ticketQuantity : selectedSeats.length === 0)}
                style={{marginLeft: '20px', minWidth: '120px'}}
            >
                {isBooking ? 'Đang xử lý...' : 'THANH TOÁN'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;