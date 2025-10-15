package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.AgeRating;
import com.moviebooking.movie_service.enums.MovieStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieCreationRequest {
    String title;
    String director;
    String description;
    Integer duration;
    Double rating;
    LocalDate releaseDate;
    String posterUrl;
    String trailerUrl;
    AgeRating ageRating;
    MovieStatus movieStatus;
}
