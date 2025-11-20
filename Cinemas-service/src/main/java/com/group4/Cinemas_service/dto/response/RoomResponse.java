package com.group4.Cinemas_service.dto.response;

import lombok.Data;

@Data
public class RoomResponse {
    private Long id;
    private String name;
    private int totalRows;
    private int seatsPerRow;
    private Long cinemaId;
}

