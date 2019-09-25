package com.soen6461.rental.vehicle;

import com.google.common.collect.Lists;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping("/api/vehicles")
    public List<Vehicle> getAllVehicles() {
        return Lists.newArrayList(vehicleRepository.findAll());
    }
}

