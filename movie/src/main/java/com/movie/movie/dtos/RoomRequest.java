package com.movie.movie.dtos;

import com.movie.movie.domain.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoomRequest {
    private String name;
    private RoomType roomType;
    private String screenPosition;
    private String screenSize;
    private String soundSystem;
    private Integer totalSeats;
    private Integer frontSeats;
    private Double frontPrice;
    private Integer middleSeats;
    private Double middlePrice;
    private Integer wingSeats;
    private Double wingPrice;
    private Integer topSeats;
    private Double topPrice;
}