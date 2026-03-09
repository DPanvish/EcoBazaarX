package com.ecobazaar.backend.service;

import com.ecobazaar.backend.model.CarbonFootprint;
import com.ecobazaar.backend.repository.CarbonFootprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarbonService {

    @Autowired
    private CarbonFootprintRepository carbonFootprintRepository;

    public CarbonFootprint saveCarbonFootprint(CarbonFootprint carbonFootprint) {
        return carbonFootprintRepository.save(carbonFootprint);
    }

    public List<CarbonFootprint> getCarbonFootprintHistoryForProduct(Long productId) {
        // This is a simplified implementation. In a real application, you would have a more complex query.
        return carbonFootprintRepository.findAll();
    }

    public String generateCarbonFootprintReport(Long productId) {
        List<CarbonFootprint> history = getCarbonFootprintHistoryForProduct(productId);
        StringBuilder html = new StringBuilder();
        html.append("<html><body>");
        html.append("<h1>Carbon Footprint Report for Product ").append(productId).append("</h1>");
        html.append("<table border='1'><tr><th>Date</th><th>Carbon Footprint (kg)</th></tr>");
        for (CarbonFootprint record : history) {
            html.append("<tr><td>").append(record.getCalculationDate()).append("</td><td>").append(record.getCarbonFootprint()).append("</td></tr>");
        }
        html.append("</table>");
        html.append("</body></html>");
        return html.toString();
    }
}
