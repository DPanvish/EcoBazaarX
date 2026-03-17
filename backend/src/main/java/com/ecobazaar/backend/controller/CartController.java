package com.ecobazaar.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecobazaar.backend.model.Cart;
import com.ecobazaar.backend.model.CartItem;
import com.ecobazaar.backend.repository.CartRepository;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    private Cart getMyCartFromDb() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return cartRepository.findByUserEmail(email)
                .orElseGet(() -> cartRepository.save(Cart.builder().userEmail(email).build()));
    }

    @GetMapping
    public Cart getCart() {
        return getMyCartFromDb();
    }

    @PostMapping("/add")
    public Cart addToCart(@RequestBody CartItem newItem) {
        Cart cart = getMyCartFromDb();
        cart.getItems().add(newItem);
        return cartRepository.save(cart);
    }

    @DeleteMapping("/remove/{productId}")
    public Cart removeFromCart(@PathVariable Long productId) {
        Cart cart = getMyCartFromDb();
        // Remove the item where the productId matches
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        return cartRepository.save(cart);
    }

    @PostMapping("/swap/{oldProductId}")
    public Cart swapCartItem(@PathVariable Long oldProductId, @RequestBody CartItem newItem) {
        Cart cart = getMyCartFromDb();
        // Remove the bad eco-choice
        cart.getItems().removeIf(item -> item.getProductId().equals(oldProductId));
        // Add the green alternative
        cart.getItems().add(newItem);
        return cartRepository.save(cart);
    }

    @DeleteMapping("/clear")
    public void clearCart() {
        Cart cart = getMyCartFromDb();
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}