package com.soen6461.rental.vehicle;

import com.google.common.collect.ImmutableMap;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Component
public class VehicleService {

    private final DataSource dataSource;

    public VehicleService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<Vehicle> getAllVehicles() {
        return getJdbcTemplate()
            .query(
                "SELECT * FROM vehicle",
                (rs, rowNum) -> mapResultSetToVehicle(rs)
            );
    }


    public void createVehicle(Vehicle vehicle) {
        //language=SQL
        String sql = "INSERT INTO Vehicle (type, make, model, color, license, year) \n" +
            "VALUES (:type, :make, :model, :color, :license, :year);";

        new NamedParameterJdbcTemplate(dataSource)
            .query(
                sql,
                (SqlParameterSource) ImmutableMap.builder()
                    .put("type", vehicle.getType())
                    .put("make", vehicle.getMake())
                    .put("model", vehicle.getModel())
                    .put("color", vehicle.getColor())
                    .put("license", vehicle.getLicense())
                    .put("year", vehicle.getYear())
                    .build(),
                (rs, rowNum) -> mapResultSetToVehicle(rs)
            );
    }


    private Vehicle mapResultSetToVehicle(ResultSet rs) throws SQLException {
        Vehicle vehicle = new Vehicle();
        vehicle.setPkid(rs.getInt("pkid"));
        vehicle.setColor(rs.getString("color"));
        vehicle.setLicense(rs.getString("license"));
        vehicle.setMake(rs.getString("make"));
        vehicle.setModel(rs.getString("model"));
        vehicle.setType(rs.getString("type"));
        vehicle.setYear(rs.getInt("year"));
        return vehicle;
    }


    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }


}
