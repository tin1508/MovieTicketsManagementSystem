package com.group4.Cinemas_service.dto.request;

import lombok.Data;

@Data
public class RoomCreationRequest {
    private String name;
    private int totalRows;
    private int seatsPerRow;
    private Long cinemaId;
}
