package com.ridho.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalProducts;
    private long totalStock;
    private double avgPrice;
    private long totalCategories;
    
    private List<ProductDTO> lowStockProducts;
    private List<CategoryStatDTO> categoryStats;
    private List<ProductDTO> recentProducts;
}
