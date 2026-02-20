package com.ecobazaar.backend.repository;

import com.ecobazaar.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // We will add custom search queries here later (e.g., findByCategory)
}