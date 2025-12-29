package com.moviebooking.movie_service.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SePayWebhookRequest {
    Long id;
    String gateway;
    String transactionDate;
    String accountNumber;
    String subAccount;
    String content;
    String transferType;
    BigDecimal transferAmount;
    String referenceCode;
    String description;
}
