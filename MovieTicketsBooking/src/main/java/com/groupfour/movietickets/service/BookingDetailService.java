package com.groupfour.movietickets.service;

import com.groupfour.movietickets.Exception.AppException;
import com.groupfour.movietickets.Exception.ErrorCode;
import com.groupfour.movietickets.dto.request.BookingDetailCreationRequest;
import com.groupfour.movietickets.dto.request.BookingDetailUpdateRequest;
import com.groupfour.movietickets.dto.response.BookingDetailResponse;
import com.groupfour.movietickets.entity.BookingDetail;
import com.groupfour.movietickets.mapper.BookingDetailMapper;
import com.groupfour.movietickets.repository.BookingDetailRepository;
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

    public void deleteBookingDetail(String id){bookingDetailRepository.deleteById(id);}

    public List<BookingDetailResponse> getBookingDetails(){
        return bookingDetailRepository.findAll().stream().map(bookingDetailMapper::toBookingDetailResponse).toList();
    }

    public BookingDetailResponse getBookingDetailById(String id){
        return bookingDetailMapper.toBookingDetailResponse(bookingDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_DETAIL_NOTFOUND)));
    }
}
