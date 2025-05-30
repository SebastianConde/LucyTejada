package com.Teatro.LucyTejada;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.Collections;

@SpringBootApplication
public class LucyTejadaApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(LucyTejadaApplication.class);

		// Detectar puerto asignado por Railway
		String port = System.getenv("PORT");
		System.out.println("PORT env variable = " + port);
		if (port != null) {
			app.setDefaultProperties(Collections.singletonMap("server.port", port));
		}

		app.run(args);
	}

}
