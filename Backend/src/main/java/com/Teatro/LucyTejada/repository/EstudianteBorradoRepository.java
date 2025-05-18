package com.Teatro.LucyTejada.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Teatro.LucyTejada.entity.EstudianteBorrado;

import java.util.Optional;

public interface EstudianteBorradoRepository extends JpaRepository<EstudianteBorrado, Integer> {
    Optional<EstudianteBorrado> findByCorreoElectronico(String correoElectronico);
}