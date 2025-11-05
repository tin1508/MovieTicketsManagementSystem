package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.PaymentCreationRequest;
import com.groupfour.movietickets.dto.request.PaymentUpdateRequest;
import com.groupfour.movietickets.dto.response.PaymentResponse;
import com.groupfour.movietickets.entity.Payment;
import com.groupfour.movietickets.enums.PaymentMethod;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class PaymentMapperImpl implements PaymentMapper {

    @Override
    public Payment toPayment(PaymentCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Payment payment = new Payment();

        payment.setPaymentStatus( request.getPaymentStatus() );

        payment.setCreatedAt( java.time.LocalDateTime.now(java.time.ZoneId.of("Asia/Ho_Chi_Minh")) );
        payment.setPaymentMethod( PaymentMethod.BANK_TRANSFER );

        return payment;
    }

    @Override
    public PaymentResponse toPaymentResponse(Payment payment) {
        if ( payment == null ) {
            return null;
        }

        PaymentResponse.PaymentResponseBuilder paymentResponse = PaymentResponse.builder();

        paymentResponse.transactionId( payment.getTransactionId() );
        paymentResponse.amount( payment.getAmount() );
        paymentResponse.paymentMethod( payment.getPaymentMethod() );
        paymentResponse.qrBankUrl( payment.getQrBankUrl() );
        paymentResponse.paymentStatus( payment.getPaymentStatus() );
        paymentResponse.createdAt( payment.getCreatedAt() );
        paymentResponse.processAt( payment.getProcessAt() );

        return paymentResponse.build();
    }

    @Override
    public void updatePayment(Payment payment, PaymentUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getPaymentStatus() != null ) {
            payment.setPaymentStatus( request.getPaymentStatus() );
        }
    }
}
