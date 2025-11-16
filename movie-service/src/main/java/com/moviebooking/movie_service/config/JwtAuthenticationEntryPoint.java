package com.moviebooking.movie_service.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.exception.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/api/v1/movies") ||
                requestURI.startsWith("/api/v1/genres") ||
                requestURI.startsWith("/api/v1/public")) {
            // Đừng xử lý gì, để request đi tiếp
            return;
        }
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        response.flushBuffer();
    }
}