package com.examplecom.fixalert.fixalert_backend.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateReportRequest(
        @NotBlank @Pattern(regexp = "light|heater") String problemType,
        @NotBlank @Size(max = 150) String location,
        @NotBlank @Size(max = 1000) String description) {
}