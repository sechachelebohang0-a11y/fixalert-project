package com.examplecom.fixalert.fixalert_backend.notification;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notifications;

    public NotificationService(NotificationRepository notifications) {
        this.notifications = notifications;
    }

    public void send(Long userId, Long reportId, String title, String message) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setReportId(reportId);
        n.setTitle(title);
        n.setMessage(message);
        notifications.save(n);
    }
}