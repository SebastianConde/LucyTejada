package com.Teatro.LucyTejada.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.Teatro.LucyTejada.entity.Cursos;
import com.Teatro.LucyTejada.entity.Estudiante;
import com.Teatro.LucyTejada.entity.Usuario;
import com.Teatro.LucyTejada.repository.CursosRepository;
import com.Teatro.LucyTejada.repository.EstudianteRepository;
import com.Teatro.LucyTejada.repository.UserRepository;
import com.Teatro.LucyTejada.service.ReporteService;

@RestController
@RequestMapping("/api")
public class ReporteController {

    private final ReporteService reporteService;
    private final EstudianteRepository estudianteRepo;
    private final UserRepository instructorRepo;
    private final CursosRepository cursoRepo;

    public ReporteController(ReporteService reporteService,
                             EstudianteRepository estudianteRepo,
                             UserRepository instructorRepo,
                             CursosRepository cursoRepo) {
        this.reporteService = reporteService;
        this.estudianteRepo = estudianteRepo;
        this.instructorRepo = instructorRepo;
        this.cursoRepo = cursoRepo;
    }

    @GetMapping("/lucyTejada/reporte-general")
    public ResponseEntity<byte[]> descargarReporteGeneral() {
        try {
            List<Estudiante> estudiantes = estudianteRepo.findAll();
            List<Usuario> instructores = instructorRepo.findAll();
            List<Cursos> cursos = cursoRepo.findAll();

            byte[] excel = reporteService.generarReporteExcel(estudiantes, instructores, cursos);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_general.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excel);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
