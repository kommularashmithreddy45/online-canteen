package com.canteen.controller;

import com.canteen.dto.OrderItemRequest;
import com.canteen.dto.OrderRequest;
import com.canteen.dto.StatusUpdateRequest;
import com.canteen.model.MenuItem;
import com.canteen.model.Order;
import com.canteen.model.OrderItem;
import com.canteen.model.OrderStatus;
import com.canteen.model.User;
import com.canteen.repository.MenuItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository,
                           MenuItemRepository menuItemRepository,
                           UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    // Place an Order (Student)
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Order must contain at least one item");
        }

        Optional<User> userOpt = userRepository.findByCollegeId(request.getCollegeId());
        String studentName = userOpt.map(User::getFullName).orElse("Student (" + request.getCollegeId() + ")");

        double total = 0.0;
        Order order = new Order(request.getCollegeId(), studentName, 0.0);

        for (OrderItemRequest itemReq : request.getItems()) {
            Optional<MenuItem> menuOpt = menuItemRepository.findById(itemReq.getMenuItemId());
            if (menuOpt.isPresent()) {
                MenuItem item = menuOpt.get();
                int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;
                OrderItem orderItem = new OrderItem(item.getName(), item.getPrice(), qty);
                order.addItem(orderItem);
                total += (item.getPrice() * qty);
            }
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // Get orders by Student College ID
    @GetMapping("/student/{collegeId}")
    public List<Order> getStudentOrders(@PathVariable String collegeId) {
        return orderRepository.findByCollegeIdOrderByCreatedAtDesc(collegeId.toUpperCase());
    }

    // Get all orders (Owner view)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // Update order status (Owner action)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            OrderStatus newStatus = OrderStatus.valueOf(req.getStatus().toUpperCase());
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + req.getStatus());
        }
    }
}
