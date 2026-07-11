package com.ridho.app.controller;

import com.ridho.app.dto.ApiResponse;
import com.ridho.app.dto.PagedResponse;
import com.ridho.app.dto.ProductDTO;
import com.ridho.app.model.Product;
import com.ridho.app.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products (Paginated)
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Product>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        String sortBy = sort[0];
        String sortDir = sort.length > 1 ? sort[1] : "asc";
        Sort sortObj = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Product> productPage = productService.getProductsPaged(pageable);

        PagedResponse<Product> response = PagedResponse.<Product>builder()
                .content(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    // POST /api/products
    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody ProductDTO dto) {
        Product product = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product berhasil dibuat", product));
    }

    // PUT /api/products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id, @Valid @RequestBody ProductDTO dto) {
        Product product = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product berhasil diupdate", product));
    }

    // DELETE /api/products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product berhasil dihapus", null));
    }

    // GET /api/products/search (Paginated)
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<Product>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        String sortBy = sort[0];
        String sortDir = sort.length > 1 ? sort[1] : "asc";
        Sort sortObj = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Product> productPage = productService.searchProductsPaged(keyword, pageable);

        PagedResponse<Product> response = PagedResponse.<Product>builder()
                .content(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
