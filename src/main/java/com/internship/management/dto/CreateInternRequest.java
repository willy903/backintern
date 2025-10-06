package com.internship.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInternRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String school;
    private String department;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long encadreurId;
}
