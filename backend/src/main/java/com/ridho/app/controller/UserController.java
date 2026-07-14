package com.ridho.app.controller;

import com.ridho.app.dto.ApiResponse;
import com.ridho.app.dto.PasswordChangeDTO;
import com.ridho.app.dto.UserDTO;
import com.ridho.app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // PROFILE ENDPOINTS (For current logged-in user)
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(Authentication authentication) {
        UserDTO userDTO = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profil berhasil diambil", userDTO));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            Authentication authentication, 
            @Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUserProfile(authentication.getName(), userDTO);
        return ResponseEntity.ok(ApiResponse.success("Profil berhasil diupdate", updatedUser));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication, 
            @Valid @RequestBody PasswordChangeDTO dto) {
        userService.changePassword(authentication.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Password berhasil diubah", null));
    }

    // ADMIN ENDPOINTS (User Management)
    // In a real app we'd use @PreAuthorize("hasRole('ADMIN')")
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Daftar user berhasil diambil", userService.getAllUsers()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User berhasil dihapus", null));
    }
}
