package com.libraey.api.services;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Random;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

/**
 * Serviço que simula a integração com o Google Gemini AI.
 * Esta implementação utiliza respostas predefinidas para simular o comportamento da IA.
 */
public class GeminiService {
    private static final Random random = new Random();
    
    /**
     * Analisa o sentimento de um texto e retorna o estado emocional detectado.
     */
    public static Map<String, Object> analyzeSentiment(String text) {
        Map<String, Object> result = new HashMap<>();
        
        text = text.toLowerCase();
        
        if (text.contains("triste") || text.contains("deprimid") || text.contains("infeliz") || 
            text.contains("desanimad") || text.contains("mal") || text.contains("chora")) {
            result.put("sentiment", "depression");
            result.put("confidence", 0.85);
        } 
        else if (text.contains("ansios") || text.contains("preocupad") || text.contains("nerv") || 
                 text.contains("tensão") || text.contains("inquiet")) {
            result.put("sentiment", "anxiety");
            result.put("confidence", 0.82);
        } 
        else if (text.contains("estress") || text.contains("sobrecarregad") || text.contains("pressão") || 
                 text.contains("cobranças") || text.contains("prazo")) {
            result.put("sentiment", "stress");
            result.put("confidence", 0.88);
        } 
        else if (text.contains("cansad") || text.contains("exaust") || text.contains("sem energia") || 
                 text.contains("sem disposição") || text.contains("dormir")) {
            result.put("sentiment", "fatigue");
            result.put("confidence", 0.79);
        } 
        else if (text.contains("confus") || text.contains("perdid") || text.contains("dúvida") || 
                 text.contains("indecis") || text.contains("não sei")) {
            result.put("sentiment", "confusion");
            result.put("confidence", 0.75);
        } 
        else if (text.contains("feliz") || text.contains("content") || text.contains("alegre") || 
                 text.contains("bem") || text.contains("ótim") || text.contains("maravilhos")) {
            result.put("sentiment", "positive");
            result.put("confidence", 0.90);
        } 
        else {
            // Sentimento neutro ou não identificado
            result.put("sentiment", "neutral");
            result.put("confidence", 0.60);
        }
        
        return result;
    }
    
    /**
     * Gera um resumo para um livro.
     */
    public static String generateBookSummary(String title, String content) {
        // Resumos simulados para demonstração
        if (content.length() > 500) {
            content = content.substring(0, 500) + "...";
        }
        
        return "Este livro intitulado \"" + title + "\" é uma obra fascinante que explora temas profundos " +
               "da condição humana. A narrativa começa com " + content.substring(0, 100) + "... " +
               "e se desenvolve explorando questões de identidade, relacionamentos e a busca pelo significado da vida.";
    }
    
