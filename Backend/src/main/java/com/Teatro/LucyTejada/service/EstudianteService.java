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

    public List<Estudiante> obtenerEstudiantes() {
        return estudianteRepository.findAll();
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
}