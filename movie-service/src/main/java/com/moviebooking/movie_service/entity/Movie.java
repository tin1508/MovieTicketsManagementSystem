package com.moviebooking.movie_service.entity;

import com.moviebooking.movie_service.enums.AgeRating;
import com.moviebooking.movie_service.enums.MovieStatus;
import jakarta.persistence.*;
import jakarta.transaction.UserTransaction;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String title;
    String director;
    String description;
    Integer duration;
    Double rating;
    LocalDate releaseDate;
    String posterUrl;
    String trailerUrl;
    Long viewCount;

    @Enumerated(EnumType.STRING)
    AgeRating ageRating;

    @Enumerated(EnumType.STRING)
    MovieStatus movieStatus;

    @ManyToMany
    Set<Genre> genres;

}
