package com.examplecom.fixalert.fixalert_backend.staff;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examplecom.fixalert.fixalert_backend.notification.NotificationService;
import com.examplecom.fixalert.fixalert_backend.report.Report;
import com.examplecom.fixalert.fixalert_backend.report.ReportRepository;
import com.examplecom.fixalert.fixalert_backend.report.ReportResponse;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final ReportRepository reports;
    private final NotificationService notifications;

    public StaffController(ReportRepository reports, NotificationService notifications) {
        this.reports = reports;
        this.notifications = notifications;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> dashboard() {
        return Map.of(
                "pending", reports.countByStatus("pending"),
                "inProgress", reports.countByStatus("in_progress"),
                "fixed", reports.countByStatus("fixed"));
    }

    @GetMapping("/reports")
    public List<ReportResponse> all() {
        return reports.findAllByOrderByCreatedAtDesc().stream()
                .map(ReportResponse::from).toList();
    }

    @PostMapping("/reports/{id}/accept")
    @Transactional
    public ResponseEntity<?> accept(@PathVariable Long id, Authentication auth) {
        Report report = reports.findById(id).orElse(null);
        if (report == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Report not found"));
        }
        if (!"pending".equals(report.getStatus())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Only pending reports can be accepted"));
        }

        report.setStatus("in_progress");
        report.setAcceptedBy(Long.valueOf(auth.getName()));
        report.setUpdatedAt(Instant.now());

        notifications.send(report.getReporterId(), report.getId(), "Report in progress",
                "Maintenance staff is working on your " + report.getProblemType() + " report.");

        return ResponseEntity.ok(ReportResponse.from(report));
    }

    @PostMapping("/reports/{id}/fix")
    @Transactional
    public ResponseEntity<?> fix(@PathVariable Long id, Authentication auth) {
        Report report = reports.findById(id).orElse(null);
        if (report == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Report not found"));
        }
        if ("fixed".equals(report.getStatus())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Report is already fixed"));
        }

        report.setStatus("fixed");
        if (report.getAcceptedBy() == null) {
            report.setAcceptedBy(Long.valueOf(auth.getName()));
        }
        report.setFixedAt(Instant.now());
        report.setUpdatedAt(Instant.now());

        notifications.send(report.getReporterId(), report.getId(), "Problem fixed",
                "Your reported " + report.getProblemType() + " problem has been resolved.");

        return ResponseEntity.ok(ReportResponse.from(report));
    }
}