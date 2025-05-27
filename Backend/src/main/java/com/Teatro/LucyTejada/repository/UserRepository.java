package com.Teatro.LucyTejada.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Teatro.LucyTejada.entity.Usuario;

import java.util.Optional;
import java.util.List;
import com.Teatro.LucyTejada.entity.Rol;

public interface UserRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreoElectronico(String username);
    Optional<Usuario> findByCedula(String cedula);
    List<Usuario> findByRol(Rol rol);
}