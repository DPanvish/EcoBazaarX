package com.ecobazaar.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ecobazaar.backend.dto.TopProductDTO;
import com.ecobazaar.backend.model.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT i.productName as productName, COUNT(i.id) as unitsSold, SUM(i.co2Emission) as totalCarbonSaved " +
           "FROM OrderItem i WHERE i.isEcoFriendly = true " +
           "GROUP BY i.productId, i.productName " +
           "ORDER BY unitsSold DESC LIMIT 5")
    List<TopProductDTO> getTopEcoProducts();
}