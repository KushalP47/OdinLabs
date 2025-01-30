package com.odinlabs.server.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.security.SecureRandom;
import java.util.Base64;

@Document(collection = "user")
public class User {
    @Id
    private String _id;

    @Field("userEmail")
    private String userEmail;

    @Field("userPassword")
    private String userPassword;

    @Field("userName")
    private String userName;

    @Field("userRollNumber")
    private String userRollNumber;

    @Field("userSection")
    private String userSection;

    @Field("userTeamName")
    private String userTeamName;

    @Field("userIsAdmin")
    private Boolean userIsAdmin;

    @Field("userSecret")
    private String userSecret;

    // Constructor
    public User(String userEmail,
            String userName,
            String userPassword,
            String userRollNumber,
            String userSection,
            String userTeamName,
            Boolean userIsAdmin) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userRollNumber = userRollNumber;
        this.userSection = userSection;
        this.userTeamName = userTeamName;
        this.userIsAdmin = userIsAdmin;
        this.userSecret = generateRandomString(16); // Generate a random string for userSecret
    }

    // Getters
    public String getId() {
        return this._id;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public String getUserPassword() {
        return this.userPassword;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getUserRollNumber() {
        return this.userRollNumber;
    }

    public String getUserSection() {
        return this.userSection;
    }

    public String getUserTeamName() {
        return this.userTeamName;
    }

    public Boolean getUserIsAdmin() {
        return this.userIsAdmin;
    }

    public String getUserSecret() {
        return this.userSecret;
    }

    // Setters
    public void setId(String _id) {
        this._id = _id;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserRollNumber(String userRollNumber) {
        this.userRollNumber = userRollNumber;
    }

    public void setUserSection(String userSection) {
        this.userSection = userSection;
    }

    public void setUserTeamName(String userTeamName) {
        this.userTeamName = userTeamName;
    }

    public void setUserIsAdmin(Boolean userIsAdmin) {
        this.userIsAdmin = userIsAdmin;
    }

    public void setUserSecret(String userSecret) {
        this.userSecret = userSecret;
    }

    // Method to generate a random string
    private String generateRandomString(int length) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[length];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

}
