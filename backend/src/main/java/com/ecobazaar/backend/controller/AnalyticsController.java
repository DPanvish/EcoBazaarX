package com.ecobazaar.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecobazaar.backend.dto.MonthlyTrendDTO;
import com.ecobazaar.backend.dto.TopProductDTO;
import com.ecobazaar.backend.repository.OrderItemRepository;
import com.ecobazaar.backend.repository.OrderRepository;
import com.ecobazaar.backend.service.AnalyticsService;
import com.ecobazaar.backend.service.PdfReportService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private com.ecobazaar.backend.repository.UserRepository userRepository;

    @Autowired
    private PdfReportService pdfReportService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/user/dashboard")
    public ResponseEntity<?> getUserDashboardData() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        List<MonthlyTrendDTO> trend = orderRepository.getMonthlyCarbonTrend(email);
        Double lifetimeSavings = orderRepository.getTotalLifetimeSavings(email);
        List<String> badges = analyticsService.calculateUserBadges(lifetimeSavings);

        Map<String, Object> response = new HashMap<>();
        response.put("monthlyTrend", trend);
        response.put("lifetimeSavings", lifetimeSavings != null ? lifetimeSavings : 0.0);
        response.put("badges", badges);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/summary")
    public ResponseEntity<?> getAdminPlatformSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        summary.put("totalUsers", userRepository.count());
        summary.put("totalOrders", orderRepository.count());
        summary.put("totalRevenue", orderRepository.getTotalPlatformRevenue());
        summary.put("totalCo2Saved", orderRepository.getTotalPlatformCo2Saved());
        
        summary.put("recentOrders", orderRepository.findTop5ByOrderByOrderDateDesc());

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/admin/report/download")
    public ResponseEntity<byte[]> downloadPlatformReport() {
        Double revenue = orderRepository.getTotalPlatformRevenue();
        Double co2 = orderRepository.getTotalPlatformCo2Saved();
        long orders = orderRepository.count();
        long users = userRepository.count();

        try {
            byte[] pdfBytes = pdfReportService.generatePlatformEcoReport(
                revenue != null ? revenue : 0.0, 
                co2 != null ? co2 : 0.0, 
                orders, 
                users
            );

            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=EcoBazaar_Platform_Report.pdf")
                    .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/admin/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopEcoProducts() {
        return ResponseEntity.ok(orderItemRepository.getTopEcoProducts());
    }

    @GetMapping("/user/report/download")
    public ResponseEntity<byte[]> downloadUserReport() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Double lifetimeSavings = orderRepository.getTotalLifetimeSavings(email);
        if(lifetimeSavings == null) lifetimeSavings = 0.0;
        
        List<String> badges = analyticsService.calculateUserBadges(lifetimeSavings);
        
        List<com.ecobazaar.backend.model.Order> orders = orderRepository.findByUserEmailOrderByOrderDateDesc(email);

        try {
            byte[] pdfBytes = pdfReportService.generateUserEcoReport(email, lifetimeSavings, badges, orders);

            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=EcoBazaar_Impact_Report.pdf")
                    .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(pdfBytes);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
