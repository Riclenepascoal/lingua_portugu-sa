package com.libraey.api;

import static spark.Spark.*;
import com.google.gson.Gson;

public class Application {
    public static void main(String[] args) {
        // Configure Spark
        port(4567);
        
        // Enable CORS
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Content-Length, Accept, Origin");
            response.type("application/json");
        });

        // Initialize controllers
        new BookController();
        new KidsBookController();
        new RecommendationController();
        new AIController();

        // Default route
        get("/", (req, res) -> {
            return new Gson().toJson(new ApiResponse("Libraey API is running"));
        });

        System.out.println("Libraey API started on port 4567");
    }
}

class ApiResponse {
    private String message;
    
    public ApiResponse(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }
} 