package com.ridho.app.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TransactionResponseDTO {
    private Long id;
    private String invoiceNumber;
    private BigDecimal totalAmount;
    private LocalDateTime transactionDate;
    private String cashierName;
    private List<TransactionItemResponseDTO> items;
}
