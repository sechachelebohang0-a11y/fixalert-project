package com.examplecom.fixalert.fixalert_backend.auth;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examplecom.fixalert.fixalert_backend.security.JwtService;
import com.examplecom.fixalert.fixalert_backend.user.User;
import com.examplecom.fixalert.fixalert_backend.user.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        String email = req.email().trim().toLowerCase();

        if (users.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "That email is already registered"));
        }

        User user = new User();
        user.setFullName(req.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(req.password()));
        user.setRole("reporter"); // public sign-up can only ever create reporters
        users.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        String identifier = req.identifier().trim();

        // Reporters log in with email, maintenance staff with Staff ID
        Optional<User> found = identifier.contains("@")
                ? users.findByEmail(identifier.toLowerCase())
                : users.findByStaffId(identifier);

        // Same message for "no such user" and "wrong password" so attackers learn nothing
        if (found.isEmpty() || !encoder.matches(req.password(), found.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email/staff ID or password"));
        }

        User user = found.get();
        return ResponseEntity.ok(Map.of(
                "token", jwtService.generateToken(user),
                "user", Map.of(
                        "id", user.getId(),
                        "fullName", user.getFullName(),
                        "role", user.getRole())));
    }
}