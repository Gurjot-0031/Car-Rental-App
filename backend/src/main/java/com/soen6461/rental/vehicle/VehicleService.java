package com.soen6461.rental.vehicle;

import com.google.common.collect.Maps;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class VehicleService {

    private final DataSource dataSource;
    private Map<Integer, Vehicle> vehicleIdentityMap;

    public VehicleService(DataSource dataSource) {
        this.dataSource = dataSource;
        this.vehicleIdentityMap = generateIdentityMap();
    }

    private Map<Integer, Vehicle> generateIdentityMap() {
        List<Vehicle> result = getJdbcTemplate()
            .query(
                "SELECT * FROM vehicle",
                (rs, rowNum) -> mapResultSetToVehicle(rs)
            );
        return result
            .stream()
            .collect(
                Collectors.toMap(Vehicle::getPkid, v -> v)
            );
    }

    List<Vehicle> getAllVehicles() {
        return new ArrayList<>(vehicleIdentityMap.values());
    }


    public Vehicle getVehicle(Integer pkid) {
        if (vehicleIdentityMap.containsKey(pkid)) {
            return vehicleIdentityMap.get(pkid);
        }
        Vehicle vehicle = getJdbcTemplate()
            .query(
                "SELECT * FROM vehicle WHERE pkid=" + pkid,
                (rs, rowNum) -> mapResultSetToVehicle(rs)
            ).get(0);
        vehicleIdentityMap.put(vehicle.getPkid(), vehicle);
        return vehicle;
    }

    void createVehicle(Vehicle vehicle) {
        Map<String, Object> insertMap = Maps.newHashMap();
        insertMap.put("type", vehicle.getType());
        insertMap.put("make", vehicle.getMake());
        insertMap.put("model", vehicle.getModel());
        insertMap.put("color", vehicle.getColor());
        insertMap.put("license", vehicle.getLicense());
        insertMap.put("year", vehicle.getYear());
        insertMap.put("version", 1);
        insertMap.put("active", 1);

        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(dataSource);
        simpleJdbcInsert.setTableName("vehicle");
        simpleJdbcInsert.setGeneratedKeyName("pkid");

        Number pkid = simpleJdbcInsert.executeAndReturnKey(insertMap);
        fetchVehicleAndAddToIdentityMap(pkid.intValue());
    }

    boolean updateVehicle(Vehicle vehicle) {
        if (!isModifiable(vehicle)) {
            return false;
        }
        //language = SQL
        String sql = "UPDATE vehicle SET " +
            "type='" + vehicle.getType() + "'," +
            "make='" + vehicle.getMake() + "'," +
            "model='" + vehicle.getModel() + "'," +
            "color='" + vehicle.getColor() + "'," +
            "license='" + vehicle.getLicense() + "'," +
            "year='" + vehicle.getYear() + "'," +
            "version=" + incrementVersion(vehicle) +
            " WHERE pkid=" + vehicle.getPkid();

        getJdbcTemplate().execute(sql);
        vehicleIdentityMap.put(vehicle.getPkid(), vehicle);
        return true;
    }

    void deleteVehicle(Integer pkid) {
        //language = SQL
        String sql = "UPDATE vehicle SET active=0 WHERE pkid=" + pkid;

        getJdbcTemplate().execute(sql);

        vehicleIdentityMap.remove(pkid);
    }

    private void fetchVehicleAndAddToIdentityMap(Integer pkid) {
        vehicleIdentityMap.put(pkid, getVehicle(pkid));
    }

    boolean isVehicleAvailableForDates(Integer pkid, AvailableDates dates) {
        //language = SQL
        String sql = "SELECT count(*) as restrictions FROM transaction " +
            "WHERE vehicle_id =" + pkid + " AND " +
            "(start_date <= '" + dates.end + "\' AND " +
            "due_date >= '" + dates.start + "\')";

        return getJdbcTemplate()
            .query(
                sql,
                (rs, rowNum) -> rs.getInt("restrictions")
            ).get(0) == 0;
    }

    public List<Vehicle> getVehicleAvailableForDates(AvailableDates dates) {
        //language = SQL
        String sql = "SELECT * " +
            "FROM vehicle " +
            "WHERE vehicle.pkid NOT IN ( " +
            "SELECT vehicle_id FROM transaction " +
            "join vehicle on vehicle.pkid = transaction.vehicle_id " +
            "WHERE start_date < '" + dates.end + "' AND " +
            "due_date > '" + dates.start + "' " +
            "AND return_date is null)";

        return getJdbcTemplate()
            .query(
                sql,
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
        vehicle.setActive(rs.getInt("active"));
        vehicle.setVersion(new BigDecimal(rs.getFloat("version")));
        return vehicle;
    }

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    boolean isAvailable(Integer pkid) {
        return hasDecimal(vehicleIdentityMap.get(pkid).getVersion());
    }

    private boolean hasDecimal(BigDecimal version) {
        return version.remainder(BigDecimal.ONE).compareTo(new BigDecimal("0")) == 0;
    }

    void setStartModify(Vehicle vehicle) {
        Vehicle currentVehicle = vehicleIdentityMap.get(vehicle.getPkid());
        currentVehicle.setVersion(currentVehicle.getVersion().add(new BigDecimal(0.1)));
    }

    private Integer incrementVersion(Vehicle vehicle) {
        return vehicleIdentityMap.get(vehicle.getPkid())
            .getVersion()
            .intValue() + 1;
    }

    void setStopModify(Vehicle vehicle) {
        Vehicle currentVehicle = vehicleIdentityMap.get(vehicle.getPkid());
        currentVehicle.setVersion(currentVehicle.getVersion()
            .setScale(0, RoundingMode.DOWN));
    }

    private boolean isModifiable(Vehicle vehicle) {
        Vehicle dbVehicle = getJdbcTemplate()
            .query(
                "SELECT * FROM vehicle WHERE pkid=" + vehicle.getPkid(),
                (rs, rowNum) -> mapResultSetToVehicle(rs)
            ).get(0);

        return dbVehicle.getVersion().intValue() == vehicle.getVersion().intValue();
    }
}
