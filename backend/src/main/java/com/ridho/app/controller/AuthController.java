package com.ridho.app.controller;

import com.ridho.app.dto.*;
import com.ridho.app.model.User;
import com.ridho.app.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterDTO dto) {
        AuthResponse response = authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registrasi berhasil", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginDTO dto) {
        AuthResponse response = authService.login(dto);
        return ResponseEntity.ok(ApiResponse.success("Login berhasil", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                AuthResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build()
        ));
    }
}
