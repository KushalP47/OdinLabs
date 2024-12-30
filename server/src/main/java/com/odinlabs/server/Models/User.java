package com.odinlabs.server.Models;

// Importing required classes
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
// Annotations
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")
 
// Class
public class User 
{
    @Id
    private String _id;
 
    // Attributes
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

    @Field("createdAt")
    private Date createdAt;

    @Field("updatedAt")
    private Date updatedAt;
}
