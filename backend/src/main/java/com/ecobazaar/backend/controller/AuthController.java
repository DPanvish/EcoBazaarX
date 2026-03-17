package com.ecobazaar.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecobazaar.backend.model.User;
import com.ecobazaar.backend.repository.UserRepository;
import com.ecobazaar.backend.service.EmailService;
import com.ecobazaar.backend.controller.JwtUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user, BindingResult bindingResult) {

        // Check for Validation Errors (Regex failures)
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(
                    bindingResult.getFieldError().getDefaultMessage());
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Proceed with Registration
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER");
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        
        System.out.println("\n=== INCOMING LOGIN REQUEST ===");
        
        // Check what raw data arrived from React
        String email = loginData.get("email");
        String password = loginData.get("password");
        
        System.out.println("Received Email:    [" + email + "]");
        System.out.println("Received Password: [" + password + "]");

        // Safely find the user
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(400).body("Email is missing from request");
        }

        User user = userRepository.findByEmail(email.trim()).orElse(null);
        
        if (user == null) {
            System.out.println("RESULT: User not found in database.");
            System.out.println("==============================\n");
            return ResponseEntity.status(401).body("User not found");
        }

        System.out.println("Found User in DB:  [" + user.getFullName() + "]");
        System.out.println("DB Password Hash:  [" + user.getPassword() + "]");

        // Test the password
        boolean isMatch = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password Match?:   [" + isMatch + "]");
        System.out.println("==============================\n");

        if (isMatch) {
            String jwt = jwtUtils.generateToken(user.getEmail()); 
            return ResponseEntity.ok(Map.of(
                "message", "Login Successful",
                "token", jwt,  
                "role", user.getRole(),
                "name", user.getFullName()
            ));
        } else {
            return ResponseEntity.status(401).body("Invalid Credentials");
        }
    }
    // --- FORGOT PASSWORD (Generate Link) ---
    @Autowired
    private EmailService emailService; 

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email"));

        // Generate Token
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        try {
            emailService.sendResetLink(email, token);
            return ResponseEntity.ok("Reset link sent to your email!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
    }

    // --- RESET PASSWORD (Update Password) ---
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid Token"));

        // Check if token has expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token has expired");
        }

        // Update Password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Clear Token so it can't be used again
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully! Please login.");
    }
}