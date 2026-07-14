package com.ridho.app.service;

import com.ridho.app.dto.TransactionItemRequestDTO;
import com.ridho.app.dto.TransactionItemResponseDTO;
import com.ridho.app.dto.TransactionRequestDTO;
import com.ridho.app.dto.TransactionResponseDTO;
import com.ridho.app.model.Product;
import com.ridho.app.model.Transaction;
import com.ridho.app.model.TransactionItem;
import com.ridho.app.model.User;
import com.ridho.app.repository.ProductRepository;
import com.ridho.app.repository.TransactionRepository;
import com.ridho.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public TransactionResponseDTO createTransaction(TransactionRequestDTO request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kasir tidak ditemukan"));

        Transaction transaction = new Transaction();
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setUser(user);
        
        // Generate Invoice Number (e.g., INV-20231015-123456)
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        transaction.setInvoiceNumber("INV-" + timestamp);

        List<TransactionItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (TransactionItemRequestDTO itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produk dengan ID " + itemRequest.getProductId() + " tidak ditemukan"));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Stok tidak mencukupi untuk produk: " + product.getName());
            }

            // Kurangi stok
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            TransactionItem item = new TransactionItem();
            item.setTransaction(transaction);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(product.getPrice());
            
            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            item.setSubtotal(subtotal);
            
            totalAmount = totalAmount.add(subtotal);
            items.add(item);
        }

        transaction.setItems(items);
        transaction.setTotalAmount(totalAmount);

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToDTO(savedTransaction);
    }

    public List<TransactionResponseDTO> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TransactionResponseDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));
        return mapToDTO(transaction);
    }

    private TransactionResponseDTO mapToDTO(Transaction t) {
        List<TransactionItemResponseDTO> items = t.getItems().stream().map(item -> 
            TransactionItemResponseDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build()
        ).collect(Collectors.toList());

        return TransactionResponseDTO.builder()
                .id(t.getId())
                .invoiceNumber(t.getInvoiceNumber())
                .totalAmount(t.getTotalAmount())
                .transactionDate(t.getTransactionDate())
                .cashierName(t.getUser() != null ? t.getUser().getUsername() : "Unknown")
                .items(items)
                .build();
    }
}
