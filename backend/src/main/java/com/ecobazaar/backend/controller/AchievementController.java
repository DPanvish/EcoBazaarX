package com.ecobazaar.backend.controller;

import com.ecobazaar.backend.model.EcoAchievement;
import com.ecobazaar.backend.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @PostMapping
    public ResponseEntity<EcoAchievement> saveAchievement(@RequestBody EcoAchievement ecoAchievement) {
        return ResponseEntity.ok(achievementService.saveAchievement(ecoAchievement));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EcoAchievement>> getAchievementsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(achievementService.getAchievementsForUser(userId));
    }
}
