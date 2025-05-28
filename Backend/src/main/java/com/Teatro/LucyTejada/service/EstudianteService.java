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
import com.Teatro.LucyTejada.dto.RegistroEstudianteRequest;
import com.Teatro.LucyTejada.entity.Estudiante;
import com.Teatro.LucyTejada.repository.EstudianteRepository;
import com.Teatro.LucyTejada.entity.Zonas;
import com.Teatro.LucyTejada.service.ZonasService;
import com.Teatro.LucyTejada.repository.ZonasRepository;
import com.Teatro.LucyTejada.entity.EstudianteBorrado;
import com.Teatro.LucyTejada.repository.EstudianteBorradoRepository;
import com.Teatro.LucyTejada.entity.Inscripcion;
import com.Teatro.LucyTejada.repository.InscripcionRepository;
import com.Teatro.LucyTejada.entity.Cursos;
import com.Teatro.LucyTejada.repository.CursosRepository;
import com.Teatro.LucyTejada.dto.EstudianteConCursosResponse;
import com.Teatro.LucyTejada.entity.Usuario;
import com.Teatro.LucyTejada.repository.UserRepository;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final JwtService jwtService;
    private final ZonasService zonasService;
    private final ZonasRepository zonasRepository;
    private final EstudianteBorradoRepository estudianteBorradoRepository;
    private final InscripcionRepository inscripcionRepository;
    private final CursosRepository cursosRepository;
    private final UserRepository userRepository;

    @Value("${app.url.base}")
    private String baseUrl;

    @Value("${app.url.front}")
    private String frontUrl;

    public void registrarEstudiante(RegistroEstudianteRequest request) {
        Estudiante estudiante = Estudiante.builder()
                .tipoDocumento(request.getTipoDocumento())
                .documento(request.getDocumento())
                .nombres(request.getNombres())
                .apellidos(request.getApellidos())
                .correoElectronico(request.getCorreoElectronico())
                .ciudadOrigen(request.getCiudadOrigen())
                .ciudadResidencia(request.getCiudadResidencia())
                .direccion(request.getDireccion())
                .telefono(request.getTelefono())
                .tipoSangre(request.getTipoSangre())
                .sexo(request.getSexo())
                .build();

        estudianteRepository.save(estudiante);

        String zona = comparadorZonas(request.getLatitud(), request.getLongitud());

        if (zona == null) {
            zona = "Fuera de Pereira";
        }
        // Guardar la zona del estudiante
        Zonas zonaEstudiante = Zonas.builder()
                .estudianteId(estudiante.getId())
                .zona(zona)
                .build();

        zonasRepository.save(zonaEstudiante);

        Cursos curso = cursosRepository.findByNombre(request.getCurso())
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        // Guardar la inscripción del estudiante
        Inscripcion inscripcion = Inscripcion.builder()
                .estudianteId(estudiante.getId())
                .cursoId(curso.getId())
                .fechaInscripcion(LocalDateTime.now())
                .build();

        inscripcionRepository.save(inscripcion);
    }

    public String comparadorZonas(Double latitud, Double longitud) {
        if (latitud == null || longitud == null) {
            return null;
        }
        return zonasService.obtenerZona(latitud, longitud);
    }

    public List<EstudianteConCursosResponse> obtenerEstudiantes(String token) {
        String correo = jwtService.extractEmailFromToken(token);

        Usuario instructor = userRepository.findByCorreoElectronico(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Cursos> cursosInstructor = cursosRepository.findByInstructorId(instructor.getId());

        if (cursosInstructor.isEmpty()) {
            return List.of();
        }

        List<Integer> cursoIds = cursosInstructor.stream()
                .map(Cursos::getId)
                .toList();

        List<Inscripcion> inscripciones = inscripcionRepository.findByCursoIdIn(cursoIds);

        Map<Integer, List<Integer>> estudianteCursosMap = new HashMap<>();
        for (Inscripcion insc : inscripciones) {
            estudianteCursosMap
                    .computeIfAbsent(insc.getEstudianteId(), k -> new ArrayList<>())
                    .add(insc.getCursoId());
        }

        Set<Integer> estudianteIds = estudianteCursosMap.keySet();
        List<Estudiante> estudiantes = estudianteRepository.findAllById(estudianteIds);

        return estudiantes.stream().map(estudiante -> {
            List<Integer> cursosIdDelEstudiante = estudianteCursosMap.get(estudiante.getId());

            List<Cursos> cursosDelEstudiante = cursosInstructor.stream()
                    .filter(c -> cursosIdDelEstudiante.contains(c.getId()))
                    .toList();

            return EstudianteConCursosResponse.builder()
                    .estudiante(estudiante)
                    .cursos(cursosDelEstudiante)
                    .build();
        }).toList();
    }

    public void eliminarEstudiante(Integer id) {
        Optional<Estudiante> estudiante = estudianteRepository.findById(id);

        //Guardar el estudiante en la tabla de estudiantes borrados
        EstudianteBorrado estudianteBorrado = EstudianteBorrado.builder()
                .tipoDocumento(estudiante.get().getTipoDocumento())
                .documento(estudiante.get().getDocumento())
                .nombres(estudiante.get().getNombres())
                .apellidos(estudiante.get().getApellidos())
                .correoElectronico(estudiante.get().getCorreoElectronico())
                .ciudadOrigen(estudiante.get().getCiudadOrigen())
                .ciudadResidencia(estudiante.get().getCiudadResidencia())
                .direccion(estudiante.get().getDireccion())
                .telefono(estudiante.get().getTelefono())
                .tipoSangre(estudiante.get().getTipoSangre())
                .sexo(estudiante.get().getSexo())
                .build();

        estudianteBorrado.setFechaBorrado(LocalDate.now());
        estudianteBorradoRepository.save(estudianteBorrado);

        if (estudiante.isPresent()) {
            estudianteRepository.delete(estudiante.get());
        } else {
            throw new RuntimeException("Estudiante no encontrado");
        }
    }

    // Identificar si existe un estudiante por documento
    public boolean estudianteExiste(String documento) {
        return estudianteRepository.existsByDocumento(documento);
    }

    //Inscribir un estudiante a un curso por medio de documento y de curso
    public void inscribirEstudiante(String documento, String cursoNombre) {
        Estudiante estudiante = estudianteRepository.findByDocumento(documento)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        Cursos curso = cursosRepository.findByNombre(cursoNombre)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Inscripcion inscripcion = Inscripcion.builder()
                .estudianteId(estudiante.getId())
                .cursoId(curso.getId())
                .fechaInscripcion(LocalDateTime.now())
                .build();

        inscripcionRepository.save(inscripcion);
    }
}