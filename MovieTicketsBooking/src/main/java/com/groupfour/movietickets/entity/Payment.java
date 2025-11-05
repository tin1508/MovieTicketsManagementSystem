package com.groupfour.movietickets.entity;

import com.groupfour.movietickets.enums.PaymentMethod;
import com.groupfour.movietickets.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name="payments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @OneToOne
    @JoinColumn(name = "booking_id")
    Booking booking;
    String transactionId;
    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod;
    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus;
    double amount;
    String qrBankUrl;
    LocalDateTime createdAt;
    LocalDateTime processAt;
}
