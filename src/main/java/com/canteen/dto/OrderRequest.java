package com.canteen.dto;

import java.util.List;

public class OrderRequest {
    private String collegeId;
    private List<OrderItemRequest> items;

    public OrderRequest() {}

    public String getCollegeId() { return collegeId; }
    public void setCollegeId(String collegeId) { this.collegeId = collegeId; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
