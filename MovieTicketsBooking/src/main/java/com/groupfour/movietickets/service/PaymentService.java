package com.groupfour.movietickets.service;

import com.groupfour.movietickets.Exception.AppException;
import com.groupfour.movietickets.Exception.ErrorCode;
import com.groupfour.movietickets.dto.request.PaymentCreationRequest;
import com.groupfour.movietickets.dto.request.PaymentUpdateRequest;
import com.groupfour.movietickets.dto.response.PaymentResponse;
import com.groupfour.movietickets.entity.Booking;
import com.groupfour.movietickets.entity.Payment;
import com.groupfour.movietickets.enums.BookingStatus;
import com.groupfour.movietickets.enums.PaymentMethod;
import com.groupfour.movietickets.enums.PaymentStatus;
import com.groupfour.movietickets.mapper.PaymentMapper;
import com.groupfour.movietickets.repository.BookingRepository;
import com.groupfour.movietickets.repository.PaymentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentService {
    PaymentRepository paymentRepository;
    PaymentMapper paymentMapper;
    BookingRepository bookingRepository;

    public PaymentResponse createPayment(PaymentCreationRequest request){
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND));

        if(booking.getStatus() == BookingStatus.CONFIRMED){
            throw new AppException(ErrorCode.BOOKING_PAID);
        }
        Payment payment = paymentMapper.toPayment(request);
        payment.setBooking(booking);
        booking.setPayment(payment);
        payment.setAmount(booking.getTotalPrice());

        //create transaction id
        String transactionId = "userName" + "-" + booking.getBookingCode();
        payment.setTransactionId(transactionId);
        payment.setQrBankUrl(createQrBankCode(payment.getTransactionId(), payment.getAmount()));
        if(request.getPaymentStatus() == null)  payment.setPaymentStatus(PaymentStatus.PENDING);

        return paymentMapper.toPaymentResponse(paymentRepository.save(payment));
    }
    public PaymentResponse updatePayment(String id, PaymentUpdateRequest request){
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOTFOUND));
        paymentMapper.updatePayment(payment, request);
        return paymentMapper.toPaymentResponse(paymentRepository.save(payment));
    }

    public void deletePayment(String id){
        paymentRepository.deleteById(id);
    }
    public PaymentResponse getPaymentById(String id){
        return paymentMapper.toPaymentResponse(paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOTFOUND)));
    }
    public List<PaymentResponse> getPayments(){
        return paymentRepository.findAll().stream().map(paymentMapper::toPaymentResponse).toList();
    }
    private String createQrBankCode(String transactionId, double amount){
        try{
            String bankBin = "970422";
            String accountNo = "0764386915";
            String accountName = "Nguyen Minh Hoang";
            String encodedName = URLEncoder.encode(accountName, StandardCharsets.UTF_8);
            String encodedMemo = URLEncoder.encode(transactionId, StandardCharsets.UTF_8);
            return String.format(
                    "https://api.vietqr.io/image/%s-%s-print.png?amount=%.0f&addInfo=%s&accountName=%s",
                    bankBin,
                    accountNo,
                    amount,
                    encodedMemo,
                    encodedName
            );
        }catch(Exception e){
            throw new AppException(ErrorCode.QR_GENERATION_FAILED);
        }
    }
}
