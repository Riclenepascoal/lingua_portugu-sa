package com.libraey.api;

import static spark.Spark.*;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.libraey.api.models.Book;

public class BookController {
    private final Map<String, String> books = new HashMap<>();
    private final Gson gson = new Gson();
    
    public BookController() {
        // Initialize with sample data from script.js
        books.put("dom casmurro", "Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu...");
        books.put("o cortiço", "João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro que enriqueceu entre as quatro paredes de uma suja e obscura taverna nos refolhos do bairro do Botafogo...");
        books.put("iracema", "Verdes mares bravios de minha terra natal, ó auras do oceano, onde é que vos perdestes? Que é feito de vós, ondas sonoras, que embaláveis minha infância?...");
        books.put("o guarani", "No ano da graça de 1604, o fidalgo português D. Antônio de Mariz havia já de si feito um homem notável...");
        
        setupRoutes();
    }
    
    private void setupRoutes() {
        // Get all books
        get("/api/books", (req, res) -> {
            List<Book> bookList = new ArrayList<>();
            books.forEach((title, content) -> 
                bookList.add(new Book(title.replaceAll("\\s", "-"), title, content))
            );
            return gson.toJson(bookList);
        });
        
        // Get a specific book by id
        get("/api/books/:id", (req, res) -> {
            String id = req.params("id");
            String title = id.replaceAll("-", " ");
            
            if (books.containsKey(title)) {
                return gson.toJson(new Book(id, title, books.get(title)));
            } else {
                res.status(404);
                return gson.toJson(new ApiResponse("Book not found"));
            }
        });
        
        // Add a new book
        post("/api/books", (req, res) -> {
            Book book = gson.fromJson(req.body(), Book.class);
            String title = book.getTitle().toLowerCase();
            
            if (books.containsKey(title)) {
                res.status(409);
                return gson.toJson(new ApiResponse("Book already exists"));
            }
            
            books.put(title, book.getContent());
            res.status(201);
            return gson.toJson(new ApiResponse("Book added successfully"));
        });
        
        // Update a book
        put("/api/books/:id", (req, res) -> {
            String id = req.params("id");
            String title = id.replaceAll("-", " ");
            Book book = gson.fromJson(req.body(), Book.class);
            
            if (!books.containsKey(title)) {
                res.status(404);
                return gson.toJson(new ApiResponse("Book not found"));
            }
            
            books.put(title, book.getContent());
            return gson.toJson(new ApiResponse("Book updated successfully"));
        });
        
        // Delete a book
        delete("/api/books/:id", (req, res) -> {
            String id = req.params("id");
            String title = id.replaceAll("-", " ");
            
            if (!books.containsKey(title)) {
                res.status(404);
                return gson.toJson(new ApiResponse("Book not found"));
            }
            
            books.remove(title);
            return gson.toJson(new ApiResponse("Book deleted successfully"));
        });
    }
} 