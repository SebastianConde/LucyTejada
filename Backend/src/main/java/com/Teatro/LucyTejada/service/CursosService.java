package com.Teatro.LucyTejada.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import com.Teatro.LucyTejada.service.JwtService;
import java.util.List;
import com.Teatro.LucyTejada.entity.Cursos;
import com.Teatro.LucyTejada.repository.CursosRepository;
import com.Teatro.LucyTejada.dto.CreacionCursoRequest;
import com.Teatro.LucyTejada.entity.ZonasImparticion;

@Service
@RequiredArgsConstructor
public class CursosService {

    private final JwtService jwtService;
    private final CursosRepository cursosRepository;

    @Value("${app.url.base}")
    private String baseUrl;

    @Value("${app.url.front}")
    private String frontUrl;

    //Crear un curso
    public void crearCurso(CreacionCursoRequest request) {
        String zonaString = request.getZonaImparticion();

        // Convertir a enum usando un método personalizado
        ZonasImparticion zonaEnum = ZonasImparticion.fromNombre(zonaString);
        String zona = zonaEnum.getNombre(); // ← esto da "Zona Norte", por ejemplo

        Cursos curso = Cursos.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .instructorId(request.getInstructorId())
                .tipo(request.getTipo())
                .duracion(request.getDuracion())
                .horarios(request.getHorarios())
                .zonaImparticion(zona)
                .fechaInicio(request.getFechaInicio())
                .build();

        cursosRepository.save(curso);
    }
}