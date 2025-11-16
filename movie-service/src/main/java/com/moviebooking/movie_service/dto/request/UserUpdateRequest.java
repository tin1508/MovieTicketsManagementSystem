package com.moviebooking.movie_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String password;
    String firstName;
    String lastName;

    @Pattern(
            regexp = "^(\\+84|0)[0-9]{9}$",
            message = "Invalid phone number. Must be Vietnamese phone format (0xxxxxxxxx or +84xxxxxxxxx)"
    )
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    LocalDate dob;


}