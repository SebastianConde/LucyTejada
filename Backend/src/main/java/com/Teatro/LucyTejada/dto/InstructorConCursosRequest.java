package com.Teatro.LucyTejada.dto;

import java.time.LocalDate;
import lombok.*;
import java.util.List;
import com.Teatro.LucyTejada.entity.Cursos;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InstructorConCursosRequest {
    private String nombres;
    private String apellidos;
    private String correoElectronico;
    private List<CursoReporteRequest> cursos;
}