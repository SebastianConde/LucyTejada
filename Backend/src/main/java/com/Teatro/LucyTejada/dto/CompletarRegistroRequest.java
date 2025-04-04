package com.Teatro.LucyTejada.dto;

import com.Teatro.LucyTejada.entity.Rol;
import com.Teatro.LucyTejada.entity.Sexo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompletarRegistroRequest {
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String contrasena;

    private LocalDate fechaNacimiento;

    @Size(max = 200, message = "La dirección no debe superar los 200 caracteres")
    private String direccion;

    @Size(max = 20, message = "El teléfono no debe superar los 20 caracteres")
    private String telefono;

    private Sexo sexo;

    @Size(max = 5, message = "El tipo de sangre no debe superar los 5 caracteres")
    private String tipoSangre;
}