package com.moviebooking.movie_service.entity;

import com.moviebooking.movie_service.enums.RoomStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name="room")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true)
    String name;

    Integer totalSeats;
    Integer totalRows;
    Integer seatsPerRow;

    @ManyToOne
    @JoinColumn(name="cinema_id", nullable = false)
    Cinema cinema;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Seat> seats;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Showtimes> showtimes;

    @Enumerated(EnumType.STRING)
    RoomStatus status;
}