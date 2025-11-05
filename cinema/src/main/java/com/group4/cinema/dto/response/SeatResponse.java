package com.group4.cinema.dto.response;

import com.group4.cinema.enums.SeatType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatResponse {
    private String id;
    private String roomId;
    private String row;
    private int seatNo;
    private SeatType seatType;
}
