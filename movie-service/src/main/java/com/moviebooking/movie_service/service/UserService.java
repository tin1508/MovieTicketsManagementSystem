package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.ChangePasswordRequest;
import com.moviebooking.movie_service.dto.request.ProfileUpdateRequest;
import com.moviebooking.movie_service.dto.request.UserCreationRequest;

import com.moviebooking.movie_service.dto.request.UserUpdateRequest;
import com.moviebooking.movie_service.dto.response.UserResponse;
import com.moviebooking.movie_service.entity.User;
import com.moviebooking.movie_service.enums.Role;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.UserMapper;
import com.moviebooking.movie_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public User createUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);

        if(userRepository.existsByEmail(request.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXISTED);

        if (request.getPhoneNumber() != null &&
                userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }

        if(!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.UNCORRECT_PASSWORD);
        }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public UserResponse getMyinfo() {
        var context =  SecurityContextHolder.getContext();
        String name =  context.getAuthentication().getName();
        User user = userRepository.findByUsername(name).orElseThrow(
                ()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateMyinfo(String username, ProfileUpdateRequest request){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUserProfile(user, request);
        return  userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->new RuntimeException("User not found"));

        userMapper.updateUser(user,request);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("In method get Users");
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse).toList();
    }
    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUser(String id) {
        log.info("In method get user by Id");
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() ->new RuntimeException("User not found")));
    }
    @PreAuthorize("hasRole('ADMIN')")
    public long getTotalUsers() {
        log.info("In method get total users count");
        return userRepository.count();
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request){
        if (!request.getNewPassword().equals(request.getConfirmPassword()))
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);

        User user = userRepository.findByUsername(username).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.OLD_PASSWORD_INCORRECT);
        }

        // 4. Check new password khác old password
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.SAME_PASSWORD);
        }

        String hashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(hashedPassword);

        userRepository.save(user);
    }
}   