package com.Teatro.LucyTejada.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreacionCursoRequest {

    private String nombre;

    private String descripcion;

    private Integer instructorId;

    private String tipo;

    private String duracion;

    private String horarios;

    private String zonaImparticion;

    private LocalDate fechaInicio;
}
