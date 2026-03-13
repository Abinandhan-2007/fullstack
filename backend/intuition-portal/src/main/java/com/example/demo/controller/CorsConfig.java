package com.example.demo.controller; // Check your package name at the top of your other files!

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Applies to ALL endpoints (/api/host, /api/student, etc)
                        .allowedOrigins("http://localhost:5173", "https://fullstack-five-sage.vercel.app")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // OPTIONS is crucial here!
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}