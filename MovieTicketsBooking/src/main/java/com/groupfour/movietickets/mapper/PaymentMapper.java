package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.PaymentCreationRequest;
import com.groupfour.movietickets.dto.request.PaymentUpdateRequest;
import com.groupfour.movietickets.dto.response.PaymentResponse;
import com.groupfour.movietickets.entity.Payment;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now(java.time.ZoneId.of(\"Asia/Ho_Chi_Minh\")))")
    @Mapping(target = "paymentMethod", constant = "BANK_TRANSFER")
    Payment toPayment(PaymentCreationRequest request);

    PaymentResponse toPaymentResponse(Payment payment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePayment(@MappingTarget Payment payment, PaymentUpdateRequest request);
}
