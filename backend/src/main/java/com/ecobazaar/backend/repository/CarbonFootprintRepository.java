package com.ecobazaar.backend.repository;

import com.ecobazaar.backend.model.CarbonFootprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarbonFootprintRepository extends JpaRepository<CarbonFootprint, Long> {
}
