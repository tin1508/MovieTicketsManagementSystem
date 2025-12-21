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

    @ManyToOne
    @JoinColumn(name="movie_id", nullable = false)
    Movie movie;

    @OneToMany(mappedBy = "showtimes", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Booking> bookings;

    @ManyToOne
    @JoinColumn(name="room_id",  nullable=false)
    Room room;
    @OneToMany(mappedBy = "showtimes", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ShowtimeSeat> showtimeSeatList;

    LocalDate showtimesDate;
    LocalTime startTime;
    LocalTime endTime;

    @Enumerated(EnumType.STRING)
    ShowtimeStatus status;
}
