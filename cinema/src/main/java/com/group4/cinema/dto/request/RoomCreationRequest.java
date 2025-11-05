package com.group4.cinema.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomCreationRequest {
    private String name;
    private int totalSeats;
    private int totalRows;
    private int seatsPerRow;
    private String cinemaId;
}
