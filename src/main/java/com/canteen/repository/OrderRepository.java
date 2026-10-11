package com.canteen.repository;

import com.canteen.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCollegeIdOrderByCreatedAtDesc(String collegeId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
