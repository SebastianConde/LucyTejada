package com.Teatro.LucyTejada.util;

public class Zonas {
    private String nombre;
    private double latMin, latMax;
    private double lonMin, lonMax;

    public Zonas(String nombre, double latMin, double latMax, double lonMin, double lonMax) {
        this.nombre = nombre;
        this.latMin = latMin;
        this.latMax = latMax;
        this.lonMin = lonMin;
        this.lonMax = lonMax;
    }

    public boolean contiene(double lat, double lon) {
        return lat >= latMin && lat <= latMax && lon >= lonMin && lon <= lonMax;
    }

    public String getNombre() {
        return nombre;
    }
}
