package com.odinlabs.server.Service;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    public String hashPassword(String password) {
        return DigestUtils.sha256Hex(password);
    }

    public boolean matchPassword(String rawPassword, String hashedPassword) {
        return DigestUtils.sha256Hex(rawPassword).equals(hashedPassword);
    }
}