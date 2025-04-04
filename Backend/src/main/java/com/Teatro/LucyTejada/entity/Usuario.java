package com.Teatro.LucyTejada.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = false, unique = true, length = 20)
    String cedula;

    @Column(nullable = false, length = 100)
    String nombres;

    @Column(nullable = false, length = 100)
    String apellidos;

    @Column(name = "correo_electronico", nullable = false, unique = true, length = 100)
    String correoElectronico;

    @Column(nullable = false, length = 255)
    String contrasena;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('Administrativo', 'Coordinador', 'Instructor')")
    Rol rol;

    @Column(name = "fecha_nacimiento")
    LocalDate fechaNacimiento;

    @Column(length = 200)
    String direccion;

    @Column(length = 20)
    String telefono;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('Masculino', 'Femenino', 'Otro')")
    private Sexo sexo;

    @Column(name = "tipo_sangre", length = 5)
    private String tipoSangre;

    @Column(name = "primer_inicio_sesion", nullable = false)
    private Boolean primerInicioSesion = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime fechaModificacion;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    public boolean getPrimerInicioSesion() {
        return this.primerInicioSesion;
    }

    public void setPrimerInicioSesion(boolean primerInicioSesion) {
        this.primerInicioSesion = primerInicioSesion;
    }

    @Override
    public String getPassword() {
        return this.contrasena;
    }

    @Override
    public String getUsername() {
        return this.correoElectronico;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}