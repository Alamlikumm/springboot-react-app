package com.ridho.app.controller;

import com.ridho.app.dto.ApiResponse;
import com.ridho.app.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        
        Map<String, String> responseData = new HashMap<>();
        responseData.put("imageUrl", fileUrl);
        
        return ResponseEntity.ok(ApiResponse.success("File berhasil diupload", responseData));
    }
}
