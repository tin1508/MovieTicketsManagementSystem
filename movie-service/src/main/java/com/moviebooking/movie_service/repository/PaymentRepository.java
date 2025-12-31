package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Payment;
import com.moviebooking.movie_service.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByBookingIdAndPaymentStatus(String id, PaymentStatus paymentStatus);
}