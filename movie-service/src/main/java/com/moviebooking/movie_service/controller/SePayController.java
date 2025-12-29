package com.moviebooking.movie_service.controller;


import com.moviebooking.movie_service.dto.request.SePayWebhookRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sePay-webhook")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SePayController {
    PaymentService paymentService;

    @NonFinal
    @Value("${sePay.api.key}")
    String myApiToken;

    @PostMapping
    public ApiResponse<String> handleSePayWebhook(@RequestHeader(value="Authorization", required = false) String authorizationHeader, @RequestBody SePayWebhookRequest request){
        log.info("SePayWebhook request received : {}", request);
        log.info("My Token in config: {}",  myApiToken);

        if(authorizationHeader == null){
            log.warn("Webhook is inadequate authorization header");
            return ApiResponse.<String>builder().code(401).message("Unauthorized").build();
        }
        if(!authorizationHeader.contains(myApiToken)){
            log.warn("Token is invalid. {}", authorizationHeader);
            return ApiResponse.<String>builder().code(403).message("Forbidden").build();
        }
        try{
            paymentService.processSePayWebhook(request);
            return ApiResponse.<String>builder().message("Success").build();
        }catch(Exception e){
            log.error("SePayWebhook request processing error : {}", e.getMessage());
            return ApiResponse.<String>builder().message(e.getMessage()).build();
        }

    }
}
