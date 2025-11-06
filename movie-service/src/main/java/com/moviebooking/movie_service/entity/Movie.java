package com.moviebooking.movie_service.entity;

import com.moviebooking.movie_service.enums.AgeRating;
import com.moviebooking.movie_service.enums.MovieStatus;
import jakarta.persistence.*;
import jakarta.transaction.UserTransaction;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.HashSet;
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

    @Column(nullable = false)
    String title;

    @Column(nullable = false)
    String director;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(nullable = false)
    Integer duration;

    Double rating = 0.0;

    @Column(nullable = false)
    LocalDate releaseDate;

    String posterUrl;
    String trailerUrl;


    Long viewCount = 0L;
    boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AgeRating ageRating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    MovieStatus movieStatus;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    Set<Genre> genres = new HashSet<>();

}
