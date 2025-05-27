package com.Teatro.LucyTejada.dto;

import java.time.LocalDate;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CursoReporteRequest {
    private String nombre;
    private String descripcion;
    private String tipo;
    private String duracion;
    private String horarios;
    private String zonaImparticion;
    private LocalDate fechaInicio;
}
