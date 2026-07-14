package com.ridho.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponseDTO {
    private BigDecimal totalRevenue;
    private int totalTransactions;
    private int productsSold;
    private List<DailySalesDTO> dailySales;
}
