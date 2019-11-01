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
}

