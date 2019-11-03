package com.soen6461.rental.transaction;

import com.soen6461.rental.client.Client;
import com.soen6461.rental.vehicle.Vehicle;

public class Transaction {
    public Integer pkid;
    public Integer vehicleId;
    public Vehicle vehicle;
    public Integer clientId;
    public Client client;
    public String type;
    public String timestamp;
    public String startDate;
    public String dueDate;
    public String returnDate;
    public String cancelDate;
}
