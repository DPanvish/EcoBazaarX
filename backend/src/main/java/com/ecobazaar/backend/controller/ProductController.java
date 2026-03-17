package com.ecobazaar.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecobazaar.backend.model.Product;
import com.ecobazaar.backend.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/seller")
    public List<Product> getSellerProducts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return productService.getProductsBySeller(email);
    }

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return productService.addProduct(product, email);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}/verify")
    public Product verifyProduct(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        return productService.updateVerificationStatus(id, body.get("status"));
    }
}