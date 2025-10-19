package com.moviebooking.movie_service.dto.response;

import com.moviebooking.movie_service.enums.AgeRating;
import com.moviebooking.movie_service.enums.MovieStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieResponse {
    String id;
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

    Set<GenreResponse>genres ;
}
