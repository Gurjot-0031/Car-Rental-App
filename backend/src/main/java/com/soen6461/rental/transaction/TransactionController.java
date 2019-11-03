package com.soen6461.rental.transaction;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/api/transaction")
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/api/transaction/{pkid}")
    public Transaction getTransaction(@PathVariable Integer pkid) {
        return transactionService.getTransaction(pkid);
    }

    @PostMapping("/api/transaction")
    public void createTransaction(@RequestBody Transaction transactionDB) {
        transactionService.createTransaction(transactionDB);
    }

    @PutMapping("/api/transaction//return")
    public void returnTransaction(@RequestBody Transaction transaction) {
        transactionService.returnTransaction(transaction.pkid);
    }

    @PutMapping("/api/transaction/cancel")
    public void cancelTransaction(@RequestBody Transaction transaction) {
        transactionService.cancelReservation(transaction.pkid);
    }
}
