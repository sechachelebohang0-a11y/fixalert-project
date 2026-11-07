package com.examplecom.fixalert.fixalert_backend.notification;

import java.time.Instant;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    public record NotificationResponse(Long id, Long reportId, String title,
                                       String message, boolean read, Instant createdAt) {
    }

    private final NotificationRepository notifications;

    public NotificationController(NotificationRepository notifications) {
        this.notifications = notifications;
    }

    @GetMapping("/api/notifications")
    public List<NotificationResponse> mine(Authentication auth) {
        Long userId = Long.valueOf(auth.getName());
        return notifications.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(n -> new NotificationResponse(n.getId(), n.getReportId(), n.getTitle(),
                        n.getMessage(), n.isRead(), n.getCreatedAt()))
                .toList();
    }
}