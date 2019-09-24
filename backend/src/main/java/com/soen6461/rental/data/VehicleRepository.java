package com.soen6461.rental.data;

import com.soen6461.rental.model.Vehicle;
import org.springframework.data.repository.CrudRepository;

public interface VehicleRepository extends CrudRepository<Vehicle, Integer> {
}
