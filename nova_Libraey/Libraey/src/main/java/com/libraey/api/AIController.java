package com.libraey.api;

import static spark.Spark.*;
import java.util.Map;
import java.util.HashMap;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.libraey.api.services.GeminiService;

public class AIController {
    private final Gson gson = new Gson();
    
    public AIController() {
        setupRoutes();
    }
    
    private void setupRoutes() {
        // Analisar sentimento de um texto
        post("/api/ai/sentiment", (req, res) -> {
            try {
                JsonObject requestBody = JsonParser.parseString(req.body()).getAsJsonObject();
                
                if (!requestBody.has("text")) {
                    res.status(400);
                    return gson.toJson(new ApiResponse("O campo 'text' é obrigatório"));
                }
                
                String text = requestBody.get("text").getAsString();
                Map<String, Object> sentiment = GeminiService.analyzeSentiment(text);
                
                // Garantir que temos emotionalState para manter compatibilidade com o frontend
                if (sentiment.containsKey("sentiment") && !sentiment.containsKey("emotionalState")) {
                    sentiment.put("emotionalState", sentiment.get("sentiment"));
                }
                
                res.type("application/json");
                return gson.toJson(sentiment);
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ApiResponse("Erro ao analisar sentimento: " + e.getMessage()));
            }
        });
        
        // Gerar resumo de livro
        post("/api/ai/book-summary", (req, res) -> {
            try {
                JsonObject requestBody = JsonParser.parseString(req.body()).getAsJsonObject();
                
                if (!requestBody.has("title") || !requestBody.has("content")) {
                    res.status(400);
                    return gson.toJson(new ApiResponse("Os campos 'title' e 'content' são obrigatórios"));
                }
                
                String title = requestBody.get("title").getAsString();
                String content = requestBody.get("content").getAsString();
                
                String summary = GeminiService.generateBookSummary(title, content);
                
                Map<String, String> response = new HashMap<>();
                response.put("summary", summary);
                
                res.type("application/json");
                return gson.toJson(response);
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ApiResponse("Erro ao gerar resumo: " + e.getMessage()));
            }
        });
        
        // Gerar dicas de leitura baseadas no estado emocional
        post("/api/ai/reading-tips", (req, res) -> {
            try {
                JsonObject requestBody = JsonParser.parseString(req.body()).getAsJsonObject();
                
                if (!requestBody.has("emotionalState")) {
                    res.status(400);
                    return gson.toJson(new ApiResponse("O campo 'emotionalState' é obrigatório"));
                }
                
                String emotionalState = requestBody.get("emotionalState").getAsString();
                String tips = GeminiService.generateReadingTips(emotionalState);
                
                Map<String, String> response = new HashMap<>();
                response.put("tips", tips);
                
                res.type("application/json");
                return gson.toJson(response);
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ApiResponse("Erro ao gerar dicas: " + e.getMessage()));
            }
        });
        
        // Endpoint genérico para consultas à IA
        post("/api/ai/chat", (req, res) -> {
            try {
                JsonObject requestBody = JsonParser.parseString(req.body()).getAsJsonObject();
                
                if (!requestBody.has("prompt")) {
                    res.status(400);
                    return gson.toJson(new ApiResponse("O campo 'prompt' é obrigatório"));
                }
                
                String prompt = requestBody.get("prompt").getAsString();
                String response = GeminiService.generateResponse(prompt);
                
                Map<String, String> result = new HashMap<>();
                result.put("response", response);
                
                res.type("application/json");
                return gson.toJson(result);
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ApiResponse("Erro ao processar consulta: " + e.getMessage()));
            }
        });
    }
} 