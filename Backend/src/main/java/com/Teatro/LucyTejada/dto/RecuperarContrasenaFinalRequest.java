package com.Teatro.LucyTejada.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecuperarContrasenaFinalRequest {
    private String nuevaContrasena;
}
