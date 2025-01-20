package com.odinlabs.server.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.odinlabs.server.Models.User;
import com.odinlabs.server.Repository.UserRepo;

@RestController
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            user.setUserPassword(userRepo.encryptPassword(user.getUserPassword()));
            userRepo.save(user);
            return new ResponseEntity<>("User Registered Successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("User Registration Failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        try {
            User foundUser = userRepo.findByUserEmail(user.getUserEmail());
            if (foundUser != null && userRepo.validPassword(user.getUserPassword(), foundUser.getUserPassword())) {
                return new ResponseEntity<>("Login Successful", HttpStatus.OK);
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
