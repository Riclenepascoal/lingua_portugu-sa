package com.libraey.api.models;

import java.util.List;

public class KidsBook {
    private int id;
    private String title;
    private String level;
    private String content;
    private List<Quiz> quiz;
    
    public KidsBook() {}
    
    public KidsBook(int id, String title, String level, String content, List<Quiz> quiz) {
        this.id = id;
        this.title = title;
        this.level = level;
        this.content = content;
        this.quiz = quiz;
    }
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getLevel() {
        return level;
    }
    
    public void setLevel(String level) {
        this.level = level;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public List<Quiz> getQuiz() {
        return quiz;
    }
    
    public void setQuiz(List<Quiz> quiz) {
        this.quiz = quiz;
    }
    
    public static class Quiz {
        private String question;
        private List<String> options;
        private String answer;
        
        public Quiz() {}
        
        public Quiz(String question, List<String> options, String answer) {
            this.question = question;
            this.options = options;
            this.answer = answer;
        }
        
        public String getQuestion() {
            return question;
        }
        
        public void setQuestion(String question) {
            this.question = question;
        }
        
        public List<String> getOptions() {
            return options;
        }
        
        public void setOptions(List<String> options) {
            this.options = options;
        }
        
        public String getAnswer() {
            return answer;
        }
        
        public void setAnswer(String answer) {
            this.answer = answer;
        }
    }
} 