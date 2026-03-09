package com.ecobazaar.backend.controller;

import com.ecobazaar.backend.model.CarbonFootprint;
import com.ecobazaar.backend.service.CarbonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/carbon")
public class CarbonController {

    @Autowired
    private CarbonService carbonService;

    @PostMapping
    public ResponseEntity<CarbonFootprint> saveCarbonFootprint(@RequestBody CarbonFootprint carbonFootprint) {
        return ResponseEntity.ok(carbonService.saveCarbonFootprint(carbonFootprint));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CarbonFootprint>> getCarbonFootprintHistoryForProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(carbonService.getCarbonFootprintHistoryForProduct(productId));
    }

    @GetMapping("/product/{productId}/report")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long productId) {
        String html = carbonService.generateCarbonFootprintReport(productId);
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "report.pdf");

            return new ResponseEntity<>(os.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
