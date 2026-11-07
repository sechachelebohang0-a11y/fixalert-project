package com.examplecom.fixalert.fixalert_backend.report;

import java.time.Instant;

public record ReportResponse(
        Long id,
        String problemType,
        String location,
        String description,
        String status,
        Instant createdAt,
        Instant updatedAt,
        Instant fixedAt) {

    public static ReportResponse from(Report r) {
        return new ReportResponse(r.getId(), r.getProblemType(), r.getLocation(),
                r.getDescription(), r.getStatus(), r.getCreatedAt(),
                r.getUpdatedAt(), r.getFixedAt());
    }
}