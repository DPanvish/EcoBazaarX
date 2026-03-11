package com.ecobazaar.backend.service;

import com.ecobazaar.backend.model.Order;
import com.ecobazaar.backend.model.OrderItem;
import com.ecobazaar.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Map<String, Object>> getProductSalesAnalytics() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                        OrderItem::getProductName,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    int sales = list.size();
                                    double carbonSavings = list.stream().mapToDouble(OrderItem::getCo2Emission).sum();
                                    Map<String, Object> map = new HashMap<>();
                                    map.put("name", list.get(0).getProductName());
                                    map.put("sales", sales);
                                    map.put("carbonSavings", carbonSavings);
                                    return map;
                                })))
                .values().stream().collect(Collectors.toList());
    }
}
