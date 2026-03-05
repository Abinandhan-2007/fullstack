package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// IMPORTANT: Replace the URL below with your actual Vercel frontend URL
// Make sure there is NO trailing slash (/) at the end of the URL
@CrossOrigin(origins = "https://fullstack-dfpyxdkbo-abinandhan-2007s-projects.vercel.app/") 
@RestController
@RequestMapping("/api")
public class studentcontroller {

    @GetMapping("/status")
    public Map<String, String> getStatus() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from your Render Backend! The Central Portal API is officially connected.");
        response.put("status", "success");
        return response;
    }
}