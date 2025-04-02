package com.Teatro.LucyTejada.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LucyTejadaController {

    @PostMapping("/lucyTejada")
    public String welcome() {
        return "Bienvenido al endpoint de Lucy Tejada";
    }
}