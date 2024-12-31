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
    public User(String userEmail, String userPassword, String userName, String userRollNumber, 
                String userSection, String userTeamName, Boolean userIsAdmin) {
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.userName = userName;
        this.userRollNumber = userRollNumber;
        this.userSection = userSection;
        this.userTeamName = userTeamName;
        this.userIsAdmin = userIsAdmin;
    }

    // Getters
    public String get_id() { return _id; }
    public String getUserEmail() { return userEmail; }
    public String getUserPassword() { return userPassword; }
    public String getUserName() { return userName; }
    public String getUserRollNumber() { return userRollNumber; }
    public String getUserSection() { return userSection; }
    public String getUserTeamName() { return userTeamName; }
    public Boolean getUserIsAdmin() { return userIsAdmin; }

    // Setters
    public void set_id(String _id) { this._id = _id; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setUserPassword(String userPassword) { this.userPassword = userPassword; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setUserRollNumber(String userRollNumber) { this.userRollNumber = userRollNumber; }
    public void setUserSection(String userSection) { this.userSection = userSection; }
    public void setUserTeamName(String userTeamName) { this.userTeamName = userTeamName; }
    public void setUserIsAdmin(Boolean userIsAdmin) { this.userIsAdmin = userIsAdmin; }
}
