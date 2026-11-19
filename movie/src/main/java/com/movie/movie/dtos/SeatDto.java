package com.movie.movie.dtos;

import com.movie.movie.domain.Room;
import com.movie.movie.domain.enums.SeatSection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SeatDto {
    private Long id;

    private Long roomId;
    private String rowLabel;

    private Integer seatNumber;

    private SeatSection section;

}
