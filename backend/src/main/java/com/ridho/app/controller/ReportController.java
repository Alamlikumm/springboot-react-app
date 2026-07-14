package com.ridho.app.controller;

import com.ridho.app.dto.ApiResponse;
import com.ridho.app.dto.ReportResponseDTO;
import com.ridho.app.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/sales")
    public ResponseEntity<ApiResponse<ReportResponseDTO>> getSalesReport() {
        ReportResponseDTO report = reportService.getSalesReport(null, null);
        
        return ResponseEntity.ok(ApiResponse.<ReportResponseDTO>builder()
                .success(true)
                .message("Laporan penjualan berhasil diambil")
                .data(report)
                .build());
    }
}
