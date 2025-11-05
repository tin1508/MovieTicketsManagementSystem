package com.groupfour.movietickets.dto.request;

import com.groupfour.movietickets.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructorsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCreationRequest {
    String bookingId;
    PaymentStatus paymentStatus;
}
