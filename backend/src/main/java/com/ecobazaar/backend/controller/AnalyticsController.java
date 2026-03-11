package com.ecobazaar.backend.controller;

import com.ecobazaar.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/product-sales")
    public ResponseEntity<List<Map<String, Object>>> getProductSales() {
        return ResponseEntity.ok(analyticsService.getProductSalesAnalytics());
    }
}
