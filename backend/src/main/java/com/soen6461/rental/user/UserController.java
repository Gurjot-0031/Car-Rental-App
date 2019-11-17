package com.soen6461.rental.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {


    private final UserService userService;
    private boolean hasAdmin = false;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/api/log-in")
    public LogInResponse logIn(@RequestBody LogInRequest logInRequest) {
        LogInResponse logInResponse = userService.logIn(logInRequest);

        if (!logInResponse.isSuccess) {
            return logInResponse;
        }
        if (logInResponse.role.equals("clerk")) {
            return logInResponse;
        }
        if (!hasAdmin) {
            hasAdmin = true;
            return logInResponse;
        }
        logInResponse.isSuccess = false;
        logInResponse.role = "admin-refuse";
        return logInResponse;
    }

    @PostMapping("/api/log-out")
    public void adminLogout(@RequestBody List<String> roles) {
        if (roles.contains("admin")) {
            hasAdmin = false;
        }
    }
}
