package com.ecobazaar.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetLink(String toEmail, String token) {
        String link = "http://localhost:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("panvishd@gmail.com"); 
        message.setTo(toEmail);
        message.setSubject("EcoBazaar - Password Reset");
        message.setText("Click here to reset your password:\n" + link);

        try {
            mailSender.send(message);
            System.out.println("Email successfully sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}