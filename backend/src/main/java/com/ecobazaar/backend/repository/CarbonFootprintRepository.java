package com.ecobazaar.backend.repository;

import com.ecobazaar.backend.model.CarbonFootprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarbonFootprintRepository extends JpaRepository<CarbonFootprint, Long> {
    List<CarbonFootprint> findByProductId(Long productId);
    List<CarbonFootprint> findByUserId(Long userId);
}
