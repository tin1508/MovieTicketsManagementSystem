package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCreationRequest {
    String bookingId;
    PaymentStatus paymentStatus;
}
