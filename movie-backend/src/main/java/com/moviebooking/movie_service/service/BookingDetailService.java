package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.BookingDetailCreationRequest;
import com.moviebooking.movie_service.dto.request.BookingDetailUpdateRequest;
import com.moviebooking.movie_service.dto.response.BookingDetailResponse;
import com.moviebooking.movie_service.entity.BookingDetail;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.BookingDetailMapper;
import com.moviebooking.movie_service.repository.BookingDetailRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingDetailService {
    BookingDetailRepository bookingDetailRepository;
    BookingDetailMapper bookingDetailMapper;

    public BookingDetailResponse createBookingDetail(BookingDetailCreationRequest request){
        BookingDetail bookingDetail = bookingDetailMapper.toBookingDetail(request);
        return bookingDetailMapper.toBookingDetailResponse(bookingDetailRepository.save(bookingDetail));
    }

    public BookingDetailResponse updateBookingDetail(String id, BookingDetailUpdateRequest request){
        BookingDetail bookingDetail = bookingDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_DETAIL_NOTFOUND));
        bookingDetailMapper.updateBookingDetail(bookingDetail, request);
        return bookingDetailMapper.toBookingDetailResponse(bookingDetailRepository.save(bookingDetail));
    }

    public void deleteBookingDetail(String id){
        BookingDetail bookingDetail = bookingDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_DETAIL_NOTFOUND));
        bookingDetailRepository.deleteById(bookingDetail.getId());
    }

    public List<BookingDetailResponse> getBookingDetails(){
        return bookingDetailRepository.findAll().stream().map(bookingDetailMapper::toBookingDetailResponse).toList();
    }

    public BookingDetailResponse getBookingDetailById(String id){
        return bookingDetailMapper.toBookingDetailResponse(bookingDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_DETAIL_NOTFOUND)));
    }
}