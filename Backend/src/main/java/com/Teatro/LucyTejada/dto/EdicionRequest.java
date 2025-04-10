package com.Teatro.LucyTejada.dto;

import lombok.*;
import com.Teatro.LucyTejada.entity.Rol;
import com.Teatro.LucyTejada.entity.Sexo;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EdicionRequest {

    private String nombres;
    private String apellidos;
    private Rol rol;
    private String correoElectronico; // No se edita, solo nos permite buscar
    private LocalDate fechaNacimiento;
    private String direccion;
    private String telefono;
    private Sexo sexo;
    private String tipoSangre;
}
