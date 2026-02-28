package com.ecobazaar.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecobazaar.backend.model.Order;
import com.ecobazaar.backend.model.OrderItem;
import com.ecobazaar.backend.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create")
    public Order createOrder(@RequestBody Map<String, Object> orderRequest) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Double totalAmount = Double.valueOf(orderRequest.get("totalAmount").toString());
        Double totalCo2 = Double.valueOf(orderRequest.get("totalCo2").toString());
        
        List<Map<String, Object>> cartItems = (List<Map<String, Object>>) orderRequest.get("items");
        List<OrderItem> orderItems = cartItems.stream().map(item -> {
            return OrderItem.builder()
                    .productId(Long.valueOf(item.get("id").toString()))
                    .productName(item.get("name").toString())
                    .price(Double.valueOf(item.get("price").toString()))
                    .co2Emission(Double.valueOf(item.get("co2Emission").toString()))
                    .build();
        }).collect(Collectors.toList());

        Order newOrder = Order.builder()
                .userEmail(userEmail)
                .totalAmount(totalAmount)
                .totalCo2Saved(totalCo2)
                .orderDate(LocalDateTime.now())
                .status("COMPLETED")
                .items(orderItems)
                .build();

        return orderRepository.save(newOrder);
    }

    @GetMapping("/my-orders")
    public List<Order> getMyOrders() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return orderRepository.findByUserEmailOrderByOrderDateDesc(userEmail);
    }
}