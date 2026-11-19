package com.movie.movie.domain;

import com.movie.movie.domain.enums.MovieStatus;
import com.movie.movie.domain.enums.ShowtimeStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Showtime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Movie movie;
    @ManyToOne
    private Room room;
    private LocalDate date;
    private LocalTime startTime;
    private Integer durationHour;
    private Integer durationMinute;
    @Enumerated(EnumType.STRING)
    private MovieStatus status;
    @Enumerated(EnumType.STRING)
    private ShowtimeStatus showtimeStatus;
}
