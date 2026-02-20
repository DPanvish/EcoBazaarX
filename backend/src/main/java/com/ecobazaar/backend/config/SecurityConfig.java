package com.ecobazaar.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration; 
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; 

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()      // Allow Login/Signup
                .requestMatchers("/api/products/**").permitAll()  // Allow Product Access (Get/Add)
                .requestMatchers("/uploads/**").permitAll()       // Allow Image loading
                .anyRequest().authenticated()                     // Secure everything else
            );
        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration source = new CorsConfiguration();
        source.setAllowedOrigins(List.of("http://localhost:5173"));
        source.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        source.setAllowedHeaders(List.of("*"));
        source.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", source);
        return urlBasedCorsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}