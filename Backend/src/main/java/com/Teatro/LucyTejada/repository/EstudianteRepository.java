package com.Teatro.LucyTejada.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Teatro.LucyTejada.entity.Estudiante;

import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
    Optional<Estudiante> findByCorreoElectronico(String correoElectronico);
}