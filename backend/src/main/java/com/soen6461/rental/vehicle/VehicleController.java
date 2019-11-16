package com.soen6461.rental.vehicle;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class VehicleController {

    private VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/api/vehicle")
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/api/vehicle/{pkid}")
    public Vehicle getVehicle(@PathVariable Integer pkid) {
        return vehicleService.getVehicle(pkid);
    }

    @PostMapping("/api/vehicle")
    public void createVehicle(@RequestBody Vehicle vehicle) {
        vehicleService.createVehicle(vehicle);
    }

    @PutMapping("/api/vehicle")
    public void updateVehicle(@RequestBody Vehicle vehicle) {
        vehicleService.updateVehicle(vehicle);
    }

    @DeleteMapping("/api/vehicle/{pkid}")
    public void deleteVehicle(@PathVariable Integer pkid) {
        vehicleService.deleteVehicle(pkid);
    }

    @PostMapping("/api/vehicle/{pkid}/available-for-dates")
    public boolean getAvailableVehicles(@PathVariable Integer pkid, @RequestBody AvailableDates dates) {
        return vehicleService.isVehicleAvailableForDates(pkid, dates);
    }

    @PostMapping("/api/vehicle/available-for-dates")
    public List<Vehicle> getAvailableVehicles(@RequestBody AvailableDates dates) {
        return vehicleService.getVehicleAvailableForDates(dates);
    }

    @GetMapping("/api/vehicle/{pkid}/is-available")
    public boolean isVehicleAvailable(@PathVariable Integer pkid) {
        return vehicleService.isAvailable(pkid);
    }


}

