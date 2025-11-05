package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.BookingDetailCreationRequest;
import com.groupfour.movietickets.dto.request.BookingDetailUpdateRequest;
import com.groupfour.movietickets.dto.response.BookingDetailResponse;
import com.groupfour.movietickets.entity.BookingDetail;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class BookingDetailMapperImpl implements BookingDetailMapper {

    @Override
    public BookingDetail toBookingDetail(BookingDetailCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        BookingDetail bookingDetail = new BookingDetail();

        bookingDetail.setId( request.getId() );

        return bookingDetail;
    }

    @Override
    public BookingDetailResponse toBookingDetailResponse(BookingDetail bookingDetail) {
        if ( bookingDetail == null ) {
            return null;
        }

        BookingDetailResponse.BookingDetailResponseBuilder bookingDetailResponse = BookingDetailResponse.builder();

        bookingDetailResponse.id( bookingDetail.getId() );

        return bookingDetailResponse.build();
    }

    @Override
    public void updateBookingDetail(BookingDetail bookingDetail, BookingDetailUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getId() != null ) {
            bookingDetail.setId( request.getId() );
        }
    }
}
