package com.odinlabs.server.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.odinlabs.server.Models.User;
import com.odinlabs.server.Service.JwtService;
import com.odinlabs.server.Service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
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

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String userEmail = request.get("userEmail");
        String userSecret = request.get("userSecret");
        String newPassword = request.get("newPassword");

        User user = userService.findByUserEmail(userEmail);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        if (!user.getUserSecret().equals(userSecret)) {
            return new ResponseEntity<>("Invalid secret", HttpStatus.FORBIDDEN);
        }

        boolean result = userService.updateUserPassword(user.getId(), newPassword);

        if (!result) {
            return new ResponseEntity<>("Failed to update password", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("Your password has been updated successfully!", HttpStatus.OK);
    }

}
