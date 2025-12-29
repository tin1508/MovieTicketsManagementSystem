package com.moviebooking.movie_service.service;


import com.moviebooking.movie_service.dto.request.PaymentCreationRequest;
import com.moviebooking.movie_service.dto.request.PaymentUpdateRequest;
import com.moviebooking.movie_service.dto.request.SePayWebhookRequest;
import com.moviebooking.movie_service.dto.response.PaymentResponse;
import com.moviebooking.movie_service.entity.Booking;
import com.moviebooking.movie_service.entity.Payment;
import com.moviebooking.movie_service.enums.BookingStatus;
import com.moviebooking.movie_service.enums.PaymentStatus;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.PaymentMapper;
import com.moviebooking.movie_service.repository.BookingRepository;
import com.moviebooking.movie_service.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {
    PaymentRepository paymentRepository;
    PaymentMapper paymentMapper;
    BookingRepository bookingRepository;
    BookingService bookingService;

    @NonFinal
    @Value("${sePay.bank.account}")
    String bankAccount;

    @NonFinal
    @Value("${sePay.bank.name}")
    String bankName;

    @NonFinal
    @Value("${sePay.template}")
    String template;


    public PaymentResponse createPayment(PaymentCreationRequest request){
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND));

        if(booking.getStatus() == BookingStatus.CONFIRMED){
            throw new AppException(ErrorCode.BOOKING_PAID);
        }
        Optional<Payment> existedPayment = paymentRepository.findByBookingIdAndPaymentStatus(booking.getId(), PaymentStatus.PENDING);
        if(existedPayment.isPresent()){
            return paymentMapper.toPaymentResponse(existedPayment.get());
        }
        Payment payment = paymentMapper.toPayment(request);
        payment.setBooking(booking);
        booking.setPayment(payment);
        payment.setAmount(booking.getTotalPrice());
        payment.setCreatedAt(LocalDateTime.now());

        //create transaction id
        String transactionId = booking.getBookingCode();
        payment.setTransactionId(transactionId);
        payment.setQrBankUrl(createQrBankCode(transactionId, payment.getAmount()));
        if(request.getPaymentStatus() == null)  payment.setPaymentStatus(PaymentStatus.PENDING);

        return paymentMapper.toPaymentResponse(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponse updatePayment(String id, PaymentUpdateRequest request){
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOTFOUND));
        paymentMapper.updatePayment(payment, request);
        if(payment.getPaymentStatus() == PaymentStatus.SUCCESSFUL){
            Booking booking = payment.getBooking();
            if(booking != null){
                booking.setStatus(BookingStatus.CONFIRMED);
                bookingRepository.save(booking);
            }
        }
        return paymentMapper.toPaymentResponse(paymentRepository.save(payment));
    }

    public void deletePayment(String id){
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOTFOUND));
        paymentRepository.deleteById(payment.getId());
    }
    public PaymentResponse getPaymentById(String id){
        return paymentMapper.toPaymentResponse(paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOTFOUND)));
    }
    public List<PaymentResponse> getPayments(){
        return paymentRepository.findAll().stream().map(paymentMapper::toPaymentResponse).toList();
    }
    private String createQrBankCode(String transactionId, BigDecimal amount){
        return String.format(
                "https://qr.sepay.vn/img?acc=%s&bank=%s&amount=%s&des=%s&template=%s",
                bankAccount,
                bankName,
                amount.toPlainString(),
                URLEncoder.encode(transactionId, StandardCharsets.UTF_8),
                template
        );
    }
    public void processSePayWebhook(SePayWebhookRequest request){
        String[] contents = request.getContent().trim().split("[\\s-]+");
        String transactionId = contents[1];
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOTFOUND));
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESSFUL) {
            return;
        }
        if(request.getTransferAmount().compareTo(payment.getAmount()) >= 0){
            payment.setPaymentStatus(PaymentStatus.SUCCESSFUL);
            try{
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime paidTime = LocalDateTime.parse(request.getTransactionDate(), dtf);
                payment.setProcessAt(paidTime);
            } catch(Exception e){
                payment.setProcessAt(LocalDateTime.now());
            }

            paymentRepository.save(payment);
            Booking booking = payment.getBooking();
            if(booking != null){
                bookingService.confirmBooking(booking.getId());
            }
        }
    }
}
