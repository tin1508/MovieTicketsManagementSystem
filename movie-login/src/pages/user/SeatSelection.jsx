import React, { useState, useEffect } from 'react';
import { fetchSeats, holdSeats, releaseSeats} from '../../services/ShowtimeSeatService';
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

  const [currentTicketQty, setCurrentTicketQty] = useState(ticketQuantity); 
  const [countdown, setCountdown] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const navigator = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if(ticketQuantity && ticketQuantity > 0){
      setCurrentTicketQty(ticketQuantity);
    }
  }, [ticketQuantity]);
  // === EFFECT 1: Load Ghế ===
  useEffect(() => {
    if(!showtimeId) return;

    const initData = async () => {
        try {
            setLoading(true);
            setSelectedSeats([]);
            setIsTimerActive(false);
            setCountdown(300);

            // 1. Load API
            const response = await fetchSeats(showtimeId);
            const seats = response.data.result.map(item => ({
                ...item.seat,
                status: item.status,
                showtimeSeatId: item.id,
                price: item.seat.seatType ? item.seat.seatType.price : 0,
                seatTypeName: item.seat.seatType ? item.seat.seatType.name : 'NORMAL'
            }));
            setSeatRows(groupSeatsByRow(seats));

            // 2. Restore Logic
            const savedStateJSON = sessionStorage.getItem("bookingState");
            if(savedStateJSON){
                const savedState = JSON.parse(savedStateJSON);
                
                if(savedState.showtimeId === showtimeId){
                    console.log("Phục hồi trạng thái chọn ghế từ sessionStorage");
                    setSelectedSeats(savedState.selectedSeats);

                    // === FIX 2: Restore Ticket Quantity ===
                    if (savedState.ticketQuantity) {
                        setCurrentTicketQty(savedState.ticketQuantity);
                    }

                    const now = Date.now();
                    const remainingTime = Math.floor((savedState.holdDealine - now) / 1000);  
                    
                    if(remainingTime > 0){
                        setCountdown(remainingTime);
                        setIsTimerActive(true);
                    } else {
                        sessionStorage.removeItem("bookingState");
                        alert("Thời gian giữ ghế đã hết. Vui lòng chọn lại ghế.");
                        setSelectedSeats([]);
                    }
                } else {
                    // Different showtime, clear data
                    sessionStorage.removeItem("bookingState");
                    setSelectedSeats([]);
                    setCountdown(300);
                }
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

  // === EFFECT 2: Timer ===
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
      alert("Đã hết thời gian giữ ghế!");
    }
  }, [countdown]);
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setIsTimerActive(false);
      setCountdown(300);
    }
  }, [selectedSeats]);
  // Hàm helper: Xác định ghế này tính mấy vé
  const getSeatTicketValue = (seat) => {
      return seat.seatType?.name === 'COUPLE' ? 2 : 1;
  };
  // === HANDLER: Click ghế ===
  const handleSeatClick = async (seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id); 
    if(!isSelected){
      if(seat.status !== "AVAILABLE"){
        if(seat.status === "BOOKED"){
          alert("Ghế này đã được đặt trước đó!");
          return;
        }
      }
    }   

    if(isSelected){
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      try{
        await releaseSeats(showtimeId, [seat.id]);
        console.log("Đã nhả ghế: ", seat.seatNumber);
      }catch(err){
        console.error("Lỗi nhả ghế: ", err);
      }
    }
    else{
      const currentTicketCount = selectedSeats.reduce((sum, s) => sum + getSeatTicketValue(s), 0);
      const newSeatValue = getSeatTicketValue(seat);
      const limit = currentTicketQty > 0 ? currentTicketQty : 8;
      if (currentTicketCount + newSeatValue > limit) {
        alert(`Chỉ được chọn tối đa ${limit} ghế. {Ghế đôi tính là 2 vé}`);
        return;
      }
      setSelectedSeats((prev) => [...prev, seat]);
      setIsTimerActive(true);
      try{
        await holdSeats(showtimeId, [seat.id]);
      }catch(err){
        console.error("Lỗi giữ ghế: ", err);
        alert("Ghế này vừa bị người khác chọn hoặc lỗi kết nối. Vui lòng chọn ghế khác.");
        setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id)); // Bỏ chọn ghế nếu giữ không thành công
      }
    }
    
  };


  const handleConfirm = async () => {
    const currentTicketCount = selectedSeats.reduce((sum, s) => sum + getSeatTicketValue(s), 0);
    if (currentTicketQty > 0 && currentTicketCount !== currentTicketQty) {
      alert(`Vui lòng chọn đủ ${currentTicketQty} ghế. Hiện tại ${currentTicketCount} ghế đã được chọn.`);
      return;
    }
    const bookingState = {
      selectedSeats: selectedSeats,
      showtimeId: showtimeId,
      ticketQuantity: currentTicketQty,
      holdDealine: Date.now() + countdown * 1000
    }
    sessionStorage.setItem("bookingState", JSON.stringify(bookingState));
    const token = localStorage.getItem("accessToken");
    if(!token){
      const wantToLogin = window.confirm("Bạn cần đăng nhập để tiếp tục thanh toán. Bạn có muốn đăng nhập ngay bây giờ?");
      if(wantToLogin){
        navigator("/login", {state: {from: location}});
      }
      return;
    }
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
      sessionStorage.removeItem("bookingState");
      onNext(bookingData.id);
    }catch (err){
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
            {/* Nhãn hàng (A, B, C...) */}
            <div className="row-label">{row}</div> 
            
            {/* Danh sách ghế (Flex container) */}
            <div className="seats-list"> 
              {seatsInRow.map(seat => {
                const isSelected = selectedSeats.some(s => s.id === seat.id);
                const isOccupied = seat.status === 'OCCUPIED';
                
                // Lấy loại ghế từ object seatType (cần check null cho an toàn)
                const typeName = seat.seatType?.name?.toLowerCase() || 'normal';
                
                return (
                  <div
                    key={seat.id}
                    className={`seat ${typeName} ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSeatClick(seat)}
                    title={`${seat.seatName} - ${formatCurrency(seat.seatType.basePrice)}`}
                  >
                    {/* Hiển thị số ghế hoặc icon đôi */}
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
                disabled={ticketQuantity > 0 ? currentSelectedUnits !== ticketQuantity : selectedSeats.length === 0}
                style={{marginLeft: '20px'}}
            >
                THANH TOÁN
            </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;