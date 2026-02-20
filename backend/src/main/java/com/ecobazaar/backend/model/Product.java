package com.ecobazaar.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Double price;
    
    private String imageUrl;
    
    private String category;
    
    @Column(name = "co2_emission_kg", nullable = false)
    private Double co2Emission; 

    @Column(name = "is_eco_friendly")
    private boolean isEcoFriendly; 

    // Suggest a better product if this one has a high footprint
    @Column(name = "alternative_product_id")
    private Long alternativeProductId; 
}