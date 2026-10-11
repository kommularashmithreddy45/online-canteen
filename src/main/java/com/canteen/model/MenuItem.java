package com.canteen.model;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // Snacks, Beverages, Meals

    @Column(nullable = false)
    private Double price;

    private String description;
    private String emoji; // Visual representation for fast Zepto style UI
    private boolean available = true;

    public MenuItem() {}

    public MenuItem(String name, String category, Double price, String description, String emoji) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
        this.emoji = emoji;
        this.available = true;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
