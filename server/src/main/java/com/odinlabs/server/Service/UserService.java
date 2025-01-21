package com.odinlabs.server.Service;

import com.odinlabs.server.Models.User;
import com.odinlabs.server.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public String registerUser(User user) {
        if (user.getUserEmail() == null || user.getUserEmail().isEmpty()) {
            return "Email cannot be null or empty";
        }
        if (user.getUserPassword() == null || user.getUserPassword().isEmpty()) {
            return "Password cannot be null or empty";
        }
        if (user.getUserName() == null || user.getUserName().isEmpty()) {
            return "Name cannot be null or empty";
        }
        if (user.getUserRollNumber() == null || user.getUserRollNumber().isEmpty()) {
            return "Roll number cannot be null or empty";
        }
        if (user.getUserSection() == null || user.getUserSection().isEmpty()) {
            return "Section cannot be null or empty";
        }
        if (user.getUserTeamName() == null || user.getUserTeamName().isEmpty()) {
            user.setUserTeamName("DC guy");
        }
        if (user.getUserIsAdmin() == null) {
            user.setUserIsAdmin(false);
        }

        if (userRepo.emailExists(user.getUserEmail())) {
            return "Email already exists";
        }

        if (userRepo.rollNumberExists(user.getUserRollNumber())) {
            return "Roll number already exists";
        }

        try {
            user.setUserPassword(userRepo.encryptPassword(user.getUserPassword()));
            userRepo.save(user);
            return "User Registered Successfully";
        } catch (Exception e) {
            return "User Registration Failed: " + e.getMessage();
        }
    }

    public User findByUserEmail(String email) {
        return userRepo.findByUserEmail(email);
    }

    public boolean validPassword(String rawPassword, String hashedPassword) {
        return userRepo.validPassword(rawPassword, hashedPassword);
    }
}