package com.ecobazaar.backend.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecobazaar.backend.model.Product;
import com.ecobazaar.backend.service.ProductService;

import tools.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Use ObjectMapper to convert the JSON string sent from React into a Product object
    @Autowired
    private ObjectMapper objectMapper;

    // Public: Everyone can see products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Admin Only: Add Product
    @PostMapping(value = "/add", consumes = {"multipart/form-data"})
    public Product addProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile file
    ) throws IOException {
        
        // Convert JSON string to Java Object
        Product product = objectMapper.readValue(productJson, Product.class);

        // Handle File Upload if an image was provided
        if (file != null && !file.isEmpty()) {
            String uploadDir = "uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs(); 
            }

            // Create a unique file name to prevent overwriting
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            
            // Save the file to the server
            Files.write(filePath, file.getBytes());

            // Set the URL so the frontend can access it via the WebConfig we made
            String imageUrl = "http://localhost:8080/uploads/" + fileName;
            product.setImageUrl(imageUrl);
        }

        // Save to Database
        return productService.addProduct(product);
    }

    // Admin Only: Update
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    // Admin Only: Delete
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}