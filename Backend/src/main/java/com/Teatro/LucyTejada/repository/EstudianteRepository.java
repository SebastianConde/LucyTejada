package com.Teatro.LucyTejada.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Teatro.LucyTejada.entity.Estudiante;

import java.util.Optional;
import java.lang.Boolean;

public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
    Optional<Estudiante> findByCorreoElectronico(String correoElectronico);
    Boolean existsByDocumento (String documento);
    Optional<Estudiante> findByDocumento(String documento);
}