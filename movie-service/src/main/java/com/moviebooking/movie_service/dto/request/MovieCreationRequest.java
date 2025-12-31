package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.AgeRating;
import com.moviebooking.movie_service.enums.MovieStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieCreationRequest {
    @NotBlank(message = "Movie title cannot be blank")
    @Size(max = 255)
    String title;

    @NotBlank(message = "Director name cannot be blank")
    @Size(max = 100)
    String director;

    @Size(max = 2000, message = "Description is too long")
    String description;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be a positive number")
    Integer duration;

    @NotNull(message = "Actor is required")
    String actors;

    @NotNull(message = "Release date is required")
    LocalDate releaseDate;

    @Size(max = 500)
    String posterUrl;

    @Size(max = 500)
    String trailerUrl;

    @NotNull(message = "Age rating is required")
    AgeRating ageRating;

    @NotNull(message = "Movie status is required")
    MovieStatus movieStatus;

    @NotEmpty(message = "Movie must have at least one genre")
    List<Long> genreIds;
}
