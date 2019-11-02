package com.soen6461.rental.transaction;

import com.google.common.base.Strings;
import com.soen6461.rental.client.ClientService;
import com.soen6461.rental.vehicle.VehicleService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Component
public class TransactionService {

    private final DataSource dataSource;
    private final VehicleService vehicleService;
    private final ClientService clientService;

    public TransactionService(DataSource dataSource,
                              VehicleService vehicleService,
                              ClientService clientService) {
        this.dataSource = dataSource;
        this.vehicleService = vehicleService;
        this.clientService = clientService;
    }

    public List<Transaction> getAllTransactions() {
        List<Transaction> transactions = getJdbcTemplate()
            .query(
                "SELECT * FROM transaction ",
                (rs, rowNum) -> mapResultSetToTransaction(rs)
            );

        //TODO this is pretty gross ...
        for(Transaction t: transactions) {
            t.vehicle = vehicleService.getVehicle(t.vehicle_id);
            t.client = clientService.getClient(t.client_id);
        }
        return transactions;
    }

    public Transaction getTransaction(Integer pkid) {
        Transaction transaction = getJdbcTemplate()
            .query(
                "SELECT * FROM transaction WHERE pkid=" + pkid,
                (rs, rowNum) -> mapResultSetToTransaction(rs)
            ).get(0);

        transaction.vehicle = vehicleService.getVehicle(transaction.vehicle_id);
        transaction.client = clientService.getClient(transaction.client_id);

        return transaction;
    }

    public void createTransaction(Transaction transactionDB) {
        //language = SQL
        String sql = "INSERT INTO client (vehicle_id, client_id, type, timestamp, start_date, due_date, return_date, cancel_date) \n" +
            "VALUES ('" +
            transactionDB.vehicle_id + "', \'" +
            transactionDB.client_id + "', \'" +
            transactionDB.type + "', \'" +
            transactionDB.timestamp + "', \'" +
            transactionDB.startDate + "', \'" +
            transactionDB.dueDate + "', \'" +
            transactionDB.returnDate + "', \'" +
            transactionDB.cancelDate + "');";

        getJdbcTemplate().execute(sql);
    }

    public void returnTransaction(Integer pkid) {
        //language = SQL
        String sql = "UPDATE client SET " +
            "return_date='" + getDateNow() + "'" +
            " WHERE pkid=" + pkid;

        getJdbcTemplate().execute(sql);
    }

    public void cancelReservation(Integer pkid) {
        //language = SQL
        String sql = "UPDATE client SET " +
            "cancel_date='" + getDateNow() + "'" +
            " WHERE pkid=" + pkid;

        getJdbcTemplate().execute(sql);
    }

    private Transaction mapResultSetToTransaction(ResultSet rs) throws SQLException {
        Transaction transaction = new Transaction();
        transaction.pkid = rs.getInt("pkid");
        transaction.vehicle_id = rs.getInt("vehicle_id");
        transaction.client_id = rs.getInt("client_id");
        transaction.type = rs.getString("type");
        transaction.startDate = rs.getString("start_date");
        transaction.dueDate = rs.getString("due_date");
        transaction.returnDate = !Strings.isNullOrEmpty(rs.getString("return_date")) ? rs.getString("return_date") : null;
        transaction.cancelDate = !Strings.isNullOrEmpty(rs.getString("cancel_date")) ? rs.getString("cancel_date") : null;
        transaction.timestamp = rs.getString("timestamp");

        return transaction;
    }

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    private String getDateNow() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date(System.currentTimeMillis());
        return formatter.format(date);
    }
}
