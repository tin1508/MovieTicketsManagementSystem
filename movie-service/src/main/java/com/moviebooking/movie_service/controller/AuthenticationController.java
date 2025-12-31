package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.AuthenticationRequest;
import com.moviebooking.movie_service.dto.request.IntrospectRequest;
import com.moviebooking.movie_service.dto.request.LogoutRequest;
import com.moviebooking.movie_service.dto.request.ResetPasswordRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.AuthenticationResponse;
import com.moviebooking.movie_service.dto.response.IntrospectResponse;
import com.moviebooking.movie_service.service.AuthenticationService;
import com.moviebooking.movie_service.service.UserService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    UserService userService;

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request)
            throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestParam String email){
        userService.forgotPassword(email);
        return ApiResponse.<String>builder()
                .result("Please check your email to get password")
                .build();
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@RequestBody ResetPasswordRequest request){
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ApiResponse.<String>builder()
                .result("Password has been changed")
                .build();
    }
}
