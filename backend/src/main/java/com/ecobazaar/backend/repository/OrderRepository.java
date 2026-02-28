package com.ecobazaar.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecobazaar.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEmailOrderByOrderDateDesc(String userEmail);
}