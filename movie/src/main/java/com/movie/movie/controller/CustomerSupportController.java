package com.movie.movie.controller;

import com.movie.movie.dtos.CustomerSupportRequest;
import com.movie.movie.service.CustomerSupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class CustomerSupportController {
    private final CustomerSupportService customerSupportService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Void> sendMessage(
            @RequestBody CustomerSupportRequest customerSupportRequest
    ){
        customerSupportService.sendMessage(customerSupportRequest);
        return ResponseEntity.ok().build();
    }
}