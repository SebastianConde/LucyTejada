package com.Teatro.LucyTejada.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.*;
import com.Teatro.LucyTejada.entity.Cursos;
import com.Teatro.LucyTejada.entity.Usuario;
import com.Teatro.LucyTejada.entity.Rol;
import com.Teatro.LucyTejada.repository.CursosRepository;
import com.Teatro.LucyTejada.repository.UserRepository;
import com.Teatro.LucyTejada.dto.CursoReporteRequest;
import com.Teatro.LucyTejada.dto.InstructorConCursosRequest;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import com.Teatro.LucyTejada.entity.Estudiante;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final UserRepository usuarioRepository;
    private final CursosRepository cursosRepository;

    public List<InstructorConCursosRequest> obtenerCursosPorInstructor() {
        List<Usuario> instructores = usuarioRepository.findByRol(Rol.Instructor);

        return instructores.stream().map(instructor -> {
            List<Cursos> cursos = cursosRepository.findByInstructorId(instructor.getId());

            List<CursoReporteRequest> cursosDTO = cursos.stream().map(curso -> new CursoReporteRequest(
                    curso.getNombre(),
                    curso.getDescripcion(),
                    curso.getTipo(),
                    curso.getDuracion(),
                    curso.getHorarios(),
                    curso.getZonaImparticion(),
                    curso.getFechaInicio()
            )).toList();

            return new InstructorConCursosRequest(
                    instructor.getNombres(),
                    instructor.getApellidos(),
                    instructor.getCorreoElectronico(),
                    cursosDTO
            );
        }).toList();
    }

    public byte[] generarReporteExcel(
            List<Estudiante> estudiantes,
            List<Usuario> usuarios,
            List<Cursos> cursos) {

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Tipo");
            headerRow.createCell(1).setCellValue("Nombre");
            headerRow.createCell(2).setCellValue("Correo");

            int rowIdx = 1;

            for (Estudiante e : estudiantes) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue("Estudiante");
                row.createCell(1).setCellValue(e.getNombres() + " " + e.getApellidos());
                row.createCell(2).setCellValue(e.getCorreoElectronico());
            }

            for (Usuario u : usuarios) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue("Usuario");
                row.createCell(1).setCellValue(u.getNombres() + " " + u.getApellidos());
                row.createCell(2).setCellValue(u.getCorreoElectronico());
            }

            for (Cursos c : cursos) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue("Curso");
                row.createCell(1).setCellValue(c.getNombre());
                row.createCell(2).setCellValue(c.getDescripcion());
            }

            workbook.write(out);
            return out.toByteArray(); // ← AQUÍ el cambio
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
