package com.examplecom.fixalert.fixalert_backend.report;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByReporterIdOrderByCreatedAtDesc(Long reporterId);

    List<Report> findAllByOrderByCreatedAtDesc();

    long countByStatus(String status);
}