package com.Teatro.LucyTejada.dto;

import com.Teatro.LucyTejada.entity.Sexo;
import com.Teatro.LucyTejada.entity.TipoDoc;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistroEstudianteRequest {

    private TipoDoc tipoDocumento;
    private String documento;

    private String nombres;
    private String apellidos;

    private String correoElectronico;

    private String ciudadOrigen;
    private String ciudadResidencia;

    private String direccion;

    private String telefono;

    private String tipoSangre;

    private Sexo sexo;

    private Double latitud;
    private Double longitud;

    private String curso;
}
