package com.odinlabs.server.Repository;

import com.odinlabs.server.Models.User;

public interface CustomUserRepo {

    User findByUserEmail(String email);    
    String encryptPassword(String password);
    boolean validPassword(String password, String userPassword);
    boolean emailExists(String email);
    boolean rollNumberExists(String rollNumber);

}