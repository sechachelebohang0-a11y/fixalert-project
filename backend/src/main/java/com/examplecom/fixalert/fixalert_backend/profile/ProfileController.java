package com.examplecom.fixalert.fixalert_backend.profile;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examplecom.fixalert.fixalert_backend.user.User;
import com.examplecom.fixalert.fixalert_backend.user.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public ProfileController(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    private Optional<User> current(Authentication auth) {
        return users.findById(Long.valueOf(auth.getName()));
    }

    private ResponseEntity<?> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }

    @GetMapping
    public ResponseEntity<?> get(Authentication auth) {
        Optional<User> user = current(auth);
        if (user.isEmpty()) return error(HttpStatus.NOT_FOUND, "User not found");
        return ResponseEntity.ok(ProfileResponse.from(user.get()));
    }

    @PutMapping
    public ResponseEntity<?> update(@Valid @RequestBody UpdateProfileRequest req, Authentication auth) {
        Optional<User> found = current(auth);
        if (found.isEmpty()) return error(HttpStatus.NOT_FOUND, "User not found");
        User user = found.get();

        String newEmail = req.email() == null ? "" : req.email().trim().toLowerCase();
        boolean emailChanging = !newEmail.isEmpty() && !newEmail.equals(user.getEmail());

        if (emailChanging) {
            if (req.currentPassword() == null
                    || !encoder.matches(req.currentPassword(), user.getPasswordHash())) {
                return error(HttpStatus.BAD_REQUEST, "Current password is incorrect");
            }
            if (users.existsByEmail(newEmail)) {
                return error(HttpStatus.CONFLICT, "That email is already in use");
            }
            user.setEmail(newEmail);
        }

        user.setFullName(req.fullName().trim());
        users.save(user);
        return ResponseEntity.ok(ProfileResponse.from(user));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest req,
                                            Authentication auth) {
        Optional<User> found = current(auth);
        if (found.isEmpty()) return error(HttpStatus.NOT_FOUND, "User not found");
        User user = found.get();

        if (!encoder.matches(req.currentPassword(), user.getPasswordHash())) {
            return error(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        if (encoder.matches(req.newPassword(), user.getPasswordHash())) {
            return error(HttpStatus.BAD_REQUEST, "The new password must be different");
        }

        user.setPasswordHash(encoder.encode(req.newPassword()));
        users.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }
}