package com.ecobazaar.backend.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecobazaar.backend.model.CarbonFootprint;
import com.ecobazaar.backend.model.Order;
import com.ecobazaar.backend.model.OrderItem;
import com.ecobazaar.backend.model.User;
import com.ecobazaar.backend.repository.CarbonFootprintRepository;
import com.ecobazaar.backend.repository.OrderRepository;
import com.ecobazaar.backend.repository.UserRepository;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarbonFootprintRepository carbonFootprintRepository;

    @Transactional
    public Order createOrder(Map<String, Object> orderRequest) {
        logger.info("Creating order with request: {}", orderRequest);

        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        // for (OrderItem item : orderItems) {
        //     item.setOrder(newOrder);
        // }

        Order savedOrder = orderRepository.save(newOrder);
        logger.info("Saved order: {}", savedOrder);

        // Create CarbonFootprint for each order item
        for (OrderItem item : savedOrder.getItems()) {
            CarbonFootprint carbonFootprint = CarbonFootprint.builder()
                    .productId(item.getProductId())
                    .userId(user.getId())
                    .carbonFootprint(item.getCo2Emission())
                    .calculationDate(new Date())
                    .build();
            carbonFootprintRepository.save(carbonFootprint);
        }

        return savedOrder;
    }

    public List<Order> getMyOrders() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return orderRepository.findByUserEmailOrderByOrderDateDesc(userEmail);
    }
}
