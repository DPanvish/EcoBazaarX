package com.ecobazaar.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail; 

    private Double totalAmount;
    private Double totalCo2Saved; 
    private LocalDateTime orderDate;
    private String status;

    // One order can have many items. CascadeType.ALL means if we save the Order, 
    // it automatically saves all the OrderItems inside it too!
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items = new ArrayList<>();
}