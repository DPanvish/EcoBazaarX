package com.ecobazaar.backend.service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ecobazaar.backend.model.Order;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PdfReportService {

    public byte[] generateUserEcoReport(String email, Double lifetimeSavings, List<String> badges, List<Order> orders) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);

        document.open();

        // Title Settings
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(24);
        titleFont.setColor(new Color(16, 185, 129)); 

        Paragraph title = new Paragraph("EcoBazaarX - Personal Impact Report", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);
        
        // Subtitle
        Font subFont = FontFactory.getFont(FontFactory.HELVETICA);
        subFont.setSize(12);
        subFont.setColor(Color.DARK_GRAY);
        Paragraph subtitle = new Paragraph("Generated for: " + email + "\n\n", subFont);
        subtitle.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(subtitle);

        // Main Impact Metric
        Font impactFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        impactFont.setSize(18);
        Paragraph impact = new Paragraph("Total Carbon Prevented: " + String.format("%.2f", lifetimeSavings) + " kg CO2", impactFont);
        impact.setAlignment(Paragraph.ALIGN_LEFT);
        impact.setSpacingBefore(20);
        impact.setSpacingAfter(20);
        document.add(impact);

        // Badges Table
        document.add(new Paragraph("Earned Eco-Achievements:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph(" ")); 

        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);

        if (badges.isEmpty()) {
            table.addCell(new PdfPCell(new Phrase("No badges earned yet. Keep shopping green!")));
        } else {
            for (String badge : badges) {
                PdfPCell cell = new PdfPCell(new Phrase(badge));
                cell.setPadding(10);
                cell.setBorderColor(new Color(16, 185, 129));
                cell.setBackgroundColor(new Color(240, 253, 244)); 
                table.addCell(cell);
            }
        }
        document.add(table);

        // Order History Table
        document.add(new Paragraph("\n\nRecent Order History:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph(" "));

        PdfPTable orderTable = new PdfPTable(4);
        orderTable.setWidthPercentage(100);
        orderTable.setWidths(new float[]{3f, 2f, 2f, 2f}); // Column widths

        // Table Headers
        String[] headers = {"Date", "Amount", "CO2 Saved", "Status"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            cell.setBackgroundColor(Color.LIGHT_GRAY);
            cell.setPadding(8);
            orderTable.addCell(cell);
        }

        // Table Data
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        if (orders == null || orders.isEmpty()) {
            PdfPCell emptyCell = new PdfPCell(new Phrase("No orders found."));
            emptyCell.setColspan(4);
            emptyCell.setPadding(8);
            orderTable.addCell(emptyCell);
        } else {
            for (Order order : orders) {
                orderTable.addCell(new PdfPCell(new Phrase(order.getOrderDate() != null ? order.getOrderDate().format(formatter) : "N/A")));
                orderTable.addCell(new PdfPCell(new Phrase("$" + String.format("%.2f", order.getTotalAmount()))));
                orderTable.addCell(new PdfPCell(new Phrase(String.format("%.1f", order.getTotalCo2Saved()) + " kg")));
                orderTable.addCell(new PdfPCell(new Phrase(order.getStatus())));
            }
        }
        document.add(orderTable);

        // Footer
        Paragraph footer = new Paragraph("\n\nThank you for shopping sustainably and helping protect our planet.", subFont);
        footer.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return out.toByteArray();
    }
}