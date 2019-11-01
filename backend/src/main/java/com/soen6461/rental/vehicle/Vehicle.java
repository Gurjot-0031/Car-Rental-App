package com.soen6461.rental.vehicle;

public class Vehicle {

    private Integer pkid;
    private String type;
    private String make;
    private String model;
    private Integer year;
    private String color;
    private String license;
    private Integer active;

    public Integer getPkid() {
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

    public Integer getYear() {
        return year;
    }

    public String getColor() {
        return color;
    }

    public String getLicense() {
        return license;
    }

    public Integer getActive() {
        return active;
    }

    public void setPkid(Integer pkid) {
        this.pkid = pkid;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public void setActive(Integer active) { this.active = active;}

    @Override
    public String toString() {
        return String.format(
            "Vehicle[id=%d, type=%s, make=%s, model=%s, year=%d, color=%s, license=%s",
            pkid, type, make, model, year, color, license
        );
    }
}
