package com.soen6461.rental.user;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/api/log-in")
    public LogInResponse logIn(@RequestBody LogInRequest logInRequest) {
        return userService.logIn(logInRequest);
    }
}
