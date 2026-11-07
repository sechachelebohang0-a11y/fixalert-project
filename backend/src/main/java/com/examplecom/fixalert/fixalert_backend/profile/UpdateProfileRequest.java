package com.examplecom.fixalert.fixalert_backend.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(max = 100) String fullName,
        @Email @Size(max = 254) String email,
        @Size(max = 72) String currentPassword) {
}