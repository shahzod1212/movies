package com.movie.movie.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.ColumnText;
import com.movie.movie.domain.Booking;
import com.movie.movie.domain.Seat;
import com.movie.movie.domain.Showtime;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfTicketService {

    private static final float PAGE_WIDTH = 320f;
    private static final float PAGE_HEIGHT = 680f;
    private static final float POSTER_HEIGHT = 280f;

    private static final Color BACKGROUND = new Color(60, 8, 14);
    private static final Color GOLD = new Color(212, 175, 55);
    private static final Color LIGHT_PINK = new Color(225, 180, 180);
    private static final Color WHITE = Color.WHITE;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");

    public byte[] generateTicket(Booking booking) throws Exception {
        Showtime showtime = booking.getShowtime();

        Document document = new Document(new Rectangle(PAGE_WIDTH, PAGE_HEIGHT), 0, 0, 0, 0);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, outputStream);
        document.open();

        PdfContentByte canvas = writer.getDirectContent();

        drawBackground(canvas);
        drawBorder(canvas);
        float posterBottomY = drawPoster(canvas, showtime.getMovie().getPosterUrl());
        drawTitle(canvas, showtime.getMovie().getTitle(), posterBottomY);
        drawDivider(canvas, posterBottomY - 60);
        drawDetails(canvas, booking, showtime, posterBottomY - 90);
        drawFooter(canvas);

        document.close();
        return outputStream.toByteArray();
    }

    private void drawBackground(PdfContentByte canvas) {
        canvas.setColorFill(BACKGROUND);
        canvas.rectangle(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        canvas.fill();
    }

    private void drawBorder(PdfContentByte canvas) {
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(1.5f);
        canvas.rectangle(8, 8, PAGE_WIDTH - 16, PAGE_HEIGHT - 16);
        canvas.stroke();
    }

    private float drawPoster(PdfContentByte canvas, String posterUrl) {
        try {
            if (posterUrl != null && !posterUrl.isBlank()) {
                Image poster = Image.getInstance(new URL(posterUrl));
                poster.scaleToFit(PAGE_WIDTH - 20, POSTER_HEIGHT);
                float x = (PAGE_WIDTH - poster.getScaledWidth()) / 2;
                float y = PAGE_HEIGHT - 20 - poster.getScaledHeight();
                poster.setAbsolutePosition(x, y);
                canvas.addImage(poster);
                return y;
            }
        } catch (Exception e) {
            // no poster available, fall back to reserved space so layout still works
        }
        return PAGE_HEIGHT - 20 - POSTER_HEIGHT;
    }

    private void drawTitle(PdfContentByte canvas, String title, float posterBottomY) {
        Font titleFont = new Font(Font.HELVETICA, 19, Font.BOLD, GOLD);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
                new Phrase(title.toUpperCase(), titleFont),
                PAGE_WIDTH / 2, posterBottomY - 30, 0);
    }

    private void drawDivider(PdfContentByte canvas, float y) {
        canvas.setLineDash(4f, 3f);
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(1f);
        canvas.moveTo(20, y);
        canvas.lineTo(PAGE_WIDTH - 20, y);
        canvas.stroke();
        canvas.setLineDash(0);
    }

    private void drawDetails(PdfContentByte canvas, Booking booking, Showtime showtime, float startY) {
        float y = startY;
        float rowSpacing = 55f;

        y = drawField(canvas, "DATE", showtime.getDate().format(DATE_FORMATTER), y, rowSpacing);
        y = drawField(canvas, "TIME", showtime.getStartTime().format(TIME_FORMATTER), y, rowSpacing);
        y = drawField(canvas, "ROOM", showtime.getRoom().getName(), y, rowSpacing);
        y = drawField(canvas, "SEATS", formatSeats(booking.getSeats()), y, rowSpacing);
        y = drawField(canvas, "TOTAL PAID", String.format("$%.2f", booking.getTotalAmount()), y, rowSpacing);
        drawField(canvas, "BOOKING REF", "BK-" + String.format("%06d", booking.getId()), y, rowSpacing);
    }

    private float drawField(PdfContentByte canvas, String label, String value, float y, float spacing) {
        Font labelFont = new Font(Font.HELVETICA, 8, Font.NORMAL, LIGHT_PINK);
        Font valueFont = new Font(Font.HELVETICA, 14, Font.BOLD, WHITE);

        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
                new Phrase(letterSpace(label), labelFont), PAGE_WIDTH / 2, y, 0);

        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
                new Phrase(value, valueFont), PAGE_WIDTH / 2, y - 18, 0);

        return y - spacing;
    }

    private void drawFooter(PdfContentByte canvas) {
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(1f);
        canvas.moveTo(60, 55);
        canvas.lineTo(PAGE_WIDTH - 60, 55);
        canvas.stroke();

        Font footerFont = new Font(Font.HELVETICA, 10, Font.BOLD, GOLD);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
                new Phrase(letterSpace("ENJOY THE SHOW"), footerFont),
                PAGE_WIDTH / 2, 35, 0);
    }

    private String formatSeats(List<Seat> seats) {
        return seats.stream()
                .map(seat -> seat.getRowLabel() + seat.getSeatNumber())
                .collect(Collectors.joining(", "));
    }

    private String letterSpace(String text) {
        return String.join(" ", text.chars()
                .mapToObj(c -> String.valueOf((char) c))
                .toArray(String[]::new));
    }
}