package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.PaymentCreationRequest;
import com.moviebooking.movie_service.dto.request.PaymentUpdateRequest;
import com.moviebooking.movie_service.dto.response.PaymentResponse;
import com.moviebooking.movie_service.entity.Payment;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {BookingsMapper.class})
public interface PaymentMapper {
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now(java.time.ZoneId.of(\"Asia/Ho_Chi_Minh\")))")
    Payment toPayment(PaymentCreationRequest request);

    PaymentResponse toPaymentResponse(Payment payment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePayment(@MappingTarget Payment payment, PaymentUpdateRequest request);
}
