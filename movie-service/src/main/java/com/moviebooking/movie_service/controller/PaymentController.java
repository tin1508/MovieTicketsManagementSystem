package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.PaymentCreationRequest;
import com.moviebooking.movie_service.dto.request.PaymentUpdateRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.PaymentResponse;
import com.moviebooking.movie_service.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;

    @PostMapping
    ApiResponse<PaymentResponse> createPayments(@RequestBody PaymentCreationRequest request){
        return ApiResponse.<PaymentResponse>builder().result(paymentService.createPayment(request)).build();
    }

    //    @PostMapping("/payment-callback")
//    ApiResponse<PaymentResponse> handleBankingPaymentSuccess(@RequestBody )
    @GetMapping
    ApiResponse<List<PaymentResponse>> getPayments(){
        return ApiResponse.<List<PaymentResponse>>builder().result(paymentService.getPayments()).build();
    }

    @GetMapping("/{paymentId}")
    ApiResponse<PaymentResponse> getPayment(@PathVariable("paymentId") String id){
        return ApiResponse.<PaymentResponse>builder().result(paymentService.getPaymentById(id)).build();
    }

    @PutMapping("/{paymentId}")
    ApiResponse<PaymentResponse> updatePayment(@PathVariable("paymentId") String id, @RequestBody PaymentUpdateRequest request){
        return ApiResponse.<PaymentResponse>builder().result(paymentService.updatePayment(id, request)).build();
    }

    @PatchMapping("/{paymentId}")
    ApiResponse<PaymentResponse> patchPayment(@PathVariable("paymentId") String id, @RequestBody PaymentUpdateRequest request){
        return ApiResponse.<PaymentResponse>builder().result(paymentService.updatePayment(id, request)).build();
    }
    @DeleteMapping("/{paymentId}")
    ApiResponse<String> deletePayment(@PathVariable("paymentId") String id){
        paymentService.deletePayment(id);
        return ApiResponse.<String>builder().result("Payment has been deleted!!!").build();
    }
}
