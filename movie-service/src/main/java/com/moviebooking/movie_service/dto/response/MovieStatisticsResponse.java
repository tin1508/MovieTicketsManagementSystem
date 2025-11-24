package com.moviebooking.movie_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieStatisticsResponse {
    Long totalMovies;
    Long nowShowingCount;
    Long comingSoonCount;
    Long endedCount;
    private Double averageRating;
    private Long moviesWithRating;

    // Thống kê view
    private Long totalViews;
    private Double averageViews;
}
