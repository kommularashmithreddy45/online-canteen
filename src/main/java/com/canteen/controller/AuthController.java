package com.canteen.controller;

import com.canteen.dto.LoginRequest;
import com.canteen.dto.LoginResponse;
import com.canteen.model.User;
import com.canteen.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request.getCollegeId() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(
                new LoginResponse(false, "College ID and password are required", null, null, null)
            );
        }

        Optional<User> userOpt = userRepository.findByCollegeId(request.getCollegeId().trim().toUpperCase());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Login successful",
                    user.getCollegeId(),
                    user.getFullName(),
                    user.getRole().name()
                ));
            }
        }

        return ResponseEntity.status(401).body(
            new LoginResponse(false, "Invalid College ID or Password", null, null, null)
        );
    }
}
