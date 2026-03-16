package com.ecobazaar.backend.service;

import com.ecobazaar.backend.model.EcoAchievement;
import com.ecobazaar.backend.repository.EcoAchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {

    @Autowired
    private EcoAchievementRepository ecoAchievementRepository;

    public EcoAchievement saveAchievement(EcoAchievement ecoAchievement) {
        return ecoAchievementRepository.save(ecoAchievement);
    }

    public List<EcoAchievement> getAchievementsForUser(Long userId) {
        return ecoAchievementRepository.findByUserId(userId);
    }
}