    /**
     * Gera dicas de leitura baseadas no estado emocional.
     */
    public static String generateReadingTips(String emotionalState) {
        switch (emotionalState.toLowerCase()) {
            case "depression":
                return "**Fuja da realidade:** Mergulhe em ficção para desligar dos seus problemas e relaxar a mente.\n\n" +
                       "**Busque inspiração:** Livros de autoajuda baseados em evidências científicas e histórias reais de superação podem oferecer novas perspectivas.\n\n" +
                       "**Doses de humor:** Leituras engraçadas liberam endorfinas e podem ajudar a aliviar sentimentos de tristeza temporariamente.";
                       
            case "anxiety":
                return "**Leituras mindfulness:** Livros sobre meditação e atenção plena podem ensinar técnicas práticas para acalmar a mente ansiosa.\n\n" +
                       "**Ficção leve e previsível:** Histórias com estruturas familiares e finais previsíveis proporcionam conforto sem adicionar tensão.\n\n" +
                       "**Leia em sessões curtas:** Se a concentração estiver difícil, tente períodos breves de 10-15 minutos de leitura como exercício de foco.";
                       
            case "stress":
                return "**Relaxe com leituras leves:** Opte por gêneros como comédia ou romance para diminuir a tensão e trazer alegria.\n\n" +
                       "**Concentre-se no presente:** A leitura exige foco, desviando sua atenção das preocupações e ancorando você no momento.\n\n" +
                       "**Escape para outros mundos:** Ficção científica e fantasia oferecem uma fuga completa da realidade estressante.";
                       
            case "fatigue":
                return "**Textos curtos e estimulantes:** Contos, crônicas ou poesias requerem menos energia e mantêm o engajamento.\n\n" +
                       "**Audiolivros:** Quando os olhos estão cansados, ouvir uma história pode ser relaxante e menos exigente.\n\n" +
                       "**Leituras inspiradoras:** Biografias de pessoas que superaram grandes desafios podem renovar sua motivação.";
                       
            case "confusion":
                return "**Histórias lineares:** Narrativas com estrutura clara, sem muitos saltos temporais ou personagens, são mais fáceis de acompanhar.\n\n" +
                       "**Releituras:** Revisitar um livro familiar proporciona conforto e clareza quando sua mente está sobrecarregada.\n\n" +
                       "**Livros de organização mental:** Obras sobre clareza de pensamento e tomada de decisões podem ajudar a organizar suas ideias.";
                       
            case "positive":
                return "**Alimente sua curiosidade:** Aproveite seu bom humor para explorar temas novos e desafiadores que expandem horizontes.\n\n" +
                       "**Compartilhe a experiência:** Participe de clubes do livro ou discuta suas leituras atuais com amigos, ampliando o prazer da leitura.\n\n" +
                       "**Desafie-se:** Tente clássicos literários ou gêneros que você normalmente não leria - seu estado mental positivo favorece novas descobertas.";
                       
            default:
                return "**Leia o que ressoa:** Escolha livros que atendam ao seu estado de espírito atual, seja para escapismo ou reflexão.\n\n" +
                       "**Crie um ritual:** Estabeleça um momento especial para leitura com elementos que aumentem o conforto, como chá ou um lugar aconchegante.\n\n" +
                       "**Diversifique gêneros:** Alterne entre ficção e não-ficção para estimular diferentes partes do cérebro e manter o interesse.";
        }
    }
    
    /**
     * Gera uma resposta para um prompt genérico.
     */
    public static String generateResponse(String prompt) {
        // Array de respostas possíveis para simulação
        String[] responses = {
            "A leitura pode ser uma excelente forma de lidar com suas emoções. Que tal experimentar algum dos livros que recomendei?",
            "Obrigado por compartilhar seus pensamentos. A literatura tem um poder transformador e pode oferecer novas perspectivas para o que você está sentindo.",
            "Entendo como você se sente. Muitas pessoas encontram conforto em livros que abordam experiências semelhantes às suas.",
            "Às vezes, mergulhar em uma boa história pode nos ajudar a processar nossas próprias emoções de forma mais clara.",
            "Que tal explorar alguns títulos que tratam especificamente desses temas que você mencionou?",
            "A leitura regular, mesmo que por curtos períodos, pode ter um impacto positivo significativo no seu bem-estar emocional.",
            "Tenho certeza que encontraremos o livro perfeito para este momento que você está vivendo.",
            "Suas experiências são únicas, mas a literatura nos mostra que muitos sentimentos são universais e compartilhados.",
            "Vamos encontrar histórias que possam ressoar com você e talvez oferecer algum conforto ou inspiração.",
            "Às vezes, as palavras certas no livro certo podem fazer toda a diferença em como vemos nossa própria situação."
        };
        
        // Adicionar algumas marcações Markdown para que seja formatado corretamente no frontend
        String baseResponse = responses[random.nextInt(responses.length)];
        
        // Adicionar elementos Markdown aleatoriamente para demonstrar a formatação
        if (random.nextBoolean()) {
            baseResponse = "**" + baseResponse.substring(0, baseResponse.indexOf('.') + 1) + "**" + 
                          baseResponse.substring(baseResponse.indexOf('.') + 1);
        }
        
        if (prompt.length() > 100 && random.nextBoolean()) {
            String[] paragraphs = {
                "\n\n*Lembre-se que a leitura é uma jornada pessoal, e está tudo bem explorar em seu próprio ritmo.*",
                "\n\n*Cada página virada é um pequeno passo em sua jornada de autodescoberta.*",
                "\n\n*Como disse Jorge Luis Borges: \"Sempre imaginei que o Paraíso seria uma espécie de biblioteca.\"*"
            };
            
            baseResponse += paragraphs[random.nextInt(paragraphs.length)];
        }
        
        return baseResponse;
    }
}