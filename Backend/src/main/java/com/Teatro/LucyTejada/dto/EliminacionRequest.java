package com.Teatro.LucyTejada.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EliminacionRequest {
    private String cedula;
}