package com.Teatro.LucyTejada.repository;

import com.Teatro.LucyTejada.entity.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Integer> {
    Optional<Inscripcion> findByEstudianteId(Integer estudianteId);
    Optional<Inscripcion> findByCursoId(Integer cursoId);
    List<Inscripcion> findByCursoIdIn(List<Integer> cursoIds);
}
