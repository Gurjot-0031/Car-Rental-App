package com.soen6461.rental.client;

import com.google.common.collect.Maps;
import com.soen6461.rental.vehicle.Vehicle;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ClientService {

    private final DataSource dataSource;
    private Map<Integer, Client> clientIdentityMap;

    public ClientService(DataSource dataSource) {
        this.dataSource = dataSource;
        this.clientIdentityMap = generateIdentityMap();
    }

    private Map<Integer, Client> generateIdentityMap() {
        List<Client> result = getJdbcTemplate()
            .query(
                "SELECT * FROM client",
                (rs, rowNum) -> mapResultSetToClient(rs)
            );
        return result
            .stream()
            .collect(
                Collectors.toMap(c -> c.pkid, c -> c)
            );
    }

    List<Client> getAllClients() {
        return new ArrayList<>(clientIdentityMap.values());
    }

    public Client getClient(Integer pkid) {
        if (clientIdentityMap.containsKey(pkid)) {
            return clientIdentityMap.get(pkid);
        }
        Client client = getJdbcTemplate()
            .query(
                "SELECT * FROM client WHERE pkid=" + pkid,
                (rs, rowNum) -> mapResultSetToClient(rs)
            ).get(0);
        clientIdentityMap.put(client.pkid, client);
        return client;
    }

    Client getClientByDriverLicense(String driverLicense) {
        List<Client> clients = clientIdentityMap
            .values()
            .stream()
            .filter(c -> c.driverLicense.equals(driverLicense))
            .collect(Collectors.toList());

        // if client found, return it
        if (clients.size() == 1) {
            return clients.get(0);
        }

        //language = SQL
        String sql = "SELECT * FROM client WHERE driver_license='" + driverLicense + "'";

        Client client = getJdbcTemplate()
            .query(
                sql,
                (rs, rowNum) -> mapResultSetToClient(rs)
            ).get(0);
        clientIdentityMap.put(client.pkid, client);
        return client;
    }

    void createClient(Client client) {
        Map<String, Object> insertMap = Maps.newHashMap();
        insertMap.put("driver_license", client.driverLicense);
        insertMap.put("expiration_date", client.expirationDate);
        insertMap.put("firstname", client.firstName);
        insertMap.put("lastname", client.lastName);
        insertMap.put("phone_number", client.phoneNumber);
        insertMap.put("active", true);
        insertMap.put("version", 1);


        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(dataSource);
        simpleJdbcInsert.setTableName("client");
        simpleJdbcInsert.setGeneratedKeyName("pkid");

        Number pkid = simpleJdbcInsert.executeAndReturnKey(insertMap);
        fetchClientAndAddToIdentityMap(pkid.intValue());
    }

    private void fetchClientAndAddToIdentityMap(Integer pkid) {
        clientIdentityMap.put(pkid, getClient(pkid));
    }

    boolean updateClient(Client client) {
        if (!isModifiable(client)) {
            return false;
        }
        //language = SQL
        String sql = "UPDATE client SET " +
            "firstname='" + client.firstName + "'," +
            "lastname='" + client.lastName + "'," +
            "driver_license='" + client.driverLicense + "'," +
            "expiration_date='" + client.expirationDate + "'," +
            "phone_number='" + client.phoneNumber + "'," +
            "version=" + incrementVersion(client) +
            " WHERE pkid=" + client.pkid;

        getJdbcTemplate().execute(sql);
        clientIdentityMap.put(client.pkid, client);
        return true;
    }

    public void deleteClient(Integer pkid) {
        //language = SQL
        String sql = "UPDATE client SET active=0 WHERE pkid=" + pkid;

        getJdbcTemplate().execute(sql);

        clientIdentityMap.remove(pkid);
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
        client.version = (new BigDecimal(rs.getFloat("version")));
        return client;
    }

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    boolean isAvailable(Integer pkid) {
        return hasDecimal(clientIdentityMap.get(pkid).version);
    }

    private boolean hasDecimal(BigDecimal version) {
        return version.remainder(BigDecimal.ONE).compareTo(new BigDecimal("0")) == 0;
    }

    void setStartModify(Client vehicle) {
        Client currentVehicle = clientIdentityMap.get(vehicle.pkid);
        currentVehicle.version = currentVehicle.version.add(new BigDecimal(0.1));
    }

    private Integer incrementVersion(Client vehicle) {
        return clientIdentityMap.get(vehicle.pkid).version.intValue() + 1;
    }

    void setStopModify(Client vehicle) {
        Client currentVehicle = clientIdentityMap.get(vehicle.pkid);
        currentVehicle.version = new BigDecimal(currentVehicle.version.intValue());
    }

    private boolean isModifiable(Client client) {
        Client dbVehicle = getJdbcTemplate()
            .query(
                "SELECT * FROM client WHERE pkid=" + client.pkid,
                (rs, rowNum) -> mapResultSetToClient(rs)
            ).get(0);

        return dbVehicle.version.intValue() == client.version.intValue();
    }

}
