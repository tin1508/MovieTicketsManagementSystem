package com.moviebooking.movie_service.controller;


import com.moviebooking.movie_service.dto.request.ChangePasswordRequest;
import com.moviebooking.movie_service.dto.request.ProfileUpdateRequest;
import com.moviebooking.movie_service.dto.request.UserCreationRequest;
import com.moviebooking.movie_service.dto.request.UserUpdateRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.PageResponse;
import com.moviebooking.movie_service.dto.response.UserResponse;
import com.moviebooking.movie_service.entity.User;
import com.moviebooking.movie_service.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @PostMapping
    ApiResponse<User> createUser(@Valid @RequestBody UserCreationRequest request) {
        ApiResponse<User> apiResponse = new ApiResponse<>();

        apiResponse.setResult(userService.createUser(request));
        return apiResponse;
    }

    @GetMapping // Đảm bảo có annotation này
    public ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String search
    ) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}", authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority ->
                log.info(grantedAuthority.getAuthority()));

        // Gọi service với tham số page và size
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.getUsers(page, size, search))
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyinfo())
                .build();
    }

    @PutMapping("/myInfo")
    ApiResponse<UserResponse> updateMyInfo(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ProfileUpdateRequest request){
        String username = jwt.getSubject();

        return ApiResponse.<UserResponse>builder()
                .result(userService.updateMyinfo(username, request))
                .build();
    }


    @PutMapping("/{userId}")
    UserResponse updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    String deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return "User has been delete";
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> toggleUserStatus(@PathVariable String id){
        userService.toggleUserStatus(id);
        return ResponseEntity.ok("User status has been changed");
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal Jwt jwt, // <-- 1. Sửa: Lấy Jwt từ Security Context
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        // 2. Sửa: Lấy username (hoặc userId) từ Jwt
        String username = jwt.getSubject();

        // Gọi service (lưu ý: service của bạn cần tìm user theo username này)
        userService.changePassword(username, request);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Password changed successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalUsers() {
        long totalUsers = userService.getTotalUsers();
        return ResponseEntity.ok(totalUsers);
    }
}
