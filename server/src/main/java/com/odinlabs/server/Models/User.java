package com.odinlabs.server.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

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

}
