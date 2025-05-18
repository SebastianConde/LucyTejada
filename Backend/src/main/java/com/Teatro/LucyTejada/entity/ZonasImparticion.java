package com.Teatro.LucyTejada.entity;

public enum ZonasImparticion {
    ZONA_NORTE("Zona Norte"),
    ZONA_CENTRO("Zona Centro"),
    ZONA_SUR("Zona Sur"),
    ZONA_ESTE("Zona Este"),
    ZONA_OESTE("Zona Oeste"),
    ZONA_RURAL("Zona Rural");

    private final String nombre;

    ZonasImparticion(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }

    public static ZonasImparticion fromNombre(String nombre) {
        for (ZonasImparticion zona : ZonasImparticion.values()) {
            if (zona.getNombre().equalsIgnoreCase(nombre)) {
                return zona;
            }
        }
        throw new IllegalArgumentException("Zona no válida: " + nombre);
    }

}
