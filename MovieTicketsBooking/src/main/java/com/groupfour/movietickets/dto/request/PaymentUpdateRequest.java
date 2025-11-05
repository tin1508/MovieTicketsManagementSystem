package com.groupfour.movietickets.dto.request;

import com.groupfour.movietickets.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentUpdateRequest {
    PaymentStatus paymentStatus;
}