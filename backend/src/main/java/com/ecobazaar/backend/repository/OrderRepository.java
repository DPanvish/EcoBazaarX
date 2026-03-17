package com.ecobazaar.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecobazaar.backend.dto.MonthlyTrendDTO;
import com.ecobazaar.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserEmailOrderByOrderDateDesc(String userEmail);
    @Query(value = "SELECT MONTHNAME(order_date) as month, SUM(total_co2_saved) as co2Saved " +
                   "FROM orders WHERE user_email = :email " +
                   "GROUP BY MONTH(order_date), MONTHNAME(order_date) " +
                   "ORDER BY MONTH(order_date)", nativeQuery = true)
    List<MonthlyTrendDTO> getMonthlyCarbonTrend(@Param("email") String email);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalPlatformRevenue();

    @Query("SELECT COALESCE(SUM(o.totalCo2Saved), 0) FROM Order o")
    Double getTotalPlatformCo2Saved();

    List<Order> findTop5ByOrderByOrderDateDesc();

    @Query("SELECT SUM(o.totalCo2Saved) FROM Order o WHERE o.userEmail = :email")
    Double getTotalLifetimeSavings(@Param("email") String email);
}