package com.ridho.app.service;

import com.ridho.app.config.JwtTokenProvider;
import com.ridho.app.dto.AuthResponse;
import com.ridho.app.dto.LoginDTO;
import com.ridho.app.dto.RegisterDTO;
import com.ridho.app.model.Role;
import com.ridho.app.model.User;
import com.ridho.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse register(RegisterDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username sudah digunakan");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email sudah digunakan");
        }

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.USER)
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginDTO dto) {
        User user = userRepository.findByUsernameOrEmail(dto.getUsername(), dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Username atau password salah"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Username atau password salah");
        }

        String token = tokenProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
    }
}
