package com.ecobazaar.backend.controller;

import com.ecobazaar.backend.model.Order;
import com.ecobazaar.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public Order createOrder(@RequestBody Map<String, Object> orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    @GetMapping("/my-orders")
    public List<Order> getMyOrders() {
        return orderService.getMyOrders();
    }
}