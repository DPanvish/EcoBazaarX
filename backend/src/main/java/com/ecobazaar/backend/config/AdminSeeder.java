package com.ecobazaar.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ecobazaar.backend.model.User;
import com.ecobazaar.backend.repository.UserRepository;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("boss@ecobazaar.com")) {
            User admin = User.builder()
                    .fullName("Platform Boss")
                    .email("boss@ecobazaar.com")
                    .password(passwordEncoder.encode("Admin@1234!")) 
                    .role("ROLE_ADMIN")
                    .build();
            
            userRepository.save(admin);
            System.out.println("=================================================");
            System.out.println(" DEFAULT ADMIN CREATED:");
            System.out.println(" Email: boss@ecobazaar.com");
            System.out.println(" Password: Admin@1234!");
            System.out.println("=================================================");
        }
    }
}