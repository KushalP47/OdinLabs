package com.odinlabs.server.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.odinlabs.server.Models.User;
import com.odinlabs.server.Service.JwtService;
import com.odinlabs.server.Service.UserService;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String result = userService.registerUser(user);
        if (result.equals("User Registered Successfully")) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        try {
            User foundUser = userService.findByUserEmail(user.getUserEmail());
            if (foundUser != null && userService.validPassword(user.getUserPassword(), foundUser.getUserPassword())) {
                String token = jwtService.generateToken(foundUser);
                return ResponseEntity.ok().header("Authorization", "Bearer " + token).body("Login Successful");
            } else {
                return new ResponseEntity<>("Invalid Credentials", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Login Failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/logout")
    public String logout() {
        return "Logout";
    }

    @PostMapping("/forgot-password")
    public String forgotPassword() {
        return "Forgot Password";
    }

}
