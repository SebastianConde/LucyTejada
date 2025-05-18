package com.Teatro.LucyTejada.service;

import java.util.ArrayList;
import java.util.List;
import com.Teatro.LucyTejada.util.Zonas;
import org.springframework.stereotype.Service;

@Service
public class ZonasService {
    private List<Zonas> zonas;

    public ZonasService() {
        zonas = new ArrayList<>();
        zonas.add(new Zonas("Zona Norte", 4.8400, 4.8600, -75.6800, -75.6600));
        zonas.add(new Zonas("Zona Centro", 4.8100, 4.8400, -75.6900, -75.6700));
        zonas.add(new Zonas("Zona Sur", 4.7800, 4.8100, -75.7000, -75.6800));
        zonas.add(new Zonas("Zona Este", 4.7900, 4.8300, -75.6600, -75.6300));
        zonas.add(new Zonas("Zona Oeste", 4.7900, 4.8300, -75.7200, -75.6900));
        zonas.add(new Zonas("Zona Rural", 4.7600, 4.7900, -75.7300, -75.6700));
    }

    public String obtenerZona(double lat, double lon) {
        for (Zonas zona : zonas) {
            if (zona.contiene(lat, lon)) {
                return zona.getNombre();
            }
        }
        return "Zona desconocida";
    }
}
