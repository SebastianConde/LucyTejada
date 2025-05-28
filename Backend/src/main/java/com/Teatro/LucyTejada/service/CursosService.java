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
import com.Teatro.LucyTejada.service.EmailService;
import com.Teatro.LucyTejada.entity.Usuario;
import com.Teatro.LucyTejada.repository.UserRepository;
import com.Teatro.LucyTejada.dto.CursoConInstructorDTO;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CursosService {

    private final JwtService jwtService;
    private final CursosRepository cursosRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

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

        // Enviar correo de confirmación al instructor
        String mensaje = "Hola, se ha creado un nuevo curso: " + request.getNombre() + ".";

        //Buscar el instructor por ID
        Usuario instructor = userRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor no encontrado"));

        emailService.enviarCorreo(instructor.getCorreoElectronico(), "Nuevo curso creado", mensaje);
    }

    // Modificar un curso
    public void modificarCurso(Integer id, CreacionCursoRequest request) {
        Optional<Cursos> cursoOptional = cursosRepository.findById(id);
        if (cursoOptional.isPresent()) {
            Cursos curso = cursoOptional.get();
            curso.setNombre(request.getNombre());
            curso.setDescripcion(request.getDescripcion());
            curso.setInstructorId(request.getInstructorId());
            curso.setTipo(request.getTipo());
            curso.setDuracion(request.getDuracion());
            curso.setHorarios(request.getHorarios());
            curso.setZonaImparticion(request.getZonaImparticion());
            curso.setFechaInicio(request.getFechaInicio());

            cursosRepository.save(curso);
        } else {
            throw new RuntimeException("Curso no encontrado");
        }
    }

    // Eliminar un curso
    public void eliminarCurso(Integer id) {
        Optional<Cursos> cursoOptional = cursosRepository.findById(id);
        if (cursoOptional.isPresent()) {
            cursosRepository.delete(cursoOptional.get());
        } else {
            throw new RuntimeException("Curso no encontrado");
        }
    }

    // Obtener todos los cursos
    public List<CursoConInstructorDTO> obtenerCursos() {
        List<Cursos> cursos = cursosRepository.findAll();
        List<CursoConInstructorDTO> respuesta = new ArrayList<>();

        for (Cursos curso : cursos) {
            Usuario instructor = null;
            if (curso.getInstructorId() != null) {
                instructor = userRepository.findById(curso.getInstructorId()).orElse(null);
            }

            String nombreInst = (instructor != null)
                    ? instructor.getNombres() + " " + instructor.getApellidos()
                    : "Sin instructor asignado";

            String docInst = (instructor != null)
                    ? instructor.getCedula()
                    : "Sin instructor asignado";

            CursoConInstructorDTO dto = CursoConInstructorDTO.builder()
                    .id(curso.getId())
                    .nombre(curso.getNombre())
                    .descripcion(curso.getDescripcion())
                    .instructorId(curso.getInstructorId())
                    .tipo(curso.getTipo())
                    .duracion(curso.getDuracion())
                    .horarios(curso.getHorarios())
                    .zonaImparticion(curso.getZonaImparticion())
                    .fechaInicio(curso.getFechaInicio())
                    .createdAt(curso.getCreatedAt())
                    .updatedAt(curso.getUpdatedAt())
                    .nombreInst(nombreInst)
                    .docInst(docInst)
                    .build();

            respuesta.add(dto);
        }

        return respuesta;
    }


    // Obtener un curso por ID
    public Cursos obtenerCursoPorId(Integer id) {
        return cursosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    }

    // Obtener cursos por instructor
    public List<Cursos> obtenerCursosPorInstructor(Integer instructorId) {
        return cursosRepository.findByInstructorId(instructorId);
    }

    // Obtener mis cursos como instructor
    public List<Cursos> obtenerMisCursosComoInstructor(String token) {
        String correo = jwtService.extractEmailFromToken(token);

        System.out.println("Correo extraído del token: " + correo);
        Usuario usuario = userRepository.findByCorreoElectronico(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Integer instructorId = usuario.getId();
        System.out.println("ID del instructor: " + instructorId);
        // Obtener los cursos del instructor
        return cursosRepository.findByInstructorId(instructorId);
    }
}