package com.Teatro.LucyTejada.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Teatro.LucyTejada.entity.Zonas;

import java.util.Optional;

public interface ZonasRepository extends JpaRepository<Zonas, Integer> {
    Optional<Zonas> findByZona(String zona);
}