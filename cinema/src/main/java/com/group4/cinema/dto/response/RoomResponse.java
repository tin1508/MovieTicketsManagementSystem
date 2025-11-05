package com.group4.cinema.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {
    private String id;
    private String name;
    private int totalSeats;
    private int totalRows;
    private int seatsPerRow;
    private String cinemaId;
    private String cinemaName;
}
