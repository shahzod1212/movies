package com.movie.movie.service;

import com.movie.movie.dtos.CustomerSupportRequest;

public interface CustomerSupportService {
    void sendMessage(CustomerSupportRequest customerSupportRequest);

    void sendTicketEmail(String email, String username, String movieTitle, String bookingRef, byte[] pdfFile);
}