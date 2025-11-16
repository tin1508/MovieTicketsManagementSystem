package com.moviebooking.movie_service.mapper;


import com.moviebooking.movie_service.dto.request.ProfileUpdateRequest;
import com.moviebooking.movie_service.dto.request.UserCreationRequest;
import com.moviebooking.movie_service.dto.request.UserUpdateRequest;
import com.moviebooking.movie_service.dto.response.UserResponse;
import com.moviebooking.movie_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
    void updateUserProfile(@MappingTarget User user, ProfileUpdateRequest request);
}