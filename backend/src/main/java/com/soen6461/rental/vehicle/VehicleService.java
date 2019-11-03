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

    List<Vehicle> getAllVehicles() {
        return getJdbcTemplate()
            .query(
                "SELECT * FROM vehicle",
                (rs, rowNum) -> mapResultSetToVehicle(rs)
            );
    }


    public Vehicle getVehicle(Integer pkid) {
        return getJdbcTemplate()
            .query(
                "SELECT * FROM vehicle WHERE pkid=" + pkid,
                (rs, rowNum) -> mapResultSetToVehicle(rs)
            ).get(0);
    }

    void createVehicle(Vehicle vehicle) {
        //language = SQL
        String sql = "INSERT INTO vehicle (type, make, model, color, license, year) \n" +
            "VALUES ('" +
            vehicle.getType() + "', \'" +
            vehicle.getMake() + "', \'" +
            vehicle.getModel() + "', \'" +
            vehicle.getColor() + "', \'" +
            vehicle.getLicense() + "'," +
            vehicle.getYear() + ");";

        getJdbcTemplate().execute(sql);
    }

    void updateVehicle(Vehicle vehicle) {
        //language = SQL
        String sql = "UPDATE vehicle SET " +
            "type='"+vehicle.getType() + "'," +
            "make='"+vehicle.getMake() + "'," +
            "model='"+vehicle.getModel() + "'," +
            "color='"+vehicle.getColor() + "'," +
            "license='"+vehicle.getLicense() + "'," +
            "year="+vehicle.getYear() +
            " WHERE pkid="+vehicle.getPkid();

        getJdbcTemplate().execute(sql);
    }

    void deleteVehicle(Integer pkid) {
        //language = SQL
        String sql = "UPDATE vehicle SET active=0 WHERE pkid="+pkid;

        getJdbcTemplate().execute(sql);
    }

    public boolean isVehicleAvailableForDates(Integer pkid, AvailabilityDates dates) {
        //language = SQL
        String sql = "SELECT count(*) as restrictions FROM transaction" +
            "WHERE vehicle_id =" + pkid + " AND " +
            "(start_date < '" + dates.dueDate + "\' AND " +
            "due_date > '" + dates.startDate + "\')";

        return getJdbcTemplate()
            .query(
                sql,
                (rs, rowNum) -> rs.getBoolean("restrictions")
            ).get(0);
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
        vehicle.setActive(rs.getInt("active"));
        return vehicle;
    }


    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

}
