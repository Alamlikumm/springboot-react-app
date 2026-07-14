package com.ridho.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatDTO {
    private String categoryName;
    private long productCount;
    private long totalStock;
}
