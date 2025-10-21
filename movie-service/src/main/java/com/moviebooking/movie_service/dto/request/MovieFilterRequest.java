package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.AgeRating;
import com.moviebooking.movie_service.enums.MovieStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieFilterRequest {
    String keyword;
    MovieStatus movieStatus;
    Long genreId;
    AgeRating ageRating;
    Double minRating;
    Double maxRating;
}
