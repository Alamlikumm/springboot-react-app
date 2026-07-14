package com.ridho.app.service;

import com.ridho.app.dto.DailySalesDTO;
import com.ridho.app.dto.ReportResponseDTO;
import com.ridho.app.model.Transaction;
import com.ridho.app.model.TransactionItem;
import com.ridho.app.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public ReportResponseDTO getSalesReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Transaction> transactions = transactionRepository.findAllByOrderByTransactionDateDesc();
        
        // Filter by date range if provided (in real world, better do this in DB query)
        if (startDate != null && endDate != null) {
            transactions = transactions.stream()
                .filter(t -> !t.getTransactionDate().isBefore(startDate) && !t.getTransactionDate().isAfter(endDate))
                .collect(Collectors.toList());
        }

        BigDecimal totalRevenue = transactions.stream()
                .map(Transaction::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int productsSold = transactions.stream()
                .flatMap(t -> t.getItems().stream())
                .mapToInt(TransactionItem::getQuantity)
                .sum();

        // Group by date (LocalDate)
        Map<LocalDate, List<Transaction>> groupedByDate = transactions.stream()
                .collect(Collectors.groupingBy(t -> t.getTransactionDate().toLocalDate()));

        List<DailySalesDTO> dailySales = groupedByDate.entrySet().stream()
                .map(entry -> {
                    BigDecimal dailyTotal = entry.getValue().stream()
                            .map(Transaction::getTotalAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return DailySalesDTO.builder()
                            .date(entry.getKey())
                            .totalSales(dailyTotal)
                            .transactionCount(entry.getValue().size())
                            .build();
                })
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());

        return ReportResponseDTO.builder()
                .totalRevenue(totalRevenue)
                .totalTransactions(transactions.size())
                .productsSold(productsSold)
                .dailySales(dailySales)
                .build();
    }
}
