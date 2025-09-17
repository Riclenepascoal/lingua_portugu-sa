// API Client para a Libraey API
const API_BASE_URL = 'http://localhost:4567';

// Funções para interagir com a API de livros
const BooksAPI = {
    // Obter todos os livros
    getAllBooks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/books`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            throw error;
        }
    },
    
    // Obter um livro específico
    getBook: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/books/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar livro ${id}:`, error);
            throw error;
        }
    },
    
    // Adicionar um novo livro
    addBook: async (book) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
            throw error;
        }
    }
};

// Funções para interagir com a API de livros infantis
const KidsBooksAPI = {
    // Obter todos os livros infantis
    getAllKidsBooks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/kidsbooks`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar livros infantis:', error);
            throw error;
        }
    },
    
    // Obter um livro infantil específico
    getKidsBook: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/kidsbooks/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar livro infantil ${id}:`, error);
            throw error;
        }
    }
};

// Funções para interagir com a API de recomendações
const RecommendationsAPI = {
    // Obter recomendações para um estado emocional
    getRecommendations: async (state) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/recommendations/${state}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar recomendações para ${state}:`, error);
            throw error;
        }
    }
};

// Funções para interagir com a API de idiomas
const LanguagesAPI = {
    // Obter todos os idiomas
    getAllLanguages: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/languages`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar idiomas:', error);
            throw error;
        }
    },
    
    // Obter um idioma específico
    getLanguage: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/languages/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar idioma ${id}:`, error);
            throw error;
        }
    }
};

// Funções para interagir com a API de IA (Gemini)
const AIAPI = {
    // Analisar sentimento de um texto
    analyzeSentiment: async (text) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/sentiment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao analisar sentimento:', error);
            throw error;
        }
    },
    
    // Obter resumo de um livro
    getBookSummary: async (title, content) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/book-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao gerar resumo do livro:', error);
            throw error;
        }
    },
    
    // Obter dicas de leitura baseadas no estado emocional
    getReadingTips: async (emotionalState) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/reading-tips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emotionalState })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter dicas de leitura:', error);
            throw error;
        }
    },
    
    // Consulta genérica à IA
    chatWithAI: async (prompt) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao consultar IA:', error);
            throw error;
        }
    }
};

// Exemplo de uso:
// Substituir chamadas de dados locais no script.js por chamadas à API:

// Antes:
// const book = books['dom casmurro'];

// Depois:
// BooksAPI.getBook('dom-casmurro').then(book => {
//     setCurrentBook(book.title, book.content);
// });

// Antes:
// const kidsBook = kidsBooks[bookId];

// Depois:
// KidsBooksAPI.getKidsBook(bookId).then(book => {
//     openBook(book);
// });

// Antes:
// const recommendations = bookRecommendations[state];

// Depois:
// RecommendationsAPI.getRecommendations(state).then(recommendations => {
//     updateRecommendations(recommendations);
// });

// Exemplos de uso da API de IA:
// 
// // Analisar sentimento de uma mensagem
// AIAPI.analyzeSentiment("Estou me sentindo muito triste hoje").then(result => {
//     const sentiment = result.sentiment;
//     RecommendationsAPI.getRecommendations(sentiment).then(recommendations => {
//         updateRecommendations(recommendations);
//     });
// });
// 
// // Obter resumo de um livro
// BooksAPI.getBook('dom-casmurro').then(book => {
//     AIAPI.getBookSummary(book.title, book.content).then(result => {
//         showBookSummary(result.summary);
//     });
// });
// 
// // Obter dicas de leitura personalizadas
// AIAPI.getReadingTips("depression").then(result => {
//     showReadingTips(result.tips);
// }); 