package com.libraey.api.standalone;

import com.libraey.api.Application;

/**
 * Classe principal para executar a API diretamente.
 * Esta classe existe para facilitar a execução sem o Maven.
 */
public class Main {
    public static void main(String[] args) {
        // Inicializa a aplicação Spark
        Application.main(args);
    }
} 