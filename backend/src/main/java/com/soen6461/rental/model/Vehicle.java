package com.soen6461.rental.model;

import javax.persistence.*;

@Entity
@Table(name="vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int pkid;
    private String type;
    private String make;
    private String model;
    private int year;
    private String color;
    private String license;

    public Vehicle() {}

    public Vehicle(String type,
                   String make,
                   String model,
                   int year,
                   String color,
                   String license) {
        this.type = type;
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
        this.license = license;
    }

    public int getPkid() {
        return pkid;
    }

    public String getType() {
        return type;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public int getYear() {
        return year;
    }

    public String getColor() {
        return color;
    }

    public String getLicense() {
        return license;
    }

    @Override
    public String toString() {
        return String.format(
            "Vehicle[id=%d, type=%s, make=%s, model=%s, year=%d, color=%s, license=%s",
            pkid, type, make, model, year, color, license
        );
    }
}
