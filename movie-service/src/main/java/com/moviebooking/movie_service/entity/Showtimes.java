package com.moviebooking.movie_service.entity;

import com.moviebooking.movie_service.enums.ShowtimeStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name="showtimes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Showtimes {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String movieId;
    String roomId;
    @OneToMany(mappedBy = "showtimes")
    List<ShowtimeSeat> showtimeSeatList;

    LocalDate showtimesDate;
    LocalTime startTime;
    LocalTime endTime;

    @Enumerated(EnumType.STRING)
    ShowtimeStatus status;
}
