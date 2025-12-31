package com.moviebooking.movie_service.dto.response;

import com.moviebooking.movie_service.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    String id;
    BookingsResponse booking;
    String transactionId;
    BigDecimal amount;
    String qrBankUrl;
    PaymentStatus paymentStatus;
    LocalDateTime createdAt;
    LocalDateTime processAt;
}