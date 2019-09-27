package com.soen6461.rental.user;

import com.google.common.collect.ImmutableMap;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.List;

@Component
public class UserService {

    private final DataSource dataSource;

    public UserService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public LogInResponse logIn(LogInRequest logInRequest) {
        //language=SQL
        String sql = "SELECT * \n" +
            "FROM user\n" +
            "WHERE   username = :username AND\n" +
            "        password = :password\n";

        List<User> users = new NamedParameterJdbcTemplate(dataSource)
            .query(
                sql,
                ImmutableMap.of(
                    "username", logInRequest.username,
                    "password", logInRequest.password
                ),
                (rs, rowNum) -> {
                    User user = new User();
                    user.username = rs.getString("username");
                    user.password = rs.getString("password");
                    user.role = rs.getString("role");
                    return user;
                }
            );

        LogInResponse logInResponse = new LogInResponse();
        if (users.size() != 1) {
            logInResponse.isSuccess = false;
        } else {
            logInResponse.isSuccess = true;
            logInResponse.username = users.get(0).username;
            logInResponse.role = users.get(0).role;
        }
        return logInResponse;
    }
}
