package com.moviebooking.movie_service.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static String getUserIdOrNull() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}

