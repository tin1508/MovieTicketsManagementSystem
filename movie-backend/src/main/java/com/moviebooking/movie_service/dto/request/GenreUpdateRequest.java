package com.moviebooking.movie_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GenreUpdateRequest {
    @NotBlank(message = "Genre cannot be blank")
    @Size(min = 3, max = 100, message = "Genre name must be between 3 and 100 characters")
    String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    String description;
}
