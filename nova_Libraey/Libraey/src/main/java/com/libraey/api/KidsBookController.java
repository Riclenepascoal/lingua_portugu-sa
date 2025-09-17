package com.libraey.api;

import static spark.Spark.*;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.libraey.api.models.KidsBook;
import com.libraey.api.models.KidsBook.Quiz;
import com.libraey.api.services.GeminiService;

public class KidsBookController {
    private final Map<Integer, KidsBook> kidsBooks = new HashMap<>();
    private final Gson gson = new Gson();
    
    public KidsBookController() {
        // Initialize with sample data from script.js
        kidsBooks.put(1, new KidsBook(
            1,
            "A Aventura do Alfabeto",
            "Iniciante",
            "Era uma vez uma menina chamada Ana que adorava aprender. Um dia, ela encontrou um livro magico que a levou numa aventura pelo alfabeto. Ela conheceu a letra \"A\" que sempre ficava em primeiro lugar na fila, e o \"B\" que zumbia como uma abelha...",
            Arrays.asList(
                new Quiz(
                    "Que letra vem depois do \"A\" no alfabeto?",
                    Arrays.asList("B", "C", "D", "Z"),
                    "B"
                ),
                new Quiz(
                    "Quantas letras tem o alfabeto portugues?",
                    Arrays.asList("20", "24", "26", "30"),
                    "26"
                )
            )
        ));
        
        kidsBooks.put(2, new KidsBook(
            2,
            "Os Ninjas dos Numeros",
            "Intermediario",
            "Na vila escondida de Matematica, os Ninjas dos Numeros treinavam todos os dias para dominar as artes da adicao, subtracao, multiplicacao e divisao...",
            Arrays.asList(
                new Quiz(
                    "Quanto e 5 + 3?",
                    Arrays.asList("7", "8", "9", "10"),
                    "8"
                ),
                new Quiz(
                    "Quantos lados tem um triangulo?",
                    Arrays.asList("2", "3", "4", "5"),
                    "3"
                )
            )
        ));
        
        kidsBooks.put(3, new KidsBook(
            3,
            "Exploradores da Ciencia",
            "Avancado",
            "O laboratorio do Professor Atomo estava cheio de tubos de ensaio borbulhantes e maquinas zunindo. Seus alunos se reuniram enquanto ele se preparava para mostrar-lhes um experimento incrivel...",
            Arrays.asList(
                new Quiz(
                    "O que as plantas precisam para crescer?",
                    Arrays.asList("Apenas agua", "Apenas luz solar", "Agua e luz solar", "Apenas terra"),
                    "Agua e luz solar"
                ),
                new Quiz(
                    "Qual animal poe ovos?",
                    Arrays.asList("Cachorro", "Gato", "Passaro", "Elefante"),
                    "Passaro"
                )
            )
        ));
        
        setupRoutes();
    }
    
    private void setupRoutes() {
        // Get all kids books
        get("/api/kidsbooks", (req, res) -> {
            List<KidsBook> bookList = new ArrayList<>(kidsBooks.values());
            return gson.toJson(bookList);
        });
        
        // Get a specific kids book by id
        get("/api/kidsbooks/:id", (req, res) -> {
            int id = Integer.parseInt(req.params("id"));
            
            if (kidsBooks.containsKey(id)) {
                KidsBook book = kidsBooks.get(id);
                
                // Se o conteúdo for muito curto, gerar um novo conteúdo com a IA
                if (book.getContent().length() < 200) {
                    String dynamicContent = generateStoryContent(book.getTitle(), book.getLevel());
                    book.setContent(dynamicContent);
                    
                    // Se não tiver quiz ou for muito curto, gerar perguntas com a IA
                    if (book.getQuiz() == null || book.getQuiz().size() < 2) {
                        List<Quiz> generatedQuiz = generateQuizQuestions(book.getTitle(), book.getLevel(), dynamicContent);
                        book.setQuiz(generatedQuiz);
                    }
                }
                
                return gson.toJson(book);
            } else {
                res.status(404);
                return gson.toJson(new ApiResponse("Kids book not found"));
            }
        });
        
        // Gerar novo conteúdo para um livro existente
        post("/api/kidsbooks/:id/regenerate", (req, res) -> {
            int id = Integer.parseInt(req.params("id"));
            
            if (!kidsBooks.containsKey(id)) {
                res.status(404);
                return gson.toJson(new ApiResponse("Kids book not found"));
            }
            
            KidsBook book = kidsBooks.get(id);
            
            // Gerar novo conteúdo baseado no título e nível
            String newContent = generateStoryContent(book.getTitle(), book.getLevel());
            book.setContent(newContent);
            
            // Gerar novas perguntas baseadas no novo conteúdo
            List<Quiz> newQuiz = generateQuizQuestions(book.getTitle(), book.getLevel(), newContent);
            book.setQuiz(newQuiz);
            
            return gson.toJson(book);
        });
        
        // Add a new kids book
        post("/api/kidsbooks", (req, res) -> {
            KidsBook book = gson.fromJson(req.body(), KidsBook.class);
            
            if (kidsBooks.containsKey(book.getId())) {
                res.status(409);
                return gson.toJson(new ApiResponse("Kids book already exists"));
            }
            
            // Se o conteúdo não for fornecido, gerar com a IA
            if (book.getContent() == null || book.getContent().isEmpty()) {
                String generatedContent = generateStoryContent(book.getTitle(), book.getLevel());
                book.setContent(generatedContent);
            }
            
            // Se o quiz não for fornecido, gerar com a IA
            if (book.getQuiz() == null || book.getQuiz().isEmpty()) {
                List<Quiz> generatedQuiz = generateQuizQuestions(book.getTitle(), book.getLevel(), book.getContent());
                book.setQuiz(generatedQuiz);
            }
            
            kidsBooks.put(book.getId(), book);
            res.status(201);
            return gson.toJson(new ApiResponse("Kids book added successfully"));
        });
        
        // Update a kids book
        put("/api/kidsbooks/:id", (req, res) -> {
            int id = Integer.parseInt(req.params("id"));
            KidsBook book = gson.fromJson(req.body(), KidsBook.class);
            
            if (!kidsBooks.containsKey(id)) {
                res.status(404);
                return gson.toJson(new ApiResponse("Kids book not found"));
            }
            
            book.setId(id);
            kidsBooks.put(id, book);
            return gson.toJson(new ApiResponse("Kids book updated successfully"));
        });
        
        // Delete a kids book
        delete("/api/kidsbooks/:id", (req, res) -> {
            int id = Integer.parseInt(req.params("id"));
            
            if (!kidsBooks.containsKey(id)) {
                res.status(404);
                return gson.toJson(new ApiResponse("Kids book not found"));
            }
            
            kidsBooks.remove(id);
            return gson.toJson(new ApiResponse("Kids book deleted successfully"));
        });
    }
    
