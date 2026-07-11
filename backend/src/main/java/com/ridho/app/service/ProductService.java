package com.ridho.app.service;

import com.ridho.app.dto.ProductDTO;
import com.ridho.app.model.Product;
import com.ridho.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findByActiveTrue();
    }

    public Page<Product> getProductsPaged(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product tidak ditemukan dengan ID: " + id));
    }

    public Product createProduct(ProductDTO dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock() != null ? dto.getStock() : 0)
                .imageUrl(dto.getImageUrl())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductDTO dto) {
        Product product = getProductById(id);
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock() != null ? dto.getStock() : product.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setActive(dto.getActive() != null ? dto.getActive() : product.getActive());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false); // Soft delete
        productRepository.save(product);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Page<Product> searchProductsPaged(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword, pageable);
    }
}
