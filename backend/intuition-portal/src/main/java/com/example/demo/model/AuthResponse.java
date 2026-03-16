package com.example.demo.model;

public class AuthResponse {
    private String name;
    private String email;
    private String role;

    public AuthResponse(String name, String email, String role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Getters
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}