    /**
     * Gera conteúdo de história para um livro infantil usando IA
     * 
     * @param title Título do livro
     * @param level Nível de dificuldade (Iniciante, Intermediário, Avançado)
     * @return Conteúdo em formato Markdown
     */
    private String generateStoryContent(String title, String level) {
        String ageRange = "4-6";
        if (level.toLowerCase().contains("intermediario")) {
            ageRange = "7-9";
        } else if (level.toLowerCase().contains("avancado")) {
            ageRange = "10-12";
        }
        
        String prompt = "Crie uma história infantil curta (cerca de 500 palavras) com o título \"" + title + 
                "\" para crianças de " + ageRange + " anos. " +
                "A história deve ser educativa, divertida e adequada para a idade. " +
                "Use apenas português brasileiro simples e claro. " +
                "Estruture o texto usando Markdown com: " +
                "- Títulos (##) para capítulos ou seções " +
                "- Parágrafos curtos e claros " +
                "- Alguns **destaques em negrito** para palavras importantes " +
                "- Uma ou duas frases em *itálico* para ênfase " +
                "- Diálogos formatados corretamente " +
                "- Emoji ocasional para ilustrar conceitos 📚 " +
                "Não inclua cabeçalhos de nível 1 (#), pois o título já será exibido separadamente.";
        
        return GeminiService.generateResponse(prompt);
    }
    
    /**
     * Gera perguntas de quiz baseadas no conteúdo do livro
     * 
     * @param title Título do livro
     * @param level Nível de dificuldade
     * @param content Conteúdo do livro
     * @return Lista de perguntas e respostas
     */
    private List<Quiz> generateQuizQuestions(String title, String level, String content) {
        List<Quiz> quizList = new ArrayList<>();
        
        String prompt = "Com base na história infantil abaixo, crie 3 perguntas de quiz simples, " +
                "adequadas para crianças no nível " + level + ". " +
                "Para cada pergunta, forneça 4 opções de resposta e indique qual é a correta. " +
                "Responda APENAS no formato JSON abaixo, sem texto adicional:\n\n" +
                "{\n  \"perguntas\": [\n    {\n      \"pergunta\": \"Pergunta 1?\",\n      " +
                "\"opcoes\": [\"Opção A\", \"Opção B\", \"Opção C\", \"Opção D\"],\n      " +
                "\"resposta\": \"Opção que é a correta\"\n    },\n    ...\n  ]\n}\n\n" +
                "História: \"" + title + "\"\n\n" + content;
        
        try {
            String response = GeminiService.generateResponse(prompt);
            
            // Tentar extrair o JSON da resposta (pode estar entre ```json e ```)
            if (response.contains("```")) {
                response = response.substring(response.indexOf("```") + 3);
                response = response.substring(response.indexOf("\n") + 1);
                response = response.substring(0, response.lastIndexOf("```"));
            }
            
            // Estrutura esperada: { "perguntas": [ { "pergunta": "...", "opcoes": ["A", "B", "C", "D"], "resposta": "..." }, ... ] }
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
            
            if (jsonResponse.has("perguntas")) {
                jsonResponse.getAsJsonArray("perguntas").forEach(element -> {
                    JsonObject questionObj = element.getAsJsonObject();
                    String question = questionObj.get("pergunta").getAsString();
                    
                    List<String> options = new ArrayList<>();
                    questionObj.getAsJsonArray("opcoes").forEach(opt -> {
                        options.add(opt.getAsString());
                    });
                    
                    String answer = questionObj.get("resposta").getAsString();
                    
                    quizList.add(new Quiz(question, options, answer));
                });
            }
        } catch (Exception e) {
            System.err.println("Erro ao gerar perguntas do quiz: " + e.getMessage());
            // Adicionar pelo menos uma pergunta padrão
            quizList.add(new Quiz(
                "O que você achou da história?",
                Arrays.asList("Muito boa", "Boa", "Regular", "Não gostei"),
                "Muito boa"
            ));
        }
        
        return quizList;
    }
} 