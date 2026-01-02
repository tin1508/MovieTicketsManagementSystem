package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.BookingCreationRequest;
import com.moviebooking.movie_service.dto.request.BookingUpdateRequest;
import com.moviebooking.movie_service.dto.response.BookingsResponse;
import com.moviebooking.movie_service.entity.*;
import com.moviebooking.movie_service.enums.BookingStatus;
import com.moviebooking.movie_service.enums.ShowtimeSeatStatus;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.BookingsMapper;
import com.moviebooking.movie_service.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {

    BookingRepository bookingRepository;
    BookingsMapper bookingsMapper;
    ShowtimesRepository showtimesRepository;
    UserRepository userRepository;
    ShowtimeSeatRepository showtimeSeatRepository;
    BookingDetailRepository bookingDetailRepository;
    EmailService emailService;

    @Transactional
    public BookingsResponse createBookings(BookingCreationRequest request){

        User user = userRepository.findByUsername(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Showtimes showtime = showtimesRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIMES_NOTFOUND));

        Booking bookings = bookingsMapper.toBooking(request);

        bookings.setUser(user);
        bookings.setShowtimes(showtime);
        //create unique booking code
        String uniqueBookingCode = generateUniqueBookingCode();
        bookings.setBookingCode(uniqueBookingCode);

        if(bookings.getStatus() == null) bookings.setStatus(BookingStatus.PENDING);

        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);
        bookings.setExpiresAt(expirationTime);
        bookings = bookingRepository.save(bookings);

        List<BookingDetail> details = new ArrayList<>();
        List<ShowtimeSeat> seatsToUpdate = new ArrayList<>();
        BigDecimal calculatedTotalPrice = BigDecimal.ZERO;


        int totalSeats = 0;
        for(String showtimeSeatId : request.getShowtimeSeatIds()){
            ShowtimeSeat stSeat = showtimeSeatRepository.findById(showtimeSeatId)
                    .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_SEAT_NOTFOUND));
            if(stSeat.getStatus() == ShowtimeSeatStatus.BOOKED){
                throw new AppException(ErrorCode.SEAT_ERROR);
            }
            stSeat.setStatus(ShowtimeSeatStatus.HOLDING);
            stSeat.setHoldExpiredAt(expirationTime);

            BookingDetail detail = new BookingDetail();
            detail.setBooking(bookings);
            detail.setShowtimeSeat(stSeat);

            BigDecimal seatPrice = stSeat.getSeat().getBasePrice();
            detail.setPrice(seatPrice);
            details.add(detail);

            calculatedTotalPrice = calculatedTotalPrice.add(seatPrice);
            seatsToUpdate.add(stSeat);
            totalSeats += stSeat.getSeat().getSeatType().getName().equals("COUPLE") ? 2 : 1;
        }

        bookingDetailRepository.saveAll(details);
        showtimeSeatRepository.saveAll(seatsToUpdate);
        bookings.setTotalPrice(calculatedTotalPrice);
        bookings.setTicketQuantity(totalSeats);
        if(bookings.getBookingDetails() == null) bookings.setBookingDetails(new ArrayList<>());
        bookings.getBookingDetails().addAll(details);


        return bookingsMapper.toBookingResponse(bookingRepository.save(bookings));
    }

    public BookingsResponse confirmBooking(String id){
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND));
        if(booking.getStatus() != BookingStatus.PENDING){
            throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
        }

        if(!booking.getBookingDetails().isEmpty()){
            if(booking.getExpiresAt() != null && LocalDateTime.now().isAfter(
                    booking.getBookingDetails().getFirst().getShowtimeSeat().getHoldExpiredAt())){
                throw new AppException(ErrorCode.SEAT_HOLD_EXPIRED);
            }
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setBookingDate(LocalDate.now());
        for(BookingDetail detail : booking.getBookingDetails()) {
            ShowtimeSeat seat = detail.getShowtimeSeat();
            seat.setStatus(ShowtimeSeatStatus.BOOKED);
            seat.setHoldExpiredAt(null);
        }

        showtimeSeatRepository.saveAll(booking.getBookingDetails().stream().map(BookingDetail::getShowtimeSeat).toList());
        Booking savedBooking = bookingRepository.save(booking);
        if(savedBooking.getUser() != null && savedBooking.getUser().getEmail() != null){
            emailService.sendBookingConfirmation(savedBooking.getUser().getEmail(), savedBooking);
        }

        return  bookingsMapper.toBookingResponse(savedBooking);
    }

    public BookingsResponse cancelBooking(String id){
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND));
        if(booking.getStatus() != BookingStatus.CONFIRMED){
            throw new AppException(ErrorCode.BOOKING_STATUS_INVALID);
        }
        if(LocalDateTime.now().isAfter(booking.getExpiresAt())){
            throw new AppException(ErrorCode.BOOKING_EXPIRED);
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingsMapper.toBookingResponse(bookingRepository.save(booking));
    }

    public BookingsResponse updateBooking(String id, BookingUpdateRequest request){
        Booking bookings = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND));
        if(request.getStatus() == BookingStatus.CONFIRMED && bookings.getStatus() != BookingStatus.CONFIRMED) bookings.setBookingDate(LocalDate.now());
        bookingsMapper.updateBooking(bookings, request);
        return bookingsMapper.toBookingResponse(bookingRepository.save(bookings));
    }



    public void deleteBooking(String id){
        Booking bookings = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND));
        bookingRepository.deleteById(bookings.getId());
    }

    public List<BookingsResponse> getBookings(){
        return bookingRepository.findAll().stream().map(bookingsMapper::toBookingResponse).toList();
    }
    public BookingsResponse getBookingById(String id) {
        return bookingsMapper.toBookingResponse(bookingRepository.findByIdFullInfo(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND)));
    }

    public List<BookingsResponse> getBookingsByUserId(String userId){
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDate(userId);

        return bookings.stream()
                .map(bookingsMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    private String generateUniqueBookingCode(){
        String code;
        do{
            code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }while(bookingRepository.existsByBookingCode(code));
        return code;
    }
}
