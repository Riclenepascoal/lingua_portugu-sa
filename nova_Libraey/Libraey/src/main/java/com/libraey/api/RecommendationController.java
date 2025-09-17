package com.libraey.api;

import static spark.Spark.*;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.gson.Gson;
import com.libraey.api.models.BookRecommendation;

public class RecommendationController {
    private final Map<String, List<BookRecommendation>> recommendations = new HashMap<>();
    private final Gson gson = new Gson();
    
    public RecommendationController() {
        // Initialize with sample data from script.js
        recommendations.put("depression", Arrays.asList(
            new BookRecommendation(
                "O Poder do Agora",
                "Eckhart Tolle",
                "Um guia para a iluminação espiritual e superação da depressão através da consciência presente."
            ),
            new BookRecommendation(
                "Ansiedade: Como Enfrentar o Mal do Século",
                "Augusto Cury",
                "Estratégias para superar a ansiedade e encontrar paz interior."
            )
        ));
        
        recommendations.put("anxiety", Arrays.asList(
            new BookRecommendation(
                "Mente Zen, Mente de Principiante",
                "Shunryu Suzuki",
                "Práticas de meditação para acalmar a mente ansiosa."
            ),
            new BookRecommendation(
                "O Livro da Ansiedade",
                "Augusto Cury",
                "Técnicas para controlar a ansiedade e viver com mais tranquilidade."
            )
        ));
        
        recommendations.put("stress", Arrays.asList(
            new BookRecommendation(
                "A Arte de Não Amargar a Vida",
                "Rafael Santandreu",
                "Como desenvolver uma mentalidade forte e resistente ao estresse."
            ),
            new BookRecommendation(
                "Seja Foda!",
                "Caio Carneiro",
                "Um guia prático para superar obstáculos e reduzir o estresse."
            )
        ));
        
        recommendations.put("positive", Arrays.asList(
            new BookRecommendation(
                "O Segredo",
                "Rhonda Byrne",
                "Como manter e amplificar pensamentos positivos para atrair mais felicidade."
            ),
            new BookRecommendation(
                "Felicidade Genuína",
                "Martin Seligman",
                "A ciência da psicologia positiva e do bem-estar."
            )
        ));
        
        recommendations.put("fatigue", Arrays.asList(
            new BookRecommendation(
                "Por Que Dormimos",
                "Matthew Walker",
                "A importância do sono para a energia e saúde mental."
            ),
            new BookRecommendation(
                "Energia Sem Limites",
                "Tony Robbins",
                "Estratégias para aumentar sua energia e vitalidade."
            )
        ));
        
        recommendations.put("confusion", Arrays.asList(
            new BookRecommendation(
                "Rápido e Devagar",
                "Daniel Kahneman",
                "Como nossa mente toma decisões e como pensar com mais clareza."
            ),
            new BookRecommendation(
                "Foco",
                "Daniel Goleman",
                "Como desenvolver atenção e clareza mental."
            )
        ));
        
        setupRoutes();
    }
    
    private void setupRoutes() {
        // Get all emotional states
        get("/api/recommendations", (req, res) -> {
            return gson.toJson(recommendations.keySet());
        });
        
        // Get recommendations for a specific emotional state
        get("/api/recommendations/:state", (req, res) -> {
            String state = req.params("state").toLowerCase();
            
            if (recommendations.containsKey(state)) {
                return gson.toJson(recommendations.get(state));
            } else {
                res.status(404);
                return gson.toJson(new ApiResponse("Emotional state not found"));
            }
        });
        
        // Add a recommendation to an emotional state
        post("/api/recommendations/:state", (req, res) -> {
            String state = req.params("state").toLowerCase();
            BookRecommendation recommendation = gson.fromJson(req.body(), BookRecommendation.class);
            
            if (!recommendations.containsKey(state)) {
                recommendations.put(state, new ArrayList<>());
            }
            
            recommendations.get(state).add(recommendation);
            res.status(201);
            return gson.toJson(new ApiResponse("Recommendation added successfully"));
        });
        
        // Add a new emotional state with recommendations
        post("/api/recommendations", (req, res) -> {
            Map<String, List<BookRecommendation>> newRecommendations = 
                gson.fromJson(req.body(), Map.class);
                
            for (Map.Entry<String, List<BookRecommendation>> entry : newRecommendations.entrySet()) {
                String state = entry.getKey().toLowerCase();
                if (!recommendations.containsKey(state)) {
                    recommendations.put(state, new ArrayList<>());
                }
                recommendations.get(state).addAll(entry.getValue());
            }
            
            res.status(201);
            return gson.toJson(new ApiResponse("Recommendations added successfully"));
        });
        
        // Delete a recommendation from an emotional state
        delete("/api/recommendations/:state/:index", (req, res) -> {
            String state = req.params("state").toLowerCase();
            int index = Integer.parseInt(req.params("index"));
            
            if (!recommendations.containsKey(state)) {
                res.status(404);
                return gson.toJson(new ApiResponse("Emotional state not found"));
            }
            
            List<BookRecommendation> stateRecommendations = recommendations.get(state);
            
            if (index < 0 || index >= stateRecommendations.size()) {
                res.status(404);
                return gson.toJson(new ApiResponse("Recommendation index out of bounds"));
            }
            
            stateRecommendations.remove(index);
            return gson.toJson(new ApiResponse("Recommendation deleted successfully"));
        });
    }
} 