package com.soen6461.rental.vehicle;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
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
                "SELECT * FROM Vehicle",
                (rs, rowNum) -> {
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
            );
    }

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }


}
