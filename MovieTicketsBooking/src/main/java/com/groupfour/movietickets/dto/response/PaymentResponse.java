package com.groupfour.movietickets.dto.response;

import com.groupfour.movietickets.enums.PaymentMethod;
import com.groupfour.movietickets.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    String transactionId;
    double amount;
    PaymentMethod paymentMethod;
    String qrBankUrl;
    PaymentStatus paymentStatus;
    LocalDateTime createdAt;
    LocalDateTime processAt;
}
