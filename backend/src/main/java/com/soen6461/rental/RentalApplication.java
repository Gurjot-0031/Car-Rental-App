package com.soen6461.rental;

import com.soen6461.rental.data.VehicleRepository;
import com.soen6461.rental.model.Vehicle;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class RentalApplication implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(RentalApplication.class, args);
	}

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/client/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Bean
    public CommandLineRunner demo(VehicleRepository repository) {
	    return (args) -> {
	        for (Vehicle vehicle: repository.findAll()) {
                System.out.println(vehicle.toString());
            }
        };
    }

}
