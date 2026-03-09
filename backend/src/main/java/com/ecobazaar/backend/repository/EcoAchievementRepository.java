package com.ecobazaar.backend.repository;

import com.ecobazaar.backend.model.EcoAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EcoAchievementRepository extends JpaRepository<EcoAchievement, Long> {
}
