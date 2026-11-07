package com.examplecom.fixalert.fixalert_backend.profile;

import com.examplecom.fixalert.fixalert_backend.user.User;

public record ProfileResponse(Long id, String fullName, String email, String staffId, String role) {

    public static ProfileResponse from(User u) {
        return new ProfileResponse(u.getId(), u.getFullName(), u.getEmail(), u.getStaffId(), u.getRole());
    }
}