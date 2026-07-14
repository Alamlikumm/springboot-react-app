package com.ridho.app.config;

import com.ridho.app.model.Role;
import com.ridho.app.model.User;
import com.ridho.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Buat akun admin jika belum ada
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@admin.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
            log.info("✅ Akun admin berhasil dibuat!");
            log.info("   Username: admin");
            log.info("   Password: admin123");
        } else {
            log.info("ℹ️  Akun admin sudah ada, skip pembuatan.");
        }
    }
}
