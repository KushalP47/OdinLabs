package com.odinlabs.server.Service;

import com.odinlabs.server.Models.User;
import com.odinlabs.server.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

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

    public boolean updateUserPassword(String userId, String newPassword) {
        try {
            User user = userRepo.findById(userId).orElse(null);
            if (user != null) {
                user.setUserPassword(userRepo.encryptPassword(newPassword));
                userRepo.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public List<User> getUsersFromSection(String section) {
        return userRepo.findByUserSection(section);
    }

    public User findByUserRollNumber(String rollNumber) {
        return userRepo.findByUserRollNumber(rollNumber);
    }

    public boolean editUser(String userId, User user) {
        try {
            User existingUser = userRepo.findById(userId).orElse(null);
            if (existingUser != null) {
                existingUser.setUserEmail(user.getUserEmail());
                existingUser.setUserName(user.getUserName());
                existingUser.setUserPassword(userRepo.encryptPassword(user.getUserPassword()));
                existingUser.setUserRollNumber(user.getUserRollNumber());
                existingUser.setUserSection(user.getUserSection());
                existingUser.setUserTeamName(user.getUserTeamName());
                existingUser.setUserIsAdmin(user.getUserIsAdmin());
                userRepo.save(existingUser);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteUser(String userId) {
        try {
            userRepo.deleteById(userId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean changeUserSecret(String userEmail) {
        try {
            User user = userRepo.findByUserEmail(userEmail);
            if (user != null) {
                user.setUserSecret(generateRandomString(16));
                userRepo.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private String generateRandomString(int length) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[length];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}