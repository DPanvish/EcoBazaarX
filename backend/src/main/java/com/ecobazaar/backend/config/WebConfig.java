package com.ecobazaar.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This tells Spring: "If a request comes to /uploads/**, look in the local 'uploads' folder"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}