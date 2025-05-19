package com.Teatro.LucyTejada.repository;

import com.Teatro.LucyTejada.entity.Cursos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CursosRepository extends JpaRepository<Cursos, Integer> {
    Optional<Cursos> findByNombre(String nombre);
    List<Cursos> findByInstructorId(Integer instructorId);
}
