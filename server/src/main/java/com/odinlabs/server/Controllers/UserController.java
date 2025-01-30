package com.odinlabs.server.Controllers;

import com.odinlabs.server.Models.User;
import com.odinlabs.server.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/getUsersFromSection")
    public ResponseEntity<List<User>> getUsersFromSection(@RequestBody Map<String, String> request) {
        String section = request.get("section");
        List<User> users = userService.getUsersFromSection(section);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/getUser/{userRollNumber}")
    public ResponseEntity<User> getUser(@PathVariable String userRollNumber) {
        User user = userService.findByUserRollNumber(userRollNumber);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/editUser/{userId}")
    public ResponseEntity<String> editUser(@PathVariable String userId, @RequestBody User user) {
        boolean result = userService.editUser(userId, user);
        if (!result) {
            return new ResponseEntity<>("Failed to update user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
    }

    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        boolean result = userService.deleteUser(userId);
        if (!result) {
            return new ResponseEntity<>("Failed to delete user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    @PostMapping("/changeUserSecret")
    public ResponseEntity<String> changeUserSecret(@RequestBody Map<String, String> request) {
        String userEmail = request.get("userEmail");
        boolean result = userService.changeUserSecret(userEmail);
        if (!result) {
            return new ResponseEntity<>("Failed to change user secret", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("User secret changed successfully", HttpStatus.OK);
    }
}