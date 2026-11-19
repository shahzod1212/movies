package com.movie.movie.domain;

import com.movie.movie.domain.enums.RoomType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
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

    @CreatedDate
    private LocalDateTime createdAt;
}