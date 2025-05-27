package com.Teatro.LucyTejada.dto;

import com.Teatro.LucyTejada.entity.Cursos;
import com.Teatro.LucyTejada.entity.Estudiante;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EstudianteConCursosResponse {
    private Estudiante estudiante;
    private List<Cursos> cursos;
}
