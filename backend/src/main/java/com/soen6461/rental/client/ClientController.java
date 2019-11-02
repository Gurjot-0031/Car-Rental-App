package com.soen6461.rental.client;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/api/client")
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/api/client/{pkid}")
    public Client getClient(@PathVariable Integer pkid) {
        return clientService.getClient(pkid);
    }

    @PostMapping("/api/client")
    public void createClient(@RequestBody Client client) {
        clientService.createClient(client);
    }

    @PutMapping("/api/client")
    public void updateClient(@RequestBody Client client) {
        clientService.updateClient(client);
    }

    @DeleteMapping("/api/client/{pkid}")
    public void deleteClient(@PathVariable Integer pkid) {
        clientService.deleteClient(pkid);
    }

}
