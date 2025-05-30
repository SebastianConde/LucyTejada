package com.Teatro.LucyTejada;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.Collections;

@SpringBootApplication
public class LucyTejadaApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(LucyTejadaApplication.class);
		app.setDefaultProperties(Collections
				.singletonMap("server.port", System.getenv("PORT")));
		app.run(args);
	}

}
