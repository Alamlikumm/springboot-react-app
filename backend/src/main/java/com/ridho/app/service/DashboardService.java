package com.ridho.app.service;

import com.ridho.app.dto.CategoryStatDTO;
import com.ridho.app.dto.DashboardStatsDTO;
import com.ridho.app.dto.ProductDTO;
import com.ridho.app.model.Product;
import com.ridho.app.repository.CategoryRepository;
import com.ridho.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DashboardStatsDTO getStats() {
        List<Product> products = productRepository.findByActiveTrue();
        
        long totalProducts = products.size();
        long totalStock = 0;
        double totalPrice = 0;
        
        Map<String, CategoryStatDTO> categoryStatMap = new HashMap<>();
        List<ProductDTO> lowStock = new ArrayList<>();
        
        for (Product p : products) {
            totalStock += p.getStock();
            totalPrice += p.getPrice().doubleValue();
            
            if (p.getStock() < 10) {
                lowStock.add(mapToDTO(p));
            }
            
            String catName = p.getCategory() != null ? p.getCategory().getName() : "Tanpa Kategori";
            CategoryStatDTO stat = categoryStatMap.getOrDefault(catName, new CategoryStatDTO(catName, 0, 0));
            stat.setProductCount(stat.getProductCount() + 1);
            stat.setTotalStock(stat.getTotalStock() + p.getStock());
            categoryStatMap.put(catName, stat);
        }
        
        double avgPrice = totalProducts > 0 ? totalPrice / totalProducts : 0;
        long totalCategories = categoryRepository.count();
        
        // Get top 5 recent products
        List<ProductDTO> recentProducts = productRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"))
                .stream()
                .filter(Product::getActive)
                .limit(5)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        
        return DashboardStatsDTO.builder()
                .totalProducts(totalProducts)
                .totalStock(totalStock)
                .avgPrice(avgPrice)
                .totalCategories(totalCategories)
                .lowStockProducts(lowStock)
                .categoryStats(new ArrayList<>(categoryStatMap.values()))
                .recentProducts(recentProducts)
                .build();
    }
    
    private ProductDTO mapToDTO(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .stock(p.getStock())
                .imageUrl(p.getImageUrl())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .build();
    }
}
