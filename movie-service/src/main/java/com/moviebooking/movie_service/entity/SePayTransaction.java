package com.moviebooking.movie_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name="sepay_transaction")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SePayTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String gateway;
    LocalDateTime transactionDate;
    String accountNumber;
    String subAccount;
    String content;
    String transferType;
    BigDecimal amount;
    String referenceCode;
    String description;

    String bookingId;
}
