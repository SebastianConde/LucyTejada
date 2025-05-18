package com.Teatro.LucyTejada.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.Teatro.LucyTejada.entity.ZonasImparticion;

@Entity
@Table(name = "cursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cursos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "instructor_id")
    private Integer instructorId;

    @Column(length = 50)
    private String tipo;

    @Column(length = 50)
    private String duracion;

    @Column(length = 200)
    private String horarios;

    @Column(name = "zona_imparticion")
    private String zonaImparticion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
