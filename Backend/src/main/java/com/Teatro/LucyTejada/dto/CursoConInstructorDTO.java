package com.Teatro.LucyTejada.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CursoConInstructorDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Integer instructorId;
    private String tipo;
    private String duracion;
    private String horarios;
    private String zonaImparticion;
    private LocalDate fechaInicio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Nuevos campos del instructor
    private String nombreInst;
    private String docInst;
}
