package com.ridho.app.repository;

import com.ridho.app.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    Page<Product> findByActiveTrue(Pageable pageable);
    List<Product> findByNameContainingIgnoreCase(String name);
    Page<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name, Pageable pageable);
}
