package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.AgeRating;
import com.moviebooking.movie_service.enums.MovieStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieFilterRequest {
    String keyword;
    MovieStatus movieStatus;
    List<Long> genreIds;
    AgeRating ageRating;
    Double minRating;
    Double maxRating;
    Integer year;
}
