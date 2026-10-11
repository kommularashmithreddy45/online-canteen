package com.canteen.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String collegeId;
    private String fullName;
    private String role;

    public LoginResponse(boolean success, String message, String collegeId, String fullName, String role) {
        this.success = success;
        this.message = message;
        this.collegeId = collegeId;
        this.fullName = fullName;
        this.role = role;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getCollegeId() { return collegeId; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
}
