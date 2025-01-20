package com.odinlabs.server.Repository;

import com.odinlabs.server.Models.User;
import com.odinlabs.server.Service.PasswordService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class CustomUserRepoImpl implements CustomUserRepo {


    @Autowired
    private PasswordService passwordService;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public String encryptPassword(String password) {
        return passwordService.hashPassword(password);
    }

    @Override
    public boolean validPassword(String password, String userPassword) {
        return passwordService.matchPassword(password, userPassword);
    }

    @Override
    public User findByUserEmail(String email) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userEmail").is(email));
        return mongoTemplate.findOne(query, User.class);
    }
}