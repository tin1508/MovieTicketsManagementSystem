package com.group4.cinema.dto.request;

import com.group4.cinema.enums.SeatType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatUpdateRequest {
    private String row;
    private int seatNo;
    private SeatType seatType;
}
