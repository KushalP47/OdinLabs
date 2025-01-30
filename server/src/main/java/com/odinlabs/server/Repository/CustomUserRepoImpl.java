package com.odinlabs.server.Repository;

import com.odinlabs.server.Models.User;
import com.odinlabs.server.Service.PasswordService;

import java.util.List;

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

    public boolean emailExists(String email) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userEmail").is(email));
        return mongoTemplate.exists(query, User.class);
    }

    public boolean rollNumberExists(String rollNumber) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userRollNumber").is(rollNumber));
        return mongoTemplate.exists(query, User.class);
    }

    @Override
    public User findByUserRollNumber(String userRollNumber) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userRollNumber").is(userRollNumber));
        return mongoTemplate.findOne(query, User.class);
    }

    @Override
    public List<User> findByUserSection(String userSection) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userSection").is(userSection));
        return mongoTemplate.find(query, User.class);
    }
}