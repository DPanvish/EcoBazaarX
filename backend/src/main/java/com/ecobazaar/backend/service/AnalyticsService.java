package com.ecobazaar.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
    
    public List<String> calculateUserBadges(Double lifetimeSavings) {
        List<String> badges = new ArrayList<>();
        if (lifetimeSavings == null || lifetimeSavings <= 0) {
            badges.add("🌱 Newcomer");
            return badges;
        }
        
        if (lifetimeSavings >= 1.0) badges.add("🍃 First Sprout");
        if (lifetimeSavings >= 10.0) badges.add("🌳 Tree Planter");
        if (lifetimeSavings >= 50.0) badges.add("🌍 Carbon Ninja");
        if (lifetimeSavings >= 100.0) badges.add("🦸‍♂️ Climate Hero");
        
        return badges;
    }
}
