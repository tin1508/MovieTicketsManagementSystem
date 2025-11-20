package com.group4.Cinemas_service.dto.response;
import lombok.Data;

@Data
public class SeatResponse {
    private Long id;
    private String rowName;
    private int seatNumber;
    private String seatCode;
    private Long roomId;
}
