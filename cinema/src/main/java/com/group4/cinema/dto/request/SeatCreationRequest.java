package com.group4.cinema.dto.request;

import com.group4.cinema.enums.SeatType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class SeatCreationRequest {
    private String roomId;
    private String row;
    private int seatNo;
    private SeatType seatType;
}
