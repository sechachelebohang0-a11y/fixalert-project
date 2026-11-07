package com.examplecom.fixalert.fixalert_backend.report;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.examplecom.fixalert.fixalert_backend.notification.NotificationService;

import jakarta.validation.Valid;

@RestController
public class ReportController {

    private final ReportRepository reports;
    private final NotificationService notifications;

    public ReportController(ReportRepository reports, NotificationService notifications) {
        this.reports = reports;
        this.notifications = notifications;
    }

    @PostMapping("/api/reports")
    @Transactional
    public ResponseEntity<ReportResponse> create(@Valid @RequestBody CreateReportRequest req,
                                                 Authentication auth) {
        Long userId = Long.valueOf(auth.getName());

        Report report = new Report();
        report.setReporterId(userId);
        report.setProblemType(req.problemType());
        report.setLocation(req.location().trim());
        report.setDescription(req.description().trim());
        reports.save(report);

        notifications.send(userId, report.getId(), "Report received",
                "Your " + report.getProblemType() + " report at " + report.getLocation()
                        + " has been received by maintenance staff.");

        return ResponseEntity.status(HttpStatus.CREATED).body(ReportResponse.from(report));
    }

    @GetMapping("/api/reports/mine")
    public List<ReportResponse> mine(Authentication auth) {
        Long userId = Long.valueOf(auth.getName());
        return reports.findByReporterIdOrderByCreatedAtDesc(userId).stream()
                .map(ReportResponse::from).toList();
    }
}