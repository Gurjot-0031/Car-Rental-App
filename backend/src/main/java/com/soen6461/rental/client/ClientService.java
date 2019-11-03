package com.soen6461.rental.client;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Component
public class ClientService {

    private final DataSource dataSource;

    public ClientService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<Client> getAllClients() {
        return getJdbcTemplate()
            .query(
                "SELECT * FROM client",
                (rs, rowNum) -> mapResultSetToClient(rs)
            );
    }

    public Client getClient(Integer pkid) {
        return getJdbcTemplate()
            .query(
                "SELECT * FROM client WHERE pkid=" + pkid,
                (rs, rowNum) -> mapResultSetToClient(rs)
            ).get(0);
    }

    public Client getClientByDriverLicense(Integer driverLicense) {
        return getJdbcTemplate()
            .query(
                "SELECT * FROM client WHERE driver_license=" + driverLicense,
                (rs, rowNum) -> mapResultSetToClient(rs)
            ).get(0);
    }

    public void createClient(Client client) {
        //language = SQL
        String sql = "INSERT INTO client (firstname, lastname, driver_license, expiration_date, phone_number) \n" +
            "VALUES ('" +
            client.firstName + "', \'" +
            client.lastName + "', \'" +
            client.driverLicense + "', \'" +
            client.expirationDate + "', \'" +
            client.phoneNumber + "');";

        getJdbcTemplate().execute(sql);
    }

    public void updateClient(Client client) {
        //language = SQL
        String sql = "UPDATE client SET " +
            "firstname='" + client.firstName + "'," +
            "lastname='" + client.lastName + "'," +
            "driver_license='" + client.driverLicense + "'," +
            "expiration_date='" + client.expirationDate + "'," +
            "phone_number='" + client.phoneNumber + "'" +
            " WHERE pkid=" + client.pkid;

        getJdbcTemplate().execute(sql);
    }

    public void deleteClient(Integer pkid) {
        //language = SQL
        String sql = "UPDATE client SET active=0 WHERE pkid=" + pkid;

        getJdbcTemplate().execute(sql);
    }

    private Client mapResultSetToClient(ResultSet rs) throws SQLException {
        Client client = new Client();
        client.pkid = rs.getInt("pkid");
        client.firstName = rs.getString("firstname");
        client.lastName = rs.getString("lastname");
        client.driverLicense = rs.getString("driver_license");
        client.expirationDate = rs.getString("expiration_date");
        client.phoneNumber = rs.getString("phone_number");
        client.active = rs.getInt("active");
        return client;
    }

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

}
