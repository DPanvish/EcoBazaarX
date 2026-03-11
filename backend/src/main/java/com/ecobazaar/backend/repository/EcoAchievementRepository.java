package com.ecobazaar.backend.repository;

import com.ecobazaar.backend.model.EcoAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EcoAchievementRepository extends JpaRepository<EcoAchievement, Long> {
    List<EcoAchievement> findByUserId(Long userId);
}
