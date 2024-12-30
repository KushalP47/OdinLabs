package com.odinlabs.server.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.odinlabs.server.Models.User;
 
public interface UserRepo extends MongoRepository<User, Integer> {
    
}