package com.ridho.app.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class TransactionRequestDTO {
    @NotEmpty(message = "Transaction must have at least one item")
    @Valid
    private List<TransactionItemRequestDTO> items;
}
