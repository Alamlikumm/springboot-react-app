package com.ridho.app.service;

import com.ridho.app.dto.ProductDTO;
import com.ridho.app.model.Category;
import com.ridho.app.model.Product;
import com.ridho.app.repository.CategoryRepository;
import com.ridho.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Page<ProductDTO> getProductsPaged(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable).map(this::mapToDTO);
    }

    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product tidak ditemukan dengan ID: " + id));
    }
    
    public ProductDTO getProductById(Long id) {
        return mapToDTO(getProductEntityById(id));
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Kategori tidak ditemukan"));
        }

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock() != null ? dto.getStock() : 0)
                .imageUrl(dto.getImageUrl())
                .category(category)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        return mapToDTO(productRepository.save(product));
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = getProductEntityById(id);
        
        Category category = product.getCategory();
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Kategori tidak ditemukan"));
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock() != null ? dto.getStock() : product.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setCategory(category);
        if (dto.getActive() != null) {
            product.setActive(dto.getActive());
        }
        
        return mapToDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductEntityById(id);
        product.setActive(false); // Soft delete
        productRepository.save(product);
    }
    
    @Transactional
    public void deleteBulk(List<Long> ids) {
        List<Product> products = productRepository.findAllById(ids);
        products.forEach(p -> p.setActive(false));
        productRepository.saveAll(products);
    }

    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Page<ProductDTO> searchProductsPaged(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword, pageable).map(this::mapToDTO);
    }

    public String exportToCSV() {
        List<Product> products = productRepository.findByActiveTrue();
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        
        pw.println("ID,Nama,Deskripsi,Harga,Stok,Kategori");
        for (Product p : products) {
            String catName = p.getCategory() != null ? p.getCategory().getName() : "";
            // Escape quotes and wrap in quotes to handle commas in description
            String desc = p.getDescription() != null ? "\"" + p.getDescription().replace("\"", "\"\"") + "\"" : "";
            pw.printf("%d,\"%s\",%s,%.2f,%d,\"%s\"\n", 
                p.getId(), p.getName(), desc, p.getPrice(), p.getStock(), catName);
        }
        return sw.toString();
    }

    private ProductDTO mapToDTO(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stock(p.getStock())
                .imageUrl(p.getImageUrl())
                .active(p.getActive())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .build();
    }
}
