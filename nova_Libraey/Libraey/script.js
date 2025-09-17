// Estado global da aplicação
let currentSection = 'home';
let isListening = false;
let recognition = null;
let synthesis = window.speechSynthesis;
let currentBook = null;
let selectedEmoji = null;
let chatMessages = [];
let currentLanguage = null;
let geminiApiKey = 'AIzaSyCu4cJWYTXELIYi8yZbLtw0ZJuGVr10eZk'; // Substitua com sua chave da API do Gemini
let livrosRecomendados = []; // Array para armazenar livros recomendados
let bookLibrary = {};
let bookSuggestions = [];

// Armazenar o tema atual expandido
let currentExpandedTheme = '';
let currentPage = {};
let currentChapter = 1;
let totalChapters = 10;
let isDarkMode = false;
let currentFontSize = 1.1;

// Dados dos livros
const books = {
    'dom casmurro': 'Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu...',
    'o cortiço': 'João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro que enriqueceu entre as quatro paredes de uma suja e obscura taverna nos refolhos do bairro do Botafogo...',
    'iracema': 'Verdes mares bravios de minha terra natal, ó auras do oceano, onde é que vos perdestes? Que é feito de vós, ondas sonoras, que embaláveis minha infância?...',
    'o guarani': 'No ano da graça de 1604, o fidalgo português D. Antônio de Mariz havia já de si feito um homem notável...'
};

// Dados dos livros infantis
const kidsBooks = {
    1: {
        title: 'A Aventura do Alfabeto',
        level: 'Iniciante',
        content: 'Era uma vez uma menina chamada Ana que adorava aprender. Um dia, ela encontrou um livro mágico que a levou numa aventura pelo alfabeto. Ela conheceu a letra "A" que sempre ficava em primeiro lugar na fila, e o "B" que zumbia como uma abelha...',
        quiz: [
            {
                question: 'Que letra vem depois do "A" no alfabeto?',
                options: ['B', 'C', 'D', 'Z'],
                answer: 'B'
            },
            {
                question: 'Quantas letras tem o alfabeto português?',
                options: ['20', '24', '26', '30'],
                answer: '26'
            }
        ]
    },
    2: {
        title: 'Os Ninjas dos Números',
        level: 'Intermediário',
        content: 'Na vila escondida de Matemática, os Ninjas dos Números treinavam todos os dias para dominar as artes da adição, subtração, multiplicação e divisão...',
        quiz: [
            {
                question: 'Quanto é 5 + 3?',
                options: ['7', '8', '9', '10'],
                answer: '8'
            },
            {
                question: 'Quantos lados tem um triângulo?',
                options: ['2', '3', '4', '5'],
                answer: '3'
            }
        ]
    },
    3: {
        title: 'Exploradores da Ciência',
        level: 'Avançado',
        content: 'O laboratório do Professor Átomo estava cheio de tubos de ensaio borbulhantes e máquinas zunindo. Seus alunos se reuniram enquanto ele se preparava para mostrar-lhes um experimento incrível...',
        quiz: [
            {
                question: 'O que as plantas precisam para crescer?',
                options: ['Apenas água', 'Apenas luz solar', 'Água e luz solar', 'Apenas terra'],
                answer: 'Água e luz solar'
            },
            {
                question: 'Qual animal põe ovos?',
                options: ['Cachorro', 'Gato', 'Pássaro', 'Elefante'],
                answer: 'Pássaro'
            }
        ]
    }
};

// Recomendações de livros por estado emocional
const bookRecommendations = {
    depression: [
        {
            title: 'O Poder do Agora',
            author: 'Eckhart Tolle',
            description: 'Um guia para a iluminação espiritual e superação da depressão através da consciência presente.'
        },
        {
            title: 'Ansiedade: Como Enfrentar o Mal do Século',
            author: 'Augusto Cury',
            description: 'Estratégias para superar a ansiedade e encontrar paz interior.'
        }
    ],
    anxiety: [
        {
            title: 'Mente Zen, Mente de Principiante',
            author: 'Shunryu Suzuki',
            description: 'Práticas de meditação para acalmar a mente ansiosa.'
        },
        {
            title: 'O Livro da Ansiedade',
            author: 'Augusto Cury',
            description: 'Técnicas para controlar a ansiedade e viver com mais tranquilidade.'
        }
    ],
    stress: [
        {
            title: 'A Arte de Não Amargar a Vida',
            author: 'Rafael Santandreu',
            description: 'Como desenvolver uma mentalidade forte e resistente ao estresse.'
        },
        {
            title: 'Seja Foda!',
            author: 'Caio Carneiro',
            description: 'Um guia prático para superar obstáculos e reduzir o estresse.'
        }
    ],
    positive: [
        {
            title: 'O Segredo',
            author: 'Rhonda Byrne',
            description: 'Como manter e amplificar pensamentos positivos para atrair mais felicidade.'
        },
        {
            title: 'Felicidade Genuína',
            author: 'Martin Seligman',
            description: 'A ciência da psicologia positiva e do bem-estar.'
        }
    ],
    fatigue: [
        {
            title: 'Por Que Dormimos',
            author: 'Matthew Walker',
            description: 'A importância do sono para a energia e saúde mental.'
        },
        {
            title: 'Energia Sem Limites',
            author: 'Tony Robbins',
            description: 'Estratégias para aumentar sua energia e vitalidade.'
        }
    ],
    confusion: [
        {
            title: 'Rápido e Devagar',
            author: 'Daniel Kahneman',
            description: 'Como nossa mente toma decisões e como pensar com mais clareza.'
        },
        {
            title: 'Foco',
            author: 'Daniel Goleman',
            description: 'Como desenvolver atenção e clareza mental.'
        }
    ]
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar biblioteca de livros
    initializeBookLibrary();
    
    // Inicializar reconhecimento de voz se disponível
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        initializeSpeechRecognition();
    } else {
        document.getElementById('voiceButton').disabled = true;
        document.getElementById('voiceStatus').textContent = 'Reconhecimento de voz não suportado neste navegador.';
    }
    
    // Inicializar chat de bem-estar
    initializeChatMessages();
    
    // Inicializar input do chat
    initializeChatInput();
    
    // Mostrar seção inicial
    showSection('home');
});

// Navegação entre seções
function showSection(sectionId) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Se for a seção de bem-estar, focar no input de chat
        if (sectionId === 'bem-estar') {
            setTimeout(() => {
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.focus();
                }
            }, 300);
        }
    }

    // Esconder navbar hero se não estiver na home
    const hero = document.querySelector('.hero');
    if (sectionId === 'home') {
        hero.style.display = 'block';
    } else {
        hero.style.display = 'none';
    }
}

// === ASSISTENTE DE VOZ ===

function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'pt-BR';

        recognition.onresult = function(event) {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;
            document.getElementById('transcript').textContent = transcript;
            document.getElementById('transcript').classList.remove('hidden');
        };

        recognition.onend = function() {
            if (isListening) {
                const transcript = document.getElementById('transcript').textContent;
                if (transcript) {
                    processVoiceCommand(transcript.toLowerCase());
                }
                setListeningState(false);
            }
        };

        recognition.onerror = function(event) {
            console.error('Erro no reconhecimento de voz:', event.error);
            setListeningState(false);
        };
    }
}

function toggleVoiceRecognition() {
    if (!recognition) {
        alert('Reconhecimento de voz não suportado neste navegador.');
        return;
    }

    if (isListening) {
        recognition.stop();
        setListeningState(false);
    } else {
        document.getElementById('transcript').textContent = '';
        document.getElementById('transcript').classList.add('hidden');
        recognition.start();
        setListeningState(true);
        speak('Estou ouvindo. Que livro você gostaria de escutar?');
    }
}

function setListeningState(listening) {
    isListening = listening;
    const button = document.getElementById('voiceButton');
    const status = document.getElementById('voiceStatus');
    
    if (listening) {
        button.classList.add('listening');
        button.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        status.textContent = 'Ouvindo... Diga um comando';
    } else {
        button.classList.remove('listening');
        button.innerHTML = '<i class="fas fa-microphone"></i>';
        status.textContent = 'Toque para começar a ouvir';
    }
}

function processVoiceCommand(command) {
    console.log('Comando recebido:', command);

    // Verificar se é um pedido de sugestão de livro
    if (command.includes('sugerir livro')) {
        let tema = '';
        
        // Verificar se há um tema específico
        if (command.includes('sobre')) {
            tema = command.split('sobre')[1].trim();
        }
        
        getBookSuggestion(tema);
        return;
    }
    
    // Verificar se o comando contém título de livro conhecido
    for (const bookId in bookLibrary) {
        const book = bookLibrary[bookId];
        if (command.toLowerCase().includes(book.title.toLowerCase())) {
            loadBookContent(bookId);
            speak(`Abrindo ${book.title} de ${book.author}. ${book.excerpt.substring(0, 150)}...`);
            return;
        }
    }

    // Verificar se contém título de livro nos livros antigos
    for (const bookTitle in books) {
        if (command.includes(bookTitle)) {
            setCurrentBook(bookTitle, books[bookTitle]);
            speak(`Abrindo ${bookTitle}. ${books[bookTitle].substring(0, 150)}...`);
            return;
        }
    }

    // Tratar outros comandos
    if (command.includes('parar') || command.includes('pausar')) {
        stopReading();
        speak('Leitura pausada.');
    } else if (command.includes('ajuda')) {
        speak('Você pode me pedir para ler um livro dizendo "ler" seguido do título do livro. Posso ler os clássicos da literatura brasileira como Dom Casmurro, O Cortiço, ou Memórias Póstumas de Brás Cubas. Você também pode pedir para eu sugerir um livro dizendo "sugerir livro" ou "sugerir livro sobre" seguido de um tema.');
    } else if (command.includes('listar livros') || command.includes('que livros')) {
        let listaLivros = 'Tenho os seguintes livros disponíveis: ';
        for (const bookId in bookLibrary) {
            listaLivros += bookLibrary[bookId].title + ' de ' + bookLibrary[bookId].author + ', ';
        }
        speak(listaLivros);
    } else {
        speak('Não entendi esse comando. Você pode me pedir para ler um livro, pausar a leitura, listar os livros disponíveis, ou pedir uma sugestão de livro.');
    }
}

function setCurrentBook(title, content) {
    currentBook = { title, content };
    
    // Atualizar interface
    document.getElementById('currentBookTitle').textContent = title;
    document.getElementById('currentBookContent').textContent = content;
    document.getElementById('currentBookCard').classList.remove('hidden');
    
    const readButton = document.getElementById('readButton');
    readButton.disabled = false;
    readButton.innerHTML = `<i class="fas fa-book-open"></i> Ler ${title}`;
}

function readCurrentBook() {
    if (currentBook) {
        speak(currentBook.content);
        document.getElementById('currentBookStatus').textContent = 'Lendo atualmente...';
    }
}

function stopReading() {
    if (synthesis) {
        synthesis.cancel();
        if (currentBook) {
            document.getElementById('currentBookStatus').textContent = 'Pronto para ler';
        }
    }
}

function speak(text) {
    if (synthesis) {
        synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        synthesis.speak(utterance);
    }
}

// === CHAT DE BEM-ESTAR ===

function initializeChatMessages() {
    // Inicializar array de mensagens se estiver vazio
    if (!chatMessages || chatMessages.length === 0) {
        chatMessages = [];
        
        // Adicionar mensagem de boas-vindas do bot
        addMessageToChat('bot', 'Olá! Como posso ajudar você hoje? Estou aqui para conversar e recomendar livros baseados em como você está se sentindo.');
    }
    
    // Atualizar a exibição
    updateChatDisplay();
}

function showTab(tabId) {
    // Esconder todas as abas
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Mostrar aba selecionada
    document.getElementById(tabId).classList.add('active');
    
    // Ativar botão correspondente
    const activeButton = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function selectEmoji(emoji, label, state) {
    // Mostrar que estamos processando
    selectedEmoji = { emoji, label, state };
    
    // Adicionar mensagem do usuário ao chat
    const userMessage = `Estou me sentindo ${label} ${emoji}`;
    addMessageToChat('user', userMessage);
    
    // Mostrar indicador de digitação
    showTypingIndicator();
    
    // Obter resposta da API do Gemini
    getGeminiResponse(userMessage, state);
}

async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        // Adicionar mensagem ao histórico
        addMessageToChat('user', message);
        
        // Limpar campo de entrada
        chatInput.value = '';
        
        // Reset altura do textarea
        chatInput.style.height = 'auto';
        
        // Desabilitar o botão de envio
        document.getElementById('sendButton').disabled = true;
        
        // Fechar emoji picker se estiver aberto
        const emojiPicker = document.getElementById('emoji-picker');
        if (emojiPicker && emojiPicker.style.display !== 'none') {
            emojiPicker.style.display = 'none';
        }
        
        // Mostrar indicador de digitação
        showTypingIndicator();
        
        // Obter resposta da API do Gemini
        getGeminiResponse(message);
    }
}

function addMessageToChat(sender, message, isRecommendation = false) {
    // Adicionar mensagem ao array
    chatMessages.push({ sender, message, isRecommendation });
    
    // Atualizar a exibição
    updateChatDisplay();
}

function showTypingIndicator() {
    const chatMessagesContainer = document.getElementById('chatMessages');
    
    // Criar indicador de digitação
    const typingElement = document.createElement('div');
    typingElement.id = 'typingIndicator';
    typingElement.className = 'chat-message bot-message';
    typingElement.innerHTML = `
        <div class="chat-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    // Adicionar ao container
    chatMessagesContainer.appendChild(typingElement);
    
    // Rolar para o final
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Função para obter o nome do estado emocional em português
function getStateName(state) {
    const stateNames = {
        'depression': 'depressão',
        'anxiety': 'ansiedade',
        'stress': 'estresse',
        'positive': 'felicidade',
        'fatigue': 'cansaço',
        'confusion': 'confusão'
    };
    
    return stateNames[state] || state;
}

async function getGeminiResponse(message, state = null) {
    try {
        // Construir o prompt para a API Gemini
        let prompt = '';
        
        if (state) {
            // Se for uma mensagem com estado emocional
            prompt = `O usuário disse que está se sentindo ${message}. 
            O estado emocional identificado é: ${getStateName(state)}. 
            Por favor, responda como um assistente de biblioteca focado em bem-estar.
            Seja empático, ofereça algumas palavras de apoio e recomende 2-3 livros específicos que possam ajudar o usuário com este estado emocional.
            Responda em português do Brasil de forma conversacional. 
            Separe claramente as recomendações de livros no final da sua resposta.`;
        } else {
            // Se for uma mensagem de chat normal
            prompt = `O usuário disse: "${message}". 
            Você é um assistente de biblioteca especializado em bem-estar emocional.
            Responda de forma conversacional, empática e útil, em português do Brasil. 
            Se apropriado, recomende livros relevantes que possam ajudar o usuário.
            Se você recomendar livros, separe-os claramente no final da sua resposta.`;
        }
        
        // Chamada para a API do Gemini
        const response = await callGeminiAPI(prompt);
        
        // Processar a resposta
        processGeminiResponse(response);
        
    } catch (error) {
        console.error("Erro ao obter resposta do Gemini:", error);
        removeTypingIndicator();
        addMessageToChat('bot', "Desculpe, tive um problema ao processar sua mensagem. Poderia tentar novamente?");
    }
}

async function callGeminiAPI(prompt) {
    try {
        // Endpoint da API Gemini
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        
        // Configuração da requisição
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 800
            }
        };
        
        // Fazer a requisição
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }
        
        // Parsear a resposta
        const data = await response.json();
        
        // Verificar se há candidatos na resposta
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('Nenhuma resposta gerada pela API');
        }
        
        // Retornar o texto da resposta
        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error('Erro na chamada da API Gemini:', error);
        throw error;
    }
}

function processGeminiResponse(response) {
    // Remover o indicador de digitação
    removeTypingIndicator();
    
    // Verificar se a resposta contém recomendações de livros
    const hasRecommendations = response.includes('Recomendações de livros') || 
                              response.includes('Livros recomendados') ||
                              response.includes('recomendo os seguintes livros');
    
    if (hasRecommendations) {
        // Tentar dividir a resposta em partes
        const parts = response.split(/(Recomendações de livros|Livros recomendados|Recomendo os seguintes livros)/i);
        
        if (parts.length >= 2) {
            // Adicionar a parte da conversa (convertendo markdown para HTML)
            addMessageToChat('bot', convertMarkdownToHtml(parts[0].trim()));
            
            // Adicionar a parte das recomendações (convertendo markdown para HTML)
            const recommendationsPart = parts.slice(1).join('');
            addMessageToChat('bot', convertMarkdownToHtml(recommendationsPart), true);
            
            // Extrair e armazenar livros recomendados
            const novosLivros = extrairLivrosRecomendados(recommendationsPart);
            if (novosLivros && novosLivros.length > 0) {
                // Adicionar novos livros ao array global
                novosLivros.forEach(livro => {
                    // Verificar se o livro já existe no array (para evitar duplicações)
                    const livroExistente = livrosRecomendados.find(l => 
                        l.titulo.toLowerCase() === livro.titulo.toLowerCase());
                    
                    if (!livroExistente) {
                        livrosRecomendados.push(livro);
                    }
                });
            }
            
            // Atualizar a aba de recomendações
            updateRecommendationsTab(recommendationsPart);
        } else {
            // Se não conseguir dividir, adicionar tudo como uma mensagem normal
            addMessageToChat('bot', convertMarkdownToHtml(response));
        }
    } else {
        // Adicionar como uma mensagem normal (convertendo markdown para HTML)
        addMessageToChat('bot', convertMarkdownToHtml(response));
    }
}

function updateRecommendationsTab(recommendations) {
    const recommendationsContent = document.getElementById('recommendations-content');
    
    // Extrair novos livros do texto de recomendações
    const novosLivros = extrairLivrosRecomendados(recommendations);
    
    // Se temos livros recomendados (da conversa atual ou anteriores), exibi-los
    if (livrosRecomendados && livrosRecomendados.length > 0) {
        let livrosHTML = `
            <h4>Livros Recomendados para Você</h4>
            <div class="books-recommended-grid">
        `;
        
        livrosRecomendados.forEach(livro => {
            livrosHTML += `
                <div class="book-recommendation-card">
                    <div class="book-cover-placeholder">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="book-info">
                        <h5>${livro.titulo}</h5>
                        ${livro.autor ? `<p class="book-author">por ${livro.autor}</p>` : ''}
                        ${livro.descricao ? `<p class="book-description">${livro.descricao}</p>` : ''}
                        <button class="btn-small btn-primary book-action-btn">
                            <i class="fas fa-bookmark"></i> Salvar
                        </button>
                    </div>
                </div>
            `;
        });
        
        livrosHTML += `</div>`;
        recommendationsContent.innerHTML = livrosHTML;
    } else if (recommendations) {
        // Se não temos livros estruturados e temos recomendações do texto, mostrar o texto bruto
        recommendationsContent.innerHTML = `
            <div class="recommendations-list">
                ${recommendations}
            </div>
        `;
    } else {
        // Se não houver recomendações, exibir mensagem amigável
        recommendationsContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open" style="font-size: 2.5rem; margin-bottom: 15px; color: #667eea;"></i>
                <h4>Sem recomendações ainda</h4>
                <p>Converse com nosso assistente sobre como você está se sentindo e receba recomendações de livros personalizadas.</p>
            </div>
        `;
    }
}

// Função para extrair informações de livros de um texto de recomendação
function extrairLivrosRecomendados(texto) {
    const livros = [];
    
    // Procurar padrões comuns de recomendação de livros
    // Padrão 1: Livro: "Título" por Autor - Descrição
    const padrao1 = /[""]([^""]+)[""][\s\n]*(?:por|de)[\s\n]*([^\.!\n]+)/gi;
    
    // Padrão 2: Título - Autor: Descrição
    const padrao2 = /[*_]*([^:*\n]+)[*_]*[\s\n]*[-–][\s\n]*([^:]+):([^\n]+)/gi;
    
    // Padrão 3: Título - Autor
    const padrao3 = /[*_]*([^*\n]+)[*_]*[\s\n]*[-–][\s\n]*([^\n\.]+)/gi;
    
    // Padrão 4: Autor - Título
    const padrao4 = /[*_]*([^-\n]+)[*_]*[\s\n]*[-–][\s\n]*[""]?([^""\.]+)[""]?/gi;
    
    // Tentar extrair com o padrão 1
    let match;
    while ((match = padrao1.exec(texto)) !== null) {
        livros.push({
            titulo: match[1].trim(),
            autor: match[2] ? match[2].trim() : '',
            descricao: match[3] ? match[3].trim() : ''
        });
    }
    
    // Se não encontrou com o padrão 1, tentar com padrão 2
    if (livros.length === 0) {
        while ((match = padrao2.exec(texto)) !== null) {
            livros.push({
                titulo: match[1].trim().replace(/[*_]/g, ''),
                autor: match[2] ? match[2].trim() : '',
                descricao: match[3] ? match[3].trim() : ''
            });
        }
    }
    
    // Se não encontrou com os padrões anteriores, tentar com padrão 3
    if (livros.length === 0) {
        while ((match = padrao3.exec(texto)) !== null) {
            livros.push({
                titulo: match[1].trim().replace(/[*_]/g, ''),
                autor: match[2] ? match[2].trim() : '',
                descricao: ''
            });
        }
    }
    
    // Se não encontrou com os padrões anteriores, tentar com padrão 4
    if (livros.length === 0) {
        while ((match = padrao4.exec(texto)) !== null) {
            livros.push({
                titulo: match[2].trim().replace(/["]/g, ''),
                autor: match[1] ? match[1].trim() : '',
                descricao: ''
            });
        }
    }
    
    return livros;
}

function updateChatDisplay() {
    const chatMessagesContainer = document.getElementById('chatMessages');
    chatMessagesContainer.innerHTML = '';
    
    // Se não houver mensagens, não fazer nada
    if (!chatMessages || chatMessages.length === 0) return;
    
    // Renderizar todas as mensagens
    chatMessages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${msg.sender}-message`;
        
        // Avatar para bot ou usuário
        const avatar = msg.sender === 'bot' 
            ? '<div class="chat-avatar"><i class="fas fa-robot"></i></div>'
            : '<div class="chat-avatar"><i class="fas fa-user"></i></div>';
        
        // Conteúdo da mensagem
        let content = '';
        if (msg.isRecommendation) {
            content = `<div class="recommendation-card">${msg.message}</div>`;
        } else {
            content = `<div class="message-content">${msg.message}</div>`;
        }
        
        messageElement.innerHTML = `${avatar}${content}`;
        chatMessagesContainer.appendChild(messageElement);
    });
    
    // Rolar para o final
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// === ZONA INFANTIL ===

function openBook(bookId) {
    const bookReader = document.getElementById('book-reader');
    const readerTitle = document.getElementById('reader-title');
    const readerLevel = document.getElementById('reader-level');
    const readerContent = document.getElementById('reader-content');
    
    // Resetar conteúdo
    readerContent.innerHTML = '';
    
    // Definir título e nível baseado no livro selecionado
    let title, level, prompt;
    
    switch(bookId) {
        case 1:
            title = "A Aventura do Alfabeto";
            level = "Iniciante";
            prompt = "Crie uma história curta e educativa para crianças sobre o alfabeto. A história deve ser divertida, colorida e ensinar sobre letras. Divida em 3-4 parágrafos curtos. Use linguagem simples adequada para iniciantes na leitura (5-6 anos). Inclua personagens carismáticos.";
            break;
        case 2:
            title = "Os Ninjas dos Números";
            level = "Intermediário";
            prompt = "Crie uma história curta e educativa para crianças sobre matemática básica. A história deve ter personagens 'ninjas dos números' que usam matemática para resolver problemas. Divida em 3-4 parágrafos curtos. Use linguagem adequada para leitores intermediários (7-8 anos).";
            break;
        case 3:
            title = "Exploradores da Ciência";
            level = "Avançado";
            prompt = "Crie uma história curta e educativa para crianças sobre ciência básica. A história deve ser sobre crianças explorando um fenômeno científico de maneira divertida e informativa. Divida em 3-4 parágrafos. Use linguagem adequada para leitores avançados (9-10 anos), incluindo alguns termos científicos explicados de forma simples.";
            break;
    }
    
    readerTitle.textContent = title;
    readerTitle.dataset.bookId = bookId;
    readerLevel.textContent = "Nível: " + level;
    
    // Exibir indicador de carregamento
    readerContent.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Carregando história...</p>
        </div>
    `;
    
    // Mostrar o leitor
    bookReader.classList.add('active');
    
    // Resetar abas
    document.getElementById('reader-content-tab').classList.add('active');
    document.getElementById('reader-quiz-tab').classList.remove('active');
    document.querySelectorAll('.reader-tab-btn')[0].classList.add('active');
    document.querySelectorAll('.reader-tab-btn')[1].classList.remove('active');
    
    // Gerar conteúdo da história usando a API do Gemini
    getGeminiContentForKids(prompt, 'story', bookId);
}

// Função para obter conteúdo da API do Gemini para a zona infantil
async function getGeminiContentForKids(prompt, type, bookId) {
    try {
        // Adicionar contexto específico para a zona infantil
        const fullPrompt = `${prompt} 
        Responda APENAS em português do Brasil.
        Use linguagem adequada para crianças.
        Não inclua conteúdo assustador ou inadequado.
        Seja educativo e divertido.`;
        
        // Endpoint da API Gemini
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        
        // Configuração da requisição
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: fullPrompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 800
            }
        };
        
        // Fazer a requisição
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }
        
        // Parsear a resposta
        const data = await response.json();
        
        // Verificar se há candidatos na resposta
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('Nenhuma resposta gerada pela API');
        }
        
        // Obter o texto da resposta
        const responseText = data.candidates[0].content.parts[0].text;
        
        // Processar o conteúdo baseado no tipo
        if (type === 'story') {
            processStoryContent(responseText, bookId);
        } else if (type === 'quiz') {
            processQuizContent(responseText, bookId);
        }
        
    } catch (error) {
        console.error('Erro ao obter conteúdo do Gemini para crianças:', error);
        
        // Mensagem de erro amigável para o usuário
        if (type === 'story') {
            document.getElementById('reader-content').innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Ops! Não conseguimos carregar a história agora. Vamos tentar mais tarde?</p>
                </div>
            `;
        } else if (type === 'quiz') {
            document.getElementById('reader-quiz-content').innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Ops! Não conseguimos carregar o quiz agora. Vamos tentar mais tarde?</p>
                </div>
            `;
        }
    }
}

// Processar o conteúdo da história
function processStoryContent(content, bookId) {
    const readerContent = document.getElementById('reader-content');
    
    // Converter texto em HTML e dividir em parágrafos
    const contentHtml = convertMarkdownToHtml(content);
    const paragraphs = contentHtml.split('<br><br>');
    
    // Limpar conteúdo atual
    readerContent.innerHTML = '';
    
    // Adicionar parágrafos animados
    paragraphs.forEach((paragraph, index) => {
        if (!paragraph.trim()) return;
        
        const p = document.createElement('div');
        p.className = 'animated-paragraph';
        p.style.animationDelay = (index * 0.2) + 's';
        p.innerHTML = paragraph;
        
        readerContent.appendChild(p);
    });
    
    // Armazenar a história para uso posterior
    if (!window.kidStories) {
        window.kidStories = {};
    }
    window.kidStories[bookId] = content;
}

function startQuiz() {
    showReaderTab('reader-quiz-tab');
    
    const quizContent = document.getElementById('reader-quiz-content');
    const bookId = parseInt(document.getElementById('reader-title').dataset.bookId);
    
    // Exibir indicador de carregamento para o quiz
    quizContent.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Preparando o quiz...</p>
        </div>
    `;
    
    // Obter a história para criar um quiz relacionado
    const storyContent = window.kidStories && window.kidStories[bookId];
    
    // Determinar o prompt baseado no livro
    let prompt;
    if (storyContent) {
        // Se temos a história, criar quiz baseado nela
        prompt = `Com base nesta história infantil: "${storyContent}", crie 3 perguntas de múltipla escolha para testar a compreensão de uma criança sobre a história. As perguntas devem ser adequadas ao nível de leitura (${bookId === 1 ? 'iniciante 5-6 anos' : bookId === 2 ? 'intermediário 7-8 anos' : 'avançado 9-10 anos'}). Para cada pergunta, forneça 3 opções de resposta, uma delas sendo a correta. Formate cada pergunta usando números (1, 2, 3) e cada opção usando letras (a, b, c).`;
    } else {
        // Se não temos a história, criar quiz genérico baseado no tema
        switch(bookId) {
            case 1:
                prompt = "Crie 3 perguntas simples de múltipla escolha sobre o alfabeto, adequadas para crianças de 5-6 anos. Para cada pergunta, forneça 3 opções de resposta, uma delas sendo a correta.";
                break;
            case 2: 
                prompt = "Crie 3 perguntas de múltipla escolha sobre matemática básica (contagem, adição simples), adequadas para crianças de 7-8 anos. Para cada pergunta, forneça 3 opções de resposta, uma delas sendo a correta.";
                break;
            case 3:
                prompt = "Crie 3 perguntas de múltipla escolha sobre ciência básica (planetas, animais ou experimentos), adequadas para crianças de 9-10 anos. Para cada pergunta, forneça 3 opções de resposta, uma delas sendo a correta.";
                break;
        }
    }
    
    // Gerar conteúdo do quiz usando a API do Gemini
    getGeminiContentForKids(prompt, 'quiz', bookId);
}

// Processar o conteúdo do quiz
function processQuizContent(content, bookId) {
    const quizContent = document.getElementById('reader-quiz-content');
    
    try {
        // Extrair perguntas e respostas do texto
        const perguntas = extrairPerguntas(content);
        
        if (perguntas.length > 0) {
            // Limpar conteúdo atual
            quizContent.innerHTML = '';
            
            // Criar HTML para cada pergunta
            perguntas.forEach((pergunta, index) => {
                const perguntaDiv = document.createElement('div');
                perguntaDiv.className = 'quiz-question';
                perguntaDiv.innerHTML = `
                    <h4>${index + 1}. ${pergunta.pergunta}</h4>
                    <div class="quiz-options">
                        ${pergunta.opcoes.map((opcao, i) => `
                            <div class="quiz-option" onclick="selectOption(this)" data-correct="${pergunta.respostaCorreta === i}">
                                <label>
                                    <input type="radio" name="pergunta${index}" value="${i}" />
                                    ${opcao}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                quizContent.appendChild(perguntaDiv);
            });
            
            // Adicionar botão para enviar respostas
            const submitDiv = document.createElement('div');
            submitDiv.className = 'reader-actions';
            submitDiv.innerHTML = `
                <button class="btn btn-primary" onclick="submitQuiz()">Verificar Respostas</button>
            `;
            quizContent.appendChild(submitDiv);
        } else {
            // Se não conseguiu extrair perguntas, mostrar mensagem amigável
            quizContent.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-question-circle"></i>
                    <p>Hmmm, parece que não conseguimos preparar o quiz desta vez. Que tal tentar novamente?</p>
                    <button class="btn btn-primary" onclick="startQuiz()">Tentar Novamente</button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erro ao processar quiz:', error);
        quizContent.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Ops! Algo deu errado ao preparar o quiz. Vamos tentar novamente?</p>
                <button class="btn btn-primary" onclick="startQuiz()">Tentar Novamente</button>
            </div>
        `;
    }
}

// Função para extrair perguntas do texto gerado pela API
function extrairPerguntas(texto) {
    const perguntas = [];
    
    // Dividir por linhas para processar
    const linhas = texto.split('\n');
    
    let perguntaAtual = null;
    let opcoes = [];
    let respostaCorreta = -1;
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        
        // Pular linhas vazias
        if (!linha) continue;
        
        // Verificar se é o início de uma pergunta (começa com número)
        const perguntaMatch = linha.match(/^(\d+)[.:\)]?\s+(.+)/);
        if (perguntaMatch) {
            // Se já temos uma pergunta em andamento, salvar a anterior
            if (perguntaAtual && opcoes.length > 0) {
                perguntas.push({
                    pergunta: perguntaAtual,
                    opcoes: [...opcoes],
                    respostaCorreta: respostaCorreta
                });
            }
            
            // Iniciar nova pergunta
            perguntaAtual = perguntaMatch[2];
            opcoes = [];
            respostaCorreta = -1;
            continue;
        }
        
        // Verificar se é uma opção de resposta
        const opcaoMatch = linha.match(/^[a-c][.:\)]?\s+(.+)/i);
        if (opcaoMatch && perguntaAtual) {
            // Adicionar à lista de opções
            opcoes.push(opcaoMatch[1]);
            
            // Verificar se é a resposta correta (normalmente indicado entre parênteses ou similar)
            if (linha.includes("(correta)") || 
                linha.includes("(certa)") ||
                linha.includes("(resposta correta)") ||
                linha.toLowerCase().includes("correta")) {
                respostaCorreta = opcoes.length - 1;
            }
            
            continue;
        }
        
        // Verificar se há indicação de resposta correta
        if (linha.toLowerCase().includes("resposta") && linha.toLowerCase().includes("correta")) {
            const letraMatch = linha.match(/[a-c]/i);
            if (letraMatch) {
                const letra = letraMatch[0].toLowerCase();
                respostaCorreta = letra.charCodeAt(0) - 'a'.charCodeAt(0);
            }
        }
    }
    
    // Adicionar última pergunta se houver
    if (perguntaAtual && opcoes.length > 0) {
        perguntas.push({
            pergunta: perguntaAtual,
            opcoes: [...opcoes],
            respostaCorreta: respostaCorreta >= 0 ? respostaCorreta : 0 // Padrão para primeira opção
        });
    }
    
    return perguntas;
}

function submitQuiz() {
    // Verificar respostas
    const quizQuestions = document.querySelectorAll('.quiz-question');
    let acertos = 0;
    let total = quizQuestions.length;
    
    quizQuestions.forEach(question => {
        const selectedOption = question.querySelector('.quiz-option.selected');
        if (selectedOption) {
            if (selectedOption.dataset.correct === 'true') {
                acertos++;
                selectedOption.classList.add('correct');
            } else {
                selectedOption.classList.add('incorrect');
                
                // Mostrar qual era a resposta correta
                const correctOption = question.querySelector('.quiz-option[data-correct="true"]');
                if (correctOption) {
                    correctOption.classList.add('show-correct');
                }
            }
        }
    });
    
    // Desabilitar seleção após envio
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.onclick = null;
        option.style.cursor = 'default';
    });
    
    // Calcular pontuação
    const pontuacao = total > 0 ? Math.round((acertos / total) * 100) : 0;
    
    // Exibir resultados
    const quizContent = document.getElementById('reader-quiz-content');
    const resultDiv = document.createElement('div');
    resultDiv.className = 'quiz-results';
    resultDiv.innerHTML = `
        <div class="score-card">
            <div class="score-value">${pontuacao}</div>
            <p>Você acertou ${acertos} de ${total} perguntas</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${pontuacao}%;"></div>
            </div>
        </div>
        
        <div class="achievement">
            <div class="achievement-icon">
                ${pontuacao >= 70 ? '🏆' : pontuacao >= 40 ? '🎖️' : '🌟'}
            </div>
            <div class="achievement-message">
                ${pontuacao >= 70 ? 'Excelente trabalho!' : pontuacao >= 40 ? 'Bom trabalho!' : 'Continue tentando!'}
            </div>
        </div>
        
        <button class="btn btn-primary" onclick="closeBook()">Voltar aos Livros</button>
    `;
    
    // Adicionar resultados ao final do quiz
    quizContent.appendChild(resultDiv);
    
    // Efeito de confete para pontuações altas
    if (pontuacao >= 70) {
        criarConfete();
    }
}

function selectOption(option) {
    // Desmarcar todas as opções no mesmo grupo
    const perguntaDiv = option.closest('.quiz-options');
    perguntaDiv.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Marcar a opção selecionada
    option.classList.add('selected');
    
    // Marcar o radio button
    option.querySelector('input[type="radio"]').checked = true;
}

function closeBook() {
    document.getElementById('book-reader').classList.remove('active');
}

function showReaderTab(tabId) {
    // Esconder todas as abas
    document.querySelectorAll('.reader-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desativar todos os botões de aba
    document.querySelectorAll('.reader-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar a aba selecionada
    document.getElementById(tabId).classList.add('active');
    
    // Ativar o botão da aba
    const btnIndex = tabId === 'reader-content-tab' ? 0 : 1;
    document.querySelectorAll('.reader-tab-btn')[btnIndex].classList.add('active');
}

function criarConfete() {
    // Criar container para confete
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // Cores para o confete
    const cores = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    
    // Criar 100 peças de confete
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Remover confete após alguns segundos
    setTimeout(() => {
        confettiContainer.remove();
    }, 6000);
}

// === IDIOMAS ===

function openLanguage(languageId) {
    const languageScreen = document.getElementById('language-screen');
    const languageTitle = document.getElementById('language-title');
    const languageDescription = document.getElementById('language-description');
    const languageLevel = document.getElementById('language-level');
    
    // Mostrar a tela de idioma
    languageScreen.classList.add('active');
    
    // Configurar detalhes do idioma
    let language, description, level, targetLanguage;
    
    switch(languageId) {
        case 1:
            language = "Inglês";
            description = "A língua mais falada globalmente";
            level = "Níveis disponíveis: Iniciante, Intermediário, Avançado";
            targetLanguage = "english";
            break;
        case 2:
            language = "Espanhol";
            description = "Uma das línguas mais faladas no mundo";
            level = "Níveis disponíveis: Iniciante, Intermediário";
            targetLanguage = "spanish";
            break;
        case 3:
            language = "Francês";
            description = "A língua do amor e da diplomacia";
            level = "Níveis disponíveis: Iniciante, Intermediário, Avançado";
            targetLanguage = "french";
            break;
        case 4:
            language = "Alemão";
            description = "A língua da precisão e inovação";
            level = "Níveis disponíveis: Iniciante";
            targetLanguage = "german";
            break;
        case 5:
            language = "Italiano";
            description = "A língua da arte, música e gastronomia";
            level = "Níveis disponíveis: Iniciante, Intermediário";
            targetLanguage = "italian";
            break;
    }
    
    // Atualizar informações na tela
    languageTitle.textContent = language;
    languageDescription.textContent = description;
    languageLevel.textContent = level;
    
    // Mostrar indicador de carregamento
    document.getElementById('language-loading').style.display = 'flex';
    document.getElementById('language-error').style.display = 'none';
    document.getElementById('language-content-container').style.display = 'none';
    
    // Resetar abas
    document.querySelector('.language-tab-btn').classList.add('active');
    document.querySelector('.language-tab-content').classList.add('active');
    
    // Armazenar o idioma atual para uso posterior
    currentLanguage = {
        id: languageId,
        name: language,
        targetLanguage: targetLanguage
    };
    
    // Carregar conteúdo para este idioma usando a API Gemini
    loadLanguageContent(targetLanguage);
}

// Função para carregar conteúdo de idioma da API Gemini
async function loadLanguageContent(targetLanguage) {
    try {
        // Carregar os 3 tipos de conteúdo em paralelo para maior eficiência
        await Promise.all([
            loadVocabularyContent(targetLanguage),
            loadPhrasesContent(targetLanguage),
            loadPracticeContent(targetLanguage)
        ]);
        
        // Esconder indicador de carregamento e mostrar conteúdo
        document.getElementById('language-loading').style.display = 'none';
        document.getElementById('language-content-container').style.display = 'block';
        
    } catch (error) {
        console.error('Erro ao carregar conteúdo do idioma:', error);
        
        // Mostrar mensagem de erro
        document.getElementById('language-loading').style.display = 'none';
        document.getElementById('language-error').style.display = 'block';
    }
}

// Carregar vocabulário básico
async function loadVocabularyContent(targetLanguage) {
    // Prompt para gerar vocabulário
    const prompt = `Gere um vocabulário básico para iniciantes em ${targetLanguage} com 10 palavras comuns.
    Para cada palavra, inclua:
    1. A palavra no idioma estrangeiro
    2. A pronúncia (representação fonética simples)
    3. A tradução em português
    4. A categoria (substantivo, verbo, adjetivo, etc.)
    
    Formate o resultado em uma lista JSON estruturada assim:
    [
      {
        "word": "palavra no idioma original",
        "pronunciation": "como pronunciar",
        "translation": "tradução em português",
        "category": "categoria gramatical"
      },
      ...etc
    ]
    
    Retorne APENAS o JSON, sem texto adicional ou explicações.`;
    
    // Fazer chamada para a API do Gemini
    const response = await getGeminiContentForLanguages(prompt);
    
    try {
        // Tentar extrair o JSON da resposta
        const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
            // Parsear o JSON
            const vocabularyData = JSON.parse(jsonMatch[0]);
            
            // Renderizar vocabulário
            renderVocabulary(vocabularyData);
        } else {
            // Se não conseguir extrair o JSON, usar uma abordagem alternativa
            renderVocabulary(extractVocabularyFromText(response));
        }
    } catch (error) {
        console.error('Erro ao processar vocabulário:', error);
        renderVocabulary(extractVocabularyFromText(response));
    }
}

// Carregar frases úteis
async function loadPhrasesContent(targetLanguage) {
    // Prompt para gerar frases úteis
    const prompt = `Gere 8 frases úteis básicas para um viajante que está aprendendo ${targetLanguage}.
    Para cada frase, inclua:
    1. A frase no idioma estrangeiro
    2. A tradução em português
    3. Um contexto de uso curto
    
    Formate o resultado em uma lista JSON estruturada assim:
    [
      {
        "phrase": "frase no idioma original",
        "translation": "tradução em português",
        "context": "contexto de uso"
      },
      ...etc
    ]
    
    Retorne APENAS o JSON, sem texto adicional ou explicações.`;
    
    // Fazer chamada para a API do Gemini
    const response = await getGeminiContentForLanguages(prompt);
    
    try {
        // Tentar extrair o JSON da resposta
        const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
            // Parsear o JSON
            const phrasesData = JSON.parse(jsonMatch[0]);
            
            // Renderizar frases
            renderPhrases(phrasesData);
        } else {
            // Se não conseguir extrair o JSON, usar uma abordagem alternativa
            renderPhrases(extractPhrasesFromText(response));
        }
    } catch (error) {
        console.error('Erro ao processar frases:', error);
        renderPhrases(extractPhrasesFromText(response));
    }
}

// Carregar exercícios de prática
async function loadPracticeContent(targetLanguage) {
    // Prompt para gerar exercícios
    const prompt = `Crie 3 exercícios práticos simples para um iniciante em ${targetLanguage}.
    Para cada exercício, inclua:
    1. Uma pergunta em português (tipo preenchimento ou múltipla escolha)
    2. 3 opções de resposta, sendo uma correta
    3. A opção correta (índice 0, 1 ou 2)
    
    Formate o resultado em uma lista JSON estruturada assim:
    [
      {
        "question": "pergunta em português",
        "options": ["opção 1", "opção 2", "opção 3"],
        "correctIndex": 0
      },
      ...etc
    ]
    
    Retorne APENAS o JSON, sem texto adicional ou explicações.`;
    
    // Fazer chamada para a API do Gemini
    const response = await getGeminiContentForLanguages(prompt);
    
    try {
        // Tentar extrair o JSON da resposta
        const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
            // Parsear o JSON
            const practiceData = JSON.parse(jsonMatch[0]);
            
            // Renderizar exercícios
            renderPractice(practiceData);
        } else {
            // Se não conseguir extrair o JSON, usar uma abordagem alternativa
            renderPractice(extractPracticeFromText(response));
        }
    } catch (error) {
        console.error('Erro ao processar exercícios:', error);
        renderPractice(extractPracticeFromText(response));
    }
}

// Função para obter conteúdo da API do Gemini para idiomas
async function getGeminiContentForLanguages(prompt) {
    try {
        // Adicionar contexto específico para o ensino de idiomas
        const fullPrompt = `${prompt} 
        Responda APENAS em português do Brasil e no idioma solicitado.
        Mantenha o conteúdo adequado para aprendizes iniciantes.
        Se solicitado, formate exatamente como especificado.
        Foco em vocabulário e frases úteis para situações cotidianas.`;
        
        // Reusar a mesma função de chamada à API usada no chat de bem-estar
        return await callGeminiAPI(fullPrompt);
    } catch (error) {
        console.error('Erro ao obter conteúdo do Gemini para idiomas:', error);
        throw error;
    }
}

// Funções de renderização
function renderVocabulary(vocabularyItems) {
    const vocabularyContent = document.getElementById('vocabulary-content');
    
    if (!vocabularyItems || vocabularyItems.length === 0) {
        vocabularyContent.innerHTML = '<p class="no-content">Não foi possível carregar o vocabulário.</p>';
        return;
    }
    
    let html = '';
    
    vocabularyItems.forEach(item => {
        html += `
            <div class="vocabulary-item">
                <div class="foreign-word">${item.word}</div>
                <div class="pronunciation">${item.pronunciation}</div>
                <div class="translation">${item.translation}</div>
                <div class="category">${item.category}</div>
            </div>
        `;
    });
    
    vocabularyContent.innerHTML = html;
}

function renderPhrases(phrases) {
    const phrasesContent = document.getElementById('phrases-content');
    
    if (!phrases || phrases.length === 0) {
        phrasesContent.innerHTML = '<p class="no-content">Não foi possível carregar as frases.</p>';
        return;
    }
    
    let html = '';
    
    phrases.forEach(item => {
        html += `
            <div class="phrase-item">
                <div class="foreign-phrase">${item.phrase}</div>
                <div class="translation">${item.translation}</div>
                <div class="context">${item.context}</div>
            </div>
        `;
    });
    
    phrasesContent.innerHTML = html;
}

function renderPractice(exercises) {
    const practiceContent = document.getElementById('practice-content');
    
    if (!exercises || exercises.length === 0) {
        practiceContent.innerHTML = '<p class="no-content">Não foi possível carregar os exercícios.</p>';
        return;
    }
    
    let html = '';
    
    exercises.forEach((item, exerciseIndex) => {
        html += `<div class="exercise-item" data-correct="${item.correctIndex}">
            <h4>${exerciseIndex + 1}. ${item.question}</h4>
            <div class="exercise-options">
                ${item.options.map((option, optionIndex) => `
                    <div class="exercise-option" onclick="selectLanguageExerciseOption(this)">
                        <input type="radio" name="exercise${exerciseIndex}" value="${optionIndex}" id="opt${exerciseIndex}_${optionIndex}">
                        <label for="opt${exerciseIndex}_${optionIndex}">${option}</label>
                    </div>
                `).join('')}
            </div>
        </div>`;
    });
    
    practiceContent.innerHTML = html;
}

// Funções para processamento de texto quando o JSON não está disponível
function extractVocabularyFromText(text) {
    const vocabularyItems = [];
    
    // Procurar padrões de vocabulário no texto
    const lines = text.split('\n');
    
    let currentWord = null;
    
    for (const line of lines) {
        // Ignorar linhas vazias
        if (!line.trim()) continue;
        
        // Procurar por palavra em destaque
        if (line.includes(':')) {
            // Nova palavra encontrada
            const wordMatch = line.split(':');
            
            if (wordMatch.length >= 2) {
                currentWord = {
                    word: wordMatch[0].trim(),
                    pronunciation: '',
                    translation: wordMatch[1].trim(),
                    category: 'Substantivo'
                };
                vocabularyItems.push(currentWord);
            }
        } else if (currentWord && (line.includes('(') || line.includes('['))) {
            // Provavelmente uma pronúncia
            const pronMatch = line.match(/[\(\[](.+?)[\)\]]/);
            if (pronMatch) {
                currentWord.pronunciation = pronMatch[1];
            }
        }
    }
    
    // Se não encontramos itens suficientes, criar alguns padrões
    if (vocabularyItems.length < 5) {
        return [
            { word: "Hello", pronunciation: "hel-lô", translation: "Olá", category: "Saudação" },
            { word: "Goodbye", pronunciation: "gud-bai", translation: "Adeus", category: "Saudação" },
            { word: "Thank you", pronunciation: "thenk-iú", translation: "Obrigado", category: "Cortesia" },
            { word: "Yes", pronunciation: "iés", translation: "Sim", category: "Resposta" },
            { word: "No", pronunciation: "nôu", translation: "Não", category: "Resposta" }
        ];
    }
    
    return vocabularyItems;
}

function extractPhrasesFromText(text) {
    const phrases = [];
    
    // Procurar padrões de frases no texto
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Ignorar linhas vazias
        if (!line) continue;
        
        // Procurar por frases em idioma estrangeiro
        if (line.match(/[A-Za-z\u00C0-\u00FF\?!]/) && i + 1 < lines.length) {
            const foreignPhrase = line;
            const translation = lines[i + 1].trim();
            let context = '';
            
            // Tentar encontrar um contexto na próxima linha
            if (i + 2 < lines.length && lines[i + 2].trim() && !lines[i + 2].match(/[0-9]\./)) {
                context = lines[i + 2].trim();
                i += 2;
            } else {
                i += 1;
            }
            
            phrases.push({
                phrase: foreignPhrase,
                translation: translation,
                context: context || "Uso cotidiano"
            });
        }
    }
    
    // Se não encontramos frases suficientes, criar algumas padrões
    if (phrases.length < 3) {
        return [
            { phrase: "Hello, how are you?", translation: "Olá, como vai você?", context: "Saudação informal" },
            { phrase: "My name is...", translation: "Meu nome é...", context: "Apresentação" },
            { phrase: "Where is the bathroom?", translation: "Onde é o banheiro?", context: "Pergunta em local público" }
        ];
    }
    
    return phrases;
}

function extractPracticeFromText(text) {
    const exercises = [];
    
    // Procurar padrões de exercícios no texto
    const lines = text.split('\n');
    
    let currentQuestion = null;
    let currentOptions = [];
    let correctIndex = 0;
    
    for (const line of lines) {
        // Ignorar linhas vazias
        if (!line.trim()) continue;
        
        // Procurar por pergunta
        if (line.match(/[0-9]+[\.\)]/) || line.includes('?')) {
            // Se já temos uma pergunta acumulada, salvar o exercício anterior
            if (currentQuestion && currentOptions.length > 0) {
                exercises.push({
                    question: currentQuestion,
                    options: [...currentOptions],
                    correctIndex: correctIndex
                });
                currentOptions = [];
            }
            
            // Nova pergunta encontrada
            currentQuestion = line.replace(/^[0-9]+[\.\)]/, '').trim();
            correctIndex = 0;
        } else if (currentQuestion && (line.match(/^[a-c][\.\)]/) || line.includes('( )') || line.includes('()') || line.includes('[]'))) {
            // Opção de resposta
            const option = line.replace(/^[a-c][\.\)]/, '').trim();
            
            // Verificar se esta é a opção correta
            if (line.toLowerCase().includes('correta') || line.includes('✓') || line.includes('*')) {
                correctIndex = currentOptions.length;
            }
            
            currentOptions.push(option);
        }
    }
    
    // Adicionar último exercício acumulado
    if (currentQuestion && currentOptions.length > 0) {
        exercises.push({
            question: currentQuestion,
            options: [...currentOptions],
            correctIndex: correctIndex
        });
    }
    
    // Se não encontramos exercícios suficientes, criar alguns padrões
    if (exercises.length < 2) {
        return [
            {
                question: "Como se diz 'Olá' em inglês?",
                options: ["Hello", "Goodbye", "Thank you"],
                correctIndex: 0
            },
            {
                question: "Qual a tradução de 'Thank you'?",
                options: ["Por favor", "Obrigado", "De nada"],
                correctIndex: 1
            }
        ];
    }
    
    return exercises;
}

// Função para alternar entre abas de idioma
function showLanguageTab(tabId) {
    // Esconder todas as abas
    document.querySelectorAll('.language-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desativar todos os botões
    document.querySelectorAll('.language-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    document.getElementById(tabId).classList.add('active');
    
    // Ativar botão correspondente
    document.querySelector(`[onclick="showLanguageTab('${tabId}')"]`).classList.add('active');
}

// Função para selecionar uma opção de exercício
function selectLanguageExerciseOption(option) {
    // Remover seleção anterior do mesmo grupo de opções
    const optionGroup = option.closest('.exercise-options');
    optionGroup.querySelectorAll('.exercise-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Marcar esta opção como selecionada
    option.classList.add('selected');
    option.querySelector('input').checked = true;
}

// Função para verificar respostas dos exercícios
function checkPracticeAnswers() {
    let correct = 0;
    const exercises = document.querySelectorAll('.exercise-item');
    
    exercises.forEach(exercise => {
        const correctIndex = parseInt(exercise.getAttribute('data-correct'));
        const selectedOption = exercise.querySelector('.exercise-option.selected');
        
        if (selectedOption) {
            // Obter índice da opção selecionada
            const selectedIndex = parseInt(selectedOption.querySelector('input').value);
            
            if (selectedIndex === correctIndex) {
                // Resposta correta
                correct++;
                selectedOption.classList.add('correct');
            } else {
                // Resposta incorreta
                selectedOption.classList.add('incorrect');
                
                // Mostrar a resposta correta
                const correctOption = exercise.querySelectorAll('.exercise-option')[correctIndex];
                correctOption.classList.add('correct');
            }
        }
        
        // Desabilitar todas as opções após verificação
        exercise.querySelectorAll('.exercise-option').forEach(option => {
            option.onclick = null;
            option.style.cursor = 'default';
        });
    });
    
    // Exibir resultado
    const percentage = Math.round((correct / exercises.length) * 100);
    
    // Substituir botão por mensagem de resultado
    const actionsArea = document.querySelector('.practice-actions');
    actionsArea.innerHTML = `
        <div class="practice-result">
            <p>Você acertou ${correct} de ${exercises.length} (${percentage}%)</p>
            <button class="btn btn-primary" onclick="loadLanguageContent(currentLanguage.targetLanguage)">Tentar Novamente</button>
        </div>
    `;
    
    // Efeito de confete para bons resultados
    if (percentage >= 70) {
        criarConfete();
    }
}

// Função para tentar recarregar conteúdo em caso de erro
function retryLanguageLoad() {
    if (currentLanguage) {
        loadLanguageContent(currentLanguage.targetLanguage);
    }
}

// Event listeners para Enter no chat
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});

// Função para demonstrar funcionalidades não implementadas
function showComingSoon(feature) {
    alert(`A funcionalidade "${feature}" estará disponível em breve!`);
}

// Adicionar event listeners para funcionalidades futuras
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar listeners para botões que ainda não têm funcionalidade completa
    const futureButtons = document.querySelectorAll('[onclick*="showComingSoon"]');
    futureButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const feature = this.textContent.trim();
            showComingSoon(feature);
        });
    });
});

// Função para converter Markdown para HTML
function markdownToHtml(text) {
    if (!text) return '';
    
    // Converter negrito
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Converter itálico
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Converter listas não ordenadas
    text = text.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/^- (.*?)$/gm, '<li>$1</li>');
    
    // Agrupar itens de lista em tags <ul>
    text = text.replace(/(<li>.*?<\/li>)(?!\s*<li>)/gs, '<ul>$1</ul>');
    
    // Converter listas ordenadas
    text = text.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
    
    // Agrupar itens de lista ordenada em tags <ol>
    text = text.replace(/(<li>.*?<\/li>)(?!\s*<li>)/gs, '<ol>$1</ol>');
    
    // Converter títulos
    text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Converter quebras de linha
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Função auxiliar para gerar o efeito de digitação da IA no chat
function typeMessage(element, text, index = 0, speed = 20) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        setTimeout(() => typeMessage(element, text, index + 1, speed), speed);
    }
}

// Conteúdo com formatação Markdown para os livros infantis
function gerarConteudoAlfabetoMarkdown() {
    return `## O Maravilhoso Mundo do Alfabeto

O **alfabeto** é um conjunto de **letras** que usamos para formar palavras. No português, temos 26 letras.

### As Letras Mágicas: Vogais

Vamos conhecer as **vogais**: A, E, I, O, U. As vogais são **letras** que representam sons que saem da nossa boca sem obstáculos.

### As Letras Companheiras: Consoantes

As outras **letras** são chamadas de **consoantes**. Elas formam sons quando encontram as vogais. Algumas consoantes são: B, C, D, F, G...

### Formando Palavras

Com as **letras** do **alfabeto**, podemos formar muitas palavras! Por exemplo, a palavra "LIVRO" é formada pelas letras L, I, V, R, O.

### Vamos Praticar?

Tente identificar as **vogais** e **consoantes** nas palavras seguintes:
* CASA
* BOLA
* PATO`;
}

function gerarConteudoNumerosMarkdown() {
    return `## O Mundo Incrível dos Números

Os **números** são símbolos que representam quantidades. Usamos **números** todos os dias!

### Juntando Números: Soma

A **soma** é quando juntamos dois ou mais **números**. Por exemplo: 
* 5 + 3 = 8. 
* Aqui juntamos 5 unidades com 3 unidades e obtemos 8 unidades.

### Tirando Números: Subtração

A **subtração** é quando tiramos um **número** de outro. Por exemplo: 
* 9 - 4 = 5. 
* Começamos com 9 unidades, tiramos 4 e ficamos com 5.

### Multiplicando Forças: Multiplicação

A **multiplicação** é uma forma rápida de fazer várias somas iguais. Por exemplo: 
* 3 × 4 = 12. 
* Isso significa 3 + 3 + 3 + 3 = 12.

### Repartindo Igualmente: Divisão

A **divisão** é quando repartimos um **número** em partes iguais. Por exemplo: 
* 10 ÷ 2 = 5. 
* Dividimos 10 em 2 grupos iguais, cada um com 5.

### Ninja dos Números

Os ninjas dos **números** são especialistas em usar essas operações para resolver problemas. Vamos treinar como eles?`;
}

function gerarConteudoCienciaMarkdown() {
    return `## O Fascinante Universo da Ciência

A **ciência** é como exploramos e entendemos o mundo ao nosso redor. Os cientistas fazem perguntas e realizam experimentos para encontrar respostas.

### Nossa Casa no Espaço

Nosso **planeta** Terra é apenas um dos oito planetas que giram em torno do Sol. Os outros planetas são:
* Mercúrio
* Vênus
* Marte
* Júpiter
* Saturno
* Urano
* Netuno

### O Reino Animal

Os **animais** são seres vivos que podem se movimentar. Existem muitos tipos:
* Mamíferos
* Aves
* Répteis
* Anfíbios
* Peixes
* Insetos

### O Mundo das Plantas

As **plantas** são seres vivos que produzem seu próprio alimento usando a luz do sol, água e dióxido de carbono. Este processo é chamado de **fotossíntese**.

### Como Funciona um Experimento

Um **experimento** científico é uma forma de testar uma ideia. Os cientistas:
1. Fazem uma pergunta
2. Criam uma hipótese (palpite)
3. Testam a hipótese
4. Analisam os resultados

### Vamos Explorar!

Vamos fazer uma **descoberta** científica juntos?`;
}

// Função para converter markdown para HTML
function convertMarkdownToHtml(markdown) {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Negrito: **texto** ou __texto__
    html = html.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
    
    // Itálico: *texto* ou _texto_
    html = html.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
    
    // Links: [texto](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Listas não ordenadas
    html = html.replace(/^\s*[\-\*]\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    
    // Listas ordenadas
    html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ol>$1</ol>');
    
    // Cabeçalhos: # Texto
    html = html.replace(/^#\s+(.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>');
    
    // Quebras de linha
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

// Inicialização do input de chat
function initializeChatInput() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    
    // Auto-resize para a textarea
    chatInput.addEventListener('input', function() {
        // Reset height para calcular corretamente
        this.style.height = 'auto';
        
        // Definir nova altura baseada no conteúdo (com min-height)
        const minRows = parseInt(this.getAttribute('data-min-rows') || 1);
        const lineHeight = 24; // Aproximadamente
        const newHeight = Math.max(minRows * lineHeight, this.scrollHeight);
        
        this.style.height = newHeight + 'px';
        
        // Ativar/desativar botão de envio baseado no conteúdo
        if (this.value.trim()) {
            sendButton.disabled = false;
        } else {
            sendButton.disabled = true;
        }
    });
    
    // Enviar mensagem com Enter (mas permitir Shift+Enter para nova linha)
    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
    
    // Desabilitar botão de envio inicialmente
    sendButton.disabled = true;
    
    // Focar o input quando o chat for aberto
    if (currentSection === 'bem-estar') {
        setTimeout(() => chatInput.focus(), 300);
    }
}

// Seletor de emojis para o chat
function toggleEmojiPicker() {
    // Implementação simples - apenas adiciona alguns emojis comuns
    const emojis = ['😊', '😂', '❤️', '👍', '🙌', '🤔', '😢', '😎', '🎉', '👋'];
    const input = document.getElementById('chatInput');
    
    // Criar ou mostrar o picker de emojis
    let emojiPicker = document.getElementById('emoji-picker');
    
    if (emojiPicker) {
        // Toggle visibilidade
        if (emojiPicker.style.display === 'none') {
            emojiPicker.style.display = 'flex';
        } else {
            emojiPicker.style.display = 'none';
        }
        return;
    }
    
    // Criar o picker se não existir
    emojiPicker = document.createElement('div');
    emojiPicker.id = 'emoji-picker';
    emojiPicker.className = 'emoji-picker';
    
    // Adicionar emojis
    emojis.forEach(emoji => {
        const emojiBtn = document.createElement('button');
        emojiBtn.className = 'emoji-pick-btn';
        emojiBtn.textContent = emoji;
        emojiBtn.onclick = function() {
            input.value += emoji;
            input.dispatchEvent(new Event('input'));
            emojiPicker.style.display = 'none';
        };
        emojiPicker.appendChild(emojiBtn);
    });
    
    // Posicionar e adicionar ao DOM
    const inputContainer = document.querySelector('.input-container');
    inputContainer.appendChild(emojiPicker);
}

// Inicializar a biblioteca de livros
function initializeBookLibrary() {
    // Definir a biblioteca de livros com extratos de obras reais
    bookLibrary = {
        'dom-casmurro': {
            title: 'Dom Casmurro',
            author: 'Machado de Assis',
            excerpt: 'Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao meu lado, falou da Lua e dos ministros, e acabou recitando-me versos. A viagem era curta, e os versos pode ser que não fossem inteiramente maus. Sucedeu, porém, que, como eu estava cansado, fechei os olhos três ou quatro vezes; tanto bastou para que ele interrompesse a leitura e metesse os versos no bolso.',
            fullText: 'https://www.gutenberg.org/files/55752/55752-h/55752-h.htm',
            category: 'classic'
        },
        'o-cortico': {
            title: 'O Cortiço',
            author: 'Aluísio Azevedo',
            excerpt: 'João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro que enriqueceu entre as quatro paredes de uma suja e obscura taverna nos refolhos do bairro do Botafogo; e tanto economizou do pouco que ganhara nessa dúzia de anos, que, ao retirar-se o patrão para a terra, lhe deixou, em pagamento de ordenados vencidos, nem só a venda com o que estava dentro, como ainda um conto e quinhentos em dinheiro.',
            fullText: 'https://www.gutenberg.org/cache/epub/29521/pg29521.txt',
            category: 'classic'
        },
        'memorias-postumas': {
            title: 'Memórias Póstumas de Brás Cubas',
            author: 'Machado de Assis',
            excerpt: 'Algum tempo hesitei se devia abrir estas memórias pelo princípio ou pelo fim, isto é, se poria em primeiro lugar o meu nascimento ou a minha morte. Suposto o uso vulgar seja começar pelo nascimento, duas considerações me levaram a adotar diferente método: a primeira é que eu não sou propriamente um autor defunto, mas um defunto autor, para quem a campa foi outro berço; a segunda é que o escrito ficaria assim mais galante e mais novo.',
            fullText: 'https://www.gutenberg.org/files/54829/54829-h/54829-h.htm',
            category: 'classic'
        },
        'o-alienista': {
            title: 'O Alienista',
            author: 'Machado de Assis',
            excerpt: 'As crônicas da vila de Itaguaí dizem que em tempos remotos vivera ali um certo médico, o Dr. Simão Bacamarte, filho da nobreza da terra e o maior dos médicos do Brasil, de Portugal e das Espanhas. Estudara em Coimbra e Pádua. Aos trinta e quatro anos regressou ao Brasil, não podendo el-rei alcançar dele que ficasse em Coimbra, regendo a universidade, ou em Lisboa, expedindo os negócios da monarquia.',
            fullText: 'https://www.gutenberg.org/files/57935/57935-h/57935-h.htm',
            category: 'classic'
        },
        'a-hora-da-estrela': {
            title: 'A Hora da Estrela',
            author: 'Clarice Lispector',
            excerpt: 'Tudo no mundo começou com um sim. Uma molécula disse sim a outra molécula e nasceu a vida. Mas antes da pré-história havia a pré-história da pré-história e havia o nunca e havia o sim. Sempre houve. Não sei o quê, mas sei que o universo jamais começou.',
            fullText: 'Não disponível no domínio público',
            category: 'contemporary'
        },
        'capitaes-de-areia': {
            title: 'Capitães da Areia',
            author: 'Jorge Amado',
            excerpt: 'Sob a lua, num velho trapiche abandonado, as crianças dormem. Antigamente aqui era o mar. Nas grandes e negras pedras dos alicerces do trapiche as ondas ora se rebentavam fragorosas, ora vinham morrer serenas. A água passava por baixo da ponte sob a qual muitas crianças repousam agora, iluminadas por uma réstia amarela de lua.',
            fullText: 'Não disponível no domínio público',
            category: 'contemporary'
        },
        'sagarana': {
            title: 'Sagarana',
            author: 'Guimarães Rosa',
            excerpt: 'Era um burrinho pedrês, miúdo e resignado, vindo de Passa-Tempo, Conceição do Serro, ou não sei onde no sertão. Chamava-se Sete-de-Ouros, e já fora tão bom, que merecia esse nome, mas agora estava idoso, muito idoso. Tanto, que nem seria preciso abaixar-lhe a maxila teimosa, para espiar os cantos dos dentes.',
            fullText: 'Não disponível no domínio público',
            category: 'contemporary'
        },
        'vidas-secas': {
            title: 'Vidas Secas',
            author: 'Graciliano Ramos',
            excerpt: 'Na planície avermelhada os juazeiros alargavam duas manchas verdes. Os infelizes tinham caminhado o dia inteiro, estavam cansados e famintos. Ordinariamente andavam pouco, mas como haviam repousado bastante na areia do rio seco, a viagem progredira bem três léguas.',
            fullText: 'Não disponível no domínio público',
            category: 'contemporary'
        }
    };
}

// Carregar conteúdo de um livro
function loadBookContent(bookId) {
    if (bookLibrary[bookId]) {
        const book = bookLibrary[bookId];
        setCurrentBook(book.title, book.excerpt, book.author);
        
        // Atualizar interface
        document.getElementById('readButton').disabled = false;
        document.getElementById('readButton').innerHTML = `<i class="fas fa-book-open"></i> Ler ${book.title}`;
    }
}

// Mostrar a aba correspondente na biblioteca de livros
function showLibraryTab(tabId) {
    // Esconder todas as abas
    document.querySelectorAll('.library-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desativar todos os botões
    document.querySelectorAll('.library-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    document.getElementById(tabId).classList.add('active');
    
    // Ativar botão correspondente
    document.querySelector(`.library-tab[onclick="showLibraryTab('${tabId}')"]`).classList.add('active');
}

// Função para definir o livro atual
function setCurrentBook(title, content, author = null) {
    currentBook = { 
        title, 
        content,
        author
    };
    
    // Atualizar interface
    document.getElementById('currentBookTitle').textContent = title;
    document.getElementById('currentBookContent').textContent = content;
    document.getElementById('currentBookCard').classList.remove('hidden');
    
    const readButton = document.getElementById('readButton');
    readButton.disabled = false;
    readButton.innerHTML = `<i class="fas fa-book-open"></i> Ler ${title}`;
    
    // Adicionar autor se disponível
    if (author) {
        document.getElementById('currentBookTitle').innerHTML = `${title} <small>por ${author}</small>`;
    }
}

// Obter sugestão de livro da API Gemini
async function getBookSuggestion(tema = '') {
    // Mostrar estado de carregamento
    document.getElementById('ai-suggestions').innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Buscando sugestões de livros${tema ? ' sobre ' + tema : ''}...</p>
        </div>
    `;
    
    // Construir o prompt para a API
    let prompt = `Sugira 3 livros`;
    if (tema) {
        prompt += ` sobre ${tema}`;
    } else {
        prompt += ` interessantes e variados`;
    }
    
    prompt += ` para um leitor brasileiro. Para cada livro, forneça:
    1. Título
    2. Autor
    3. Uma breve descrição (2-3 frases)
    4. 3 tags que representem temas/gêneros

    Formate a resposta em um JSON estruturado assim:
    [
      {
        "title": "Título do Livro",
        "author": "Nome do Autor",
        "description": "Breve descrição do livro",
        "tags": ["tag1", "tag2", "tag3"]
      },
      ...etc
    ]
    
    Não inclua livros que já estão em minha biblioteca como Dom Casmurro, O Cortiço, Memórias Póstumas de Brás Cubas, O Alienista, A Hora da Estrela, Capitães da Areia, Sagarana ou Vidas Secas.
    Retorne APENAS o JSON, sem texto adicional ou explicações.`;
    
    try {
        // Chamar a API
        const response = await callGeminiAPI(prompt);
        
        // Tentar extrair o JSON da resposta
        let bookSuggestions = [];
        
        try {
            // Procurar por um padrão de JSON na resposta
            const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
            if (jsonMatch) {
                bookSuggestions = JSON.parse(jsonMatch[0]);
            } else {
                // Se não conseguir extrair o JSON, usar o texto como está
                throw new Error('Formato de resposta inválido');
            }
        } catch (error) {
            console.error('Erro ao processar sugestões de livros:', error);
            // Fazer fallback para extração manual
            bookSuggestions = extrairSugestoesLivros(response);
        }
        
        // Armazenar sugestões para uso futuro
        if (bookSuggestions && bookSuggestions.length > 0) {
            renderBookSuggestions(bookSuggestions);
            
            // Se for uma solicitação por voz, ler as sugestões
            if (isListening) {
                let sugestoesFala = 'Aqui estão algumas sugestões de livros para você: ';
                bookSuggestions.forEach((book, index) => {
                    sugestoesFala += `${index + 1}: ${book.title} de ${book.author}. ${book.description}. `;
                });
                speak(sugestoesFala);
            }
            
            // Mostrar a aba de sugestões
            showLibraryTab('sugestoes');
        } else {
            throw new Error('Não foi possível obter sugestões de livros');
        }
    } catch (error) {
        console.error('Erro ao obter sugestões de livros:', error);
        document.getElementById('ai-suggestions').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Não foi possível obter sugestões de livros. Por favor, tente novamente.</p>
                <button class="btn btn-primary" onclick="getBookSuggestion('${tema}')">Tentar Novamente</button>
            </div>
        `;
        
        if (isListening) {
            speak('Desculpe, não consegui obter sugestões de livros neste momento. Por favor, tente novamente mais tarde.');
        }
    }
}

// Renderizar sugestões de livros
function renderBookSuggestions(suggestions) {
    let html = '';
    
    suggestions.forEach(book => {
        html += `
            <div class="ai-suggestion-card">
                <h4>${book.title}</h4>
                <div class="author">${book.author}</div>
                <div class="description">${book.description}</div>
                <div class="tags">
                    ${book.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="load-button" onclick="loadSuggestedBook('${book.title}', '${book.author}')">
                    <i class="fas fa-book-reader"></i> Ler Amostra
                </button>
            </div>
        `;
    });
    
    document.getElementById('ai-suggestions').innerHTML = html;
}

// Carregar um livro sugerido pela IA
async function loadSuggestedBook(title, author) {
    // Mostrar estado de carregamento
    document.getElementById('currentBookTitle').innerHTML = `${title} <small>por ${author}</small>`;
    document.getElementById('currentBookContent').innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Carregando amostra do livro...</div>`;
    document.getElementById('currentBookCard').classList.remove('hidden');
    
    try {
        // Solicitar uma amostra do livro à API
        const prompt = `Gere uma amostra de 3 parágrafos do livro "${title}" de ${author}. A amostra deve capturar a essência e o estilo da obra. Se este não é um livro real, crie uma amostra de como o livro poderia ser, mantendo o estilo do autor. Retorne apenas o texto da amostra, sem comentários adicionais.`;
        
        const response = await callGeminiAPI(prompt);
        
        // Definir o livro atual
        setCurrentBook(title, response, author);
        
        // Ativar botão de leitura
        const readButton = document.getElementById('readButton');
        readButton.disabled = false;
        readButton.innerHTML = `<i class="fas fa-book-open"></i> Ler ${title}`;
        
    } catch (error) {
        console.error('Erro ao carregar amostra do livro:', error);
        document.getElementById('currentBookContent').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Não foi possível carregar a amostra deste livro. Por favor, tente novamente.</p>
            </div>
        `;
    }
}

// Extrair sugestões de livros do texto quando o formato JSON não é encontrado
function extrairSugestoesLivros(texto) {
    const sugestoes = [];
    
    // Expressões regulares para encontrar padrões no texto
    const tituloRegex = /[Tt]ítulo:?\s*([^\n]+)/;
    const autorRegex = /[Aa]utor(?:\(a\))?:?\s*([^\n]+)/;
    const descricaoRegex = /[Dd]escrição:?\s*([^\n]+(?:\n[^\n•*]+)*)/;
    
    // Dividir o texto em blocos (um bloco por livro)
    const blocos = texto.split(/\d+\.\s*/).filter(b => b.trim());
    
    blocos.forEach(bloco => {
        const tituloMatch = bloco.match(tituloRegex);
        const autorMatch = bloco.match(autorRegex);
        const descricaoMatch = bloco.match(descricaoRegex);
        
        // Extrair tags (qualquer palavra após hashtag ou entre colchetes)
        const tags = [];
        const tagsMatches = bloco.match(/#(\w+)/g) || [];
        tagsMatches.forEach(tag => tags.push(tag.substring(1)));
        
        // Alternativa: procurar por tags listadas explicitamente
        const tagsListMatch = bloco.match(/[Tt]ags:?\s*([^\n]+)/);
        if (tagsListMatch) {
            const tagsList = tagsListMatch[1].split(/,|\|/);
            tagsList.forEach(tag => tags.push(tag.trim()));
        }
        
        // Se não encontrar tags, tentar gerar algumas com base nas palavras-chave do texto
        if (tags.length === 0) {
            const palavrasChave = ['romance', 'aventura', 'drama', 'ficção', 'não-ficção', 'autoajuda', 'biografia', 'histórico', 'mistério', 'fantasia', 'terror', 'juvenil'];
            palavrasChave.forEach(palavra => {
                if (bloco.toLowerCase().includes(palavra.toLowerCase()) && !tags.includes(palavra)) {
                    tags.push(palavra);
                }
            });
        }
        
        // Preencher com tags genéricas se necessário
        while (tags.length < 3) {
            const tagsPadroes = ['literatura', 'leitura', 'livro'];
            for (const tag of tagsPadroes) {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                    break;
                }
            }
        }
        
        // Limitar a 3 tags
        const tagsFinais = tags.slice(0, 3);
        
        if (tituloMatch || autorMatch) {
            sugestoes.push({
                title: tituloMatch ? tituloMatch[1].trim() : 'Título Desconhecido',
                author: autorMatch ? autorMatch[1].trim() : 'Autor Desconhecido',
                description: descricaoMatch ? descricaoMatch[1].trim() : 'Sem descrição disponível',
                tags: tagsFinais
            });
        }
    });
    
    // Se ainda não temos sugestões suficientes, criar algumas genéricas
    if (sugestoes.length < 2) {
        sugestoes.push({
            title: 'O Alquimista',
            author: 'Paulo Coelho',
            description: 'Um pastor andaluz que viaja em busca de um tesouro. Uma jornada de autodescoberta e sabedoria.',
            tags: ['Filosofia', 'Aventura', 'Inspiração']
        });
        
        if (sugestoes.length < 3) {
            sugestoes.push({
                title: 'Ensaio sobre a Cegueira',
                author: 'José Saramago',
                description: 'Uma epidemia de cegueira revela o melhor e o pior da humanidade neste clássico contemporâneo.',
                tags: ['Distopia', 'Alegoria', 'Literatura']
            });
        }
    }
    
    return sugestoes;
}

// Expandir um tema para mostrar mais livros
function expandTheme(theme) {
    currentExpandedTheme = theme;
    
    // Definir o título do tema
    let themeTitle = '';
    switch(theme) {
        case 'romance':
            themeTitle = 'Romance';
            break;
        case 'realismo':
            themeTitle = 'Realismo Social';
            break;
        case 'psicologica':
            themeTitle = 'Literatura Psicológica';
            break;
    }
    
    document.getElementById('expanded-theme-title').textContent = themeTitle;
    
    // Carregar livros do tema
    loadThemeBooks(theme, 'all');
    
    // Mostrar o componente de tema expandido
    document.getElementById('expanded-theme').classList.add('active');
    
    // Configurar ouvintes de eventos para os botões de subtemas
    const subtitleButtons = document.querySelectorAll('.subtitle-btn');
    subtitleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            subtitleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Carregar livros do subtema selecionado
            const subtitle = this.getAttribute('data-subtitle');
            loadThemeBooks(theme, subtitle);
        });
    });
}

// Carregar livros por tema e subtema
function loadThemeBooks(theme, subtitle) {
    // Definir os livros por tema e subtema
    const themeBooks = {
        'romance': {
            'all': [
                { id: 'grande-sertao', title: 'Grande Sertão: Veredas', author: 'Guimarães Rosa', tags: ['Regionalismo', 'Sertão', 'Existencial'], subtitle: 'classicos' },
                { id: 'iracema', title: 'Iracema', author: 'José de Alencar', tags: ['Indianismo', 'Romantismo', 'Nacional'], subtitle: 'classicos' },
                { id: 'quincas-borba', title: 'Quincas Borba', author: 'Machado de Assis', tags: ['Realismo', 'Sociedade', 'Filosofia'], subtitle: 'classicos' },
                { id: 'amor-de-perdição', title: 'Amor de Perdição', author: 'Camilo Castelo Branco', tags: ['Drama', 'Trágico', 'Romântico'], subtitle: 'internacionais' },
                { id: 'orgulho-preconceito', title: 'Orgulho e Preconceito', author: 'Jane Austen', tags: ['Clássico', 'Costumes', 'Sociedade'], subtitle: 'internacionais' },
                { id: 'cem-anos-solidao', title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', tags: ['Realismo Mágico', 'Família', 'Saga'], subtitle: 'internacionais' }
            ],
            'classicos': [
                { id: 'grande-sertao', title: 'Grande Sertão: Veredas', author: 'Guimarães Rosa', tags: ['Regionalismo', 'Sertão', 'Existencial'], subtitle: 'classicos' },
                { id: 'iracema', title: 'Iracema', author: 'José de Alencar', tags: ['Indianismo', 'Romantismo', 'Nacional'], subtitle: 'classicos' },
                { id: 'quincas-borba', title: 'Quincas Borba', author: 'Machado de Assis', tags: ['Realismo', 'Sociedade', 'Filosofia'], subtitle: 'classicos' },
                { id: 'senhora', title: 'Senhora', author: 'José de Alencar', tags: ['Sociedade', 'Romantismo', 'Crítica'], subtitle: 'classicos' }
            ],
            'contemporaneos': [
                { id: 'feliz-ano-velho', title: 'Feliz Ano Velho', author: 'Marcelo Rubens Paiva', tags: ['Autobiografia', 'Superação', 'Drama'], subtitle: 'contemporaneos' },
                { id: 'estorvo', title: 'Estorvo', author: 'Chico Buarque', tags: ['Urbano', 'Identidade', 'Confusão'], subtitle: 'contemporaneos' }
            ],
            'internacionais': [
                { id: 'amor-de-perdição', title: 'Amor de Perdição', author: 'Camilo Castelo Branco', tags: ['Drama', 'Trágico', 'Romântico'], subtitle: 'internacionais' },
                { id: 'orgulho-preconceito', title: 'Orgulho e Preconceito', author: 'Jane Austen', tags: ['Clássico', 'Costumes', 'Sociedade'], subtitle: 'internacionais' },
                { id: 'cem-anos-solidao', title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', tags: ['Realismo Mágico', 'Família', 'Saga'], subtitle: 'internacionais' }
            ]
        },
        'realismo': {
            'all': [
                { id: 'o-cortico', title: 'O Cortiço', author: 'Aluísio Azevedo', tags: ['Naturalismo', 'Social', 'Urbano'], subtitle: 'classicos' },
                { id: 'vidas-secas', title: 'Vidas Secas', author: 'Graciliano Ramos', tags: ['Regionalismo', 'Seca', 'Miséria'], subtitle: 'classicos' },
                { id: 'o-primo-basilio', title: 'O Primo Basílio', author: 'Eça de Queirós', tags: ['Adultério', 'Burguesia', 'Portugal'], subtitle: 'internacionais' },
                { id: 'germinal', title: 'Germinal', author: 'Émile Zola', tags: ['Trabalhadores', 'Minas', 'Revolução'], subtitle: 'internacionais' }
            ],
            'classicos': [
                { id: 'o-cortico', title: 'O Cortiço', author: 'Aluísio Azevedo', tags: ['Naturalismo', 'Social', 'Urbano'], subtitle: 'classicos' },
                { id: 'vidas-secas', title: 'Vidas Secas', author: 'Graciliano Ramos', tags: ['Regionalismo', 'Seca', 'Miséria'], subtitle: 'classicos' },
                { id: 'o-mulato', title: 'O Mulato', author: 'Aluísio Azevedo', tags: ['Preconceito', 'Sociedade', 'Racismo'], subtitle: 'classicos' }
            ],
            'contemporaneos': [
                { id: 'cidade-de-deus', title: 'Cidade de Deus', author: 'Paulo Lins', tags: ['Violência', 'Favela', 'Rio de Janeiro'], subtitle: 'contemporaneos' },
                { id: 'capitaes-de-areia', title: 'Capitães da Areia', author: 'Jorge Amado', tags: ['Crianças', 'Marginalidade', 'Bahia'], subtitle: 'contemporaneos' }
            ],
            'internacionais': [
                { id: 'o-primo-basilio', title: 'O Primo Basílio', author: 'Eça de Queirós', tags: ['Adultério', 'Burguesia', 'Portugal'], subtitle: 'internacionais' },
                { id: 'germinal', title: 'Germinal', author: 'Émile Zola', tags: ['Trabalhadores', 'Minas', 'Revolução'], subtitle: 'internacionais' },
                { id: 'crime-castigo', title: 'Crime e Castigo', author: 'Fiódor Dostoiévski', tags: ['Psicológico', 'Moral', 'Rússia'], subtitle: 'internacionais' }
            ]
        },
        'psicologica': {
            'all': [
                { id: 'dom-casmurro', title: 'Dom Casmurro', author: 'Machado de Assis', tags: ['Ciúme', 'Dúvida', 'Memória'], subtitle: 'classicos' },
                { id: 'a-hora-da-estrela', title: 'A Hora da Estrela', author: 'Clarice Lispector', tags: ['Solidão', 'Identidade', 'Nordestina'], subtitle: 'contemporaneos' },
                { id: 'o-alienista', title: 'O Alienista', author: 'Machado de Assis', tags: ['Loucura', 'Ciência', 'Poder'], subtitle: 'classicos' },
                { id: 'o-processo', title: 'O Processo', author: 'Franz Kafka', tags: ['Absurdo', 'Burocracia', 'Angústia'], subtitle: 'internacionais' },
                { id: 'crime-castigo', title: 'Crime e Castigo', author: 'Fiódor Dostoiévski', tags: ['Culpa', 'Redenção', 'Moral'], subtitle: 'internacionais' }
            ],
            'classicos': [
                { id: 'dom-casmurro', title: 'Dom Casmurro', author: 'Machado de Assis', tags: ['Ciúme', 'Dúvida', 'Memória'], subtitle: 'classicos' },
                { id: 'o-alienista', title: 'O Alienista', author: 'Machado de Assis', tags: ['Loucura', 'Ciência', 'Poder'], subtitle: 'classicos' },
                { id: 'memorias-postumas', title: 'Memórias Póstumas de Brás Cubas', author: 'Machado de Assis', tags: ['Morte', 'Ironia', 'Filosofia'], subtitle: 'classicos' }
            ],
            'contemporaneos': [
                { id: 'a-hora-da-estrela', title: 'A Hora da Estrela', author: 'Clarice Lispector', tags: ['Solidão', 'Identidade', 'Nordestina'], subtitle: 'contemporaneos' },
                { id: 'a-paixao-segundo-gh', title: 'A Paixão Segundo G.H.', author: 'Clarice Lispector', tags: ['Existencialismo', 'Identidade', 'Epifania'], subtitle: 'contemporaneos' }
            ],
            'internacionais': [
                { id: 'o-processo', title: 'O Processo', author: 'Franz Kafka', tags: ['Absurdo', 'Burocracia', 'Angústia'], subtitle: 'internacionais' },
                { id: 'crime-castigo', title: 'Crime e Castigo', author: 'Fiódor Dostoiévski', tags: ['Culpa', 'Redenção', 'Moral'], subtitle: 'internacionais' },
                { id: 'o-estrangeiro', title: 'O Estrangeiro', author: 'Albert Camus', tags: ['Absurdo', 'Existencialismo', 'Indiferença'], subtitle: 'internacionais' }
            ]
        }
    };
    
    // Selecionar os livros do tema e subtema
    let books = [];
    if (themeBooks[theme] && themeBooks[theme][subtitle]) {
        books = themeBooks[theme][subtitle];
    }
    
    // Renderizar os livros
    const expandedBooksContainer = document.getElementById('expanded-books');
    let html = '';
    
    if (books.length === 0) {
        html = '<p class="no-books">Nenhum livro encontrado para esta categoria.</p>';
    } else {
        books.forEach(book => {
            html += `
                <div class="expanded-book" onclick="openReaderMode('${book.id}')">
                    <div class="book-cover">
                        <i class="fas fa-book"></i>
                    </div>
                    <h4>${book.title}</h4>
                    <p>${book.author}</p>
                    <div class="book-tags">
                        ${book.tags.map(tag => `<span class="book-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
        });
    }
    
    expandedBooksContainer.innerHTML = html;
}

// Fechar o tema expandido
function closeExpandedTheme() {
    document.getElementById('expanded-theme').classList.remove('active');
}

// Mudar página na biblioteca
function changePage(category, pageNum) {
    // Armazenar a página atual
    currentPage[category] = pageNum;
    
    // Dados dos livros por categoria e página
    const booksData = {
        'classics': {
            1: [
                { id: 'dom-casmurro', title: 'Dom Casmurro', author: 'Machado de Assis' },
                { id: 'o-cortico', title: 'O Cortiço', author: 'Aluísio Azevedo' },
                { id: 'memorias-postumas', title: 'Memórias Póstumas de Brás Cubas', author: 'Machado de Assis' },
                { id: 'o-alienista', title: 'O Alienista', author: 'Machado de Assis' }
            ],
            2: [
                { id: 'iracema', title: 'Iracema', author: 'José de Alencar' },
                { id: 'quincas-borba', title: 'Quincas Borba', author: 'Machado de Assis' },
                { id: 'o-guarani', title: 'O Guarani', author: 'José de Alencar' },
                { id: 'a-moreninha', title: 'A Moreninha', author: 'Joaquim Manuel de Macedo' }
            ]
        },
        'contemporaneos': {
            1: [
                { id: 'a-hora-da-estrela', title: 'A Hora da Estrela', author: 'Clarice Lispector' },
                { id: 'capitaes-de-areia', title: 'Capitães da Areia', author: 'Jorge Amado' },
                { id: 'sagarana', title: 'Sagarana', author: 'Guimarães Rosa' },
                { id: 'vidas-secas', title: 'Vidas Secas', author: 'Graciliano Ramos' }
            ],
            2: [
                { id: 'grande-sertao', title: 'Grande Sertão: Veredas', author: 'Guimarães Rosa' },
                { id: 'macunaima', title: 'Macunaíma', author: 'Mário de Andrade' },
                { id: 'feliz-ano-velho', title: 'Feliz Ano Velho', author: 'Marcelo Rubens Paiva' },
                { id: 'agosto', title: 'Agosto', author: 'Rubem Fonseca' }
            ]
        }
    };
    
    // Buscar livros da categoria e página
    const books = booksData[category][pageNum];
    
    // Atualizar a grade de livros
    const booksGrid = document.querySelector(`#${category} .books-grid`);
    let html = '';
    
    books.forEach(book => {
        html += `
            <div class="library-book" onclick="loadBookContent('${book.id}')">
                <div class="book-cover">
                    <i class="fas fa-book"></i>
                </div>
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>
        `;
    });
    
    booksGrid.innerHTML = html;
    
    // Atualizar informações de paginação
    const totalPages = Object.keys(booksData[category]).length;
    const paginationInfo = document.querySelector(`#${category} .pagination span`);
    paginationInfo.textContent = `Página ${pageNum} de ${totalPages}`;
    
    // Configurar estados dos botões de paginação
    const previousBtn = document.querySelector(`#${category} .pagination-btn:first-child`);
    const nextBtn = document.querySelector(`#${category} .pagination-btn:last-child`);
    
    previousBtn.disabled = (pageNum === 1);
    previousBtn.onclick = pageNum > 1 ? () => changePage(category, pageNum - 1) : null;
    
    nextBtn.disabled = (pageNum === totalPages);
    nextBtn.onclick = pageNum < totalPages ? () => changePage(category, pageNum + 1) : null;
}

// Abrir o modo de leitura
function openReaderMode(bookId) {
    // Fechar a tela de tema expandido
    closeExpandedTheme();
    
    // Buscar informações do livro
    let bookInfo = {};
    for (const id in bookLibrary) {
        if (id === bookId) {
            bookInfo = bookLibrary[id];
            break;
        }
    }
    
    // Se não encontrar na biblioteca principal, buscar nos livros antigos
    if (!bookInfo.title) {
        for (const title in books) {
            if (title.replace(/\s+/g, '-').toLowerCase() === bookId) {
                bookInfo = {
                    title: title,
                    excerpt: books[title],
                    author: 'Autor Clássico'
                };
                break;
            }
        }
    }
    
    // Se ainda não encontrar, carregar um livro de amostra
    if (!bookInfo.title) {
        // Solicitar conteúdo à API (simulação)
        loadSampleBookContent(bookId);
        return;
    }
    
    // Configurar o modo de leitura
    document.getElementById('reader-book-title').textContent = bookInfo.title;
    document.getElementById('reader-book-author').textContent = bookInfo.author;
    
    // Inicializar capítulos
    totalChapters = 5;  // Exemplo - na implementação real seria o número real de capítulos
    currentChapter = 1;
    
    // Carregar o conteúdo do capítulo atual
    loadChapterContent(bookId, currentChapter);
    
    // Configurar a barra de progresso
    document.getElementById('chapter-progress').min = 1;
    document.getElementById('chapter-progress').max = totalChapters;
    document.getElementById('chapter-progress').value = currentChapter;
    document.getElementById('current-chapter').textContent = `Capítulo ${currentChapter}`;
    
    // Mostrar o modo de leitura
    document.getElementById('reader-mode').classList.add('active');
}

// Carregar conteúdo de um capítulo
async function loadChapterContent(bookId, chapter) {
    const readerContent = document.getElementById('reader-content');
    
    // Mostrar estado de carregamento
    readerContent.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Carregando capítulo...</div>';
    
    try {
        // Se for um livro da biblioteca principal, usar o conteúdo armazenado
        for (const id in bookLibrary) {
            if (id === bookId) {
                const book = bookLibrary[id];
                
                // Para demonstração, estamos usando o mesmo trecho para todos os capítulos
                // Na implementação real, carregaríamos capítulos diferentes
                const chapterContent = formatChapterContent(book.excerpt, chapter);
                readerContent.innerHTML = chapterContent;
                return;
            }
        }
        
        // Se não encontrar na biblioteca, solicitar à API
        const prompt = `Gere o conteúdo completo do capítulo ${chapter} do livro com ID '${bookId}'. O conteúdo deve ser detalhado e ter pelo menos 3 parágrafos longos, totalizando cerca de 500 palavras. Se este não é um livro real conhecido, crie um conteúdo ficcional adequado ao título.`;
        
        const response = await callGeminiAPI(prompt);
        
        // Formatar o conteúdo do capítulo
        const chapterContent = formatChapterContent(response, chapter);
        readerContent.innerHTML = chapterContent;
        
    } catch (error) {
        console.error('Erro ao carregar conteúdo do capítulo:', error);
        readerContent.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Não foi possível carregar o capítulo. Por favor, tente novamente.</p>
                <button class="btn btn-primary" onclick="loadChapterContent('${bookId}', ${chapter})">Tentar Novamente</button>
            </div>
        `;
    }
}

// Formatar o conteúdo do capítulo
function formatChapterContent(content, chapter) {
    // Adicionar cabeçalho do capítulo
    let formattedContent = `<h2>Capítulo ${chapter}</h2>`;
    
    // Dividir o conteúdo em parágrafos
    const paragraphs = content.split('\n\n');
    
    // Adicionar cada parágrafo
    paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
            formattedContent += `<p>${paragraph.trim()}</p>`;
        }
    });
    
    return formattedContent;
}

// Carregar livro de amostra para um ID específico
async function loadSampleBookContent(bookId) {
    const readerBookTitle = document.getElementById('reader-book-title');
    const readerBookAuthor = document.getElementById('reader-book-author');
    
    // Mostrar estado de carregamento
    readerBookTitle.textContent = 'Carregando...';
    readerBookAuthor.textContent = '';
    document.getElementById('reader-content').innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Carregando informações do livro...</div>';
    
    try {
        // Extrair título e autor do bookId
        const bookParts = bookId.split('-');
        const possibleTitle = bookParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
        
        // Solicitar informações do livro à API
        const promptInfo = `Gere informações sobre um livro chamado "${possibleTitle}" (ou similar a esse título). Forneça:
        1. Título completo e correto
        2. Nome do autor
        3. Ano de publicação (aproximado se não for um livro real)
        4. Gênero literário principal
        
        Formate a resposta em um JSON assim:
        {
          "title": "Título do Livro",
          "author": "Nome do Autor",
          "year": XXXX,
          "genre": "Gênero"
        }
        
        Retorne APENAS o JSON, sem texto adicional.`;
        
        const responseInfo = await callGeminiAPI(promptInfo);
        
        // Extrair JSON da resposta
        let bookInfo = {};
        try {
            const jsonMatch = responseInfo.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                bookInfo = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Formato de resposta inválido');
            }
        } catch (error) {
            console.error('Erro ao processar informações do livro:', error);
            bookInfo = {
                title: possibleTitle,
                author: 'Autor Desconhecido',
                year: 'Ano desconhecido',
                genre: 'Literatura'
            };
        }
        
        // Atualizar informações do livro
        readerBookTitle.textContent = bookInfo.title;
        readerBookAuthor.textContent = `${bookInfo.author} (${bookInfo.year}) - ${bookInfo.genre}`;
        
        // Inicializar capítulos
        totalChapters = 5;  // Para demonstração
        currentChapter = 1;
        
        // Carregar o conteúdo do capítulo atual
        loadChapterContent(bookId, currentChapter);
        
        // Configurar a barra de progresso
        document.getElementById('chapter-progress').min = 1;
        document.getElementById('chapter-progress').max = totalChapters;
        document.getElementById('chapter-progress').value = currentChapter;
        document.getElementById('current-chapter').textContent = `Capítulo ${currentChapter}`;
        
        // Mostrar o modo de leitura
        document.getElementById('reader-mode').classList.add('active');
        
    } catch (error) {
        console.error('Erro ao carregar amostra do livro:', error);
        document.getElementById('reader-content').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Não foi possível carregar informações deste livro. Por favor, tente novamente.</p>
            </div>
        `;
    }
}

// Navegar para o próximo capítulo
function nextChapter() {
    if (currentChapter < totalChapters) {
        currentChapter++;
        const bookId = getCurrentBookId();
        loadChapterContent(bookId, currentChapter);
        
        // Atualizar informações de capítulo
        document.getElementById('chapter-progress').value = currentChapter;
        document.getElementById('current-chapter').textContent = `Capítulo ${currentChapter}`;
    }
}

// Navegar para o capítulo anterior
function previousChapter() {
    if (currentChapter > 1) {
        currentChapter--;
        const bookId = getCurrentBookId();
        loadChapterContent(bookId, currentChapter);
        
        // Atualizar informações de capítulo
        document.getElementById('chapter-progress').value = currentChapter;
        document.getElementById('current-chapter').textContent = `Capítulo ${currentChapter}`;
    }
}

// Pular para um capítulo específico
function jumpToChapter(chapterNum) {
    currentChapter = parseInt(chapterNum);
    const bookId = getCurrentBookId();
    loadChapterContent(bookId, currentChapter);
    
    // Atualizar informação de capítulo
    document.getElementById('current-chapter').textContent = `Capítulo ${currentChapter}`;
}

// Obter o ID do livro atual
function getCurrentBookId() {
    // Esta é uma implementação simplificada
    // Na prática, o ID do livro seria armazenado ao abrir o modo de leitura
    return 'current-book-id';
}

// Fechar o modo de leitura
function closeReaderMode() {
    document.getElementById('reader-mode').classList.remove('active');
}

// Ajustar o tamanho da fonte
function adjustFontSize(delta) {
    currentFontSize += delta * 0.1;
    
    // Limitar o tamanho da fonte entre 0.8 e 1.6rem
    if (currentFontSize < 0.8) currentFontSize = 0.8;
    if (currentFontSize > 1.6) currentFontSize = 1.6;
    
    document.getElementById('reader-content').style.fontSize = `${currentFontSize}rem`;
}

// Alternar modo escuro
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const readerContent = document.getElementById('reader-content');
    
    if (isDarkMode) {
        readerContent.classList.add('dark-mode');
    } else {
        readerContent.classList.remove('dark-mode');
    }
}

// Ler em voz alta
function readAloud() {
    if (!synthesis) {
        alert('Síntese de voz não suportada neste navegador.');
        return;
    }
    
    // Se já estiver lendo, parar
    if (synthesis.speaking) {
        synthesis.cancel();
        return;
    }
    
    // Obter o texto do conteúdo do leitor
    const readerContent = document.getElementById('reader-content');
    const text = readerContent.textContent;
    
    // Criar e configurar o objeto de fala
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    
    // Iniciar a leitura
    synthesis.speak(utterance);
}

// Adicionar marcador na posição atual
function bookmarkCurrentPosition() {
    // Aqui seria implementada a lógica para salvar a posição atual
    const bookTitle = document.getElementById('reader-book-title').textContent;
    alert(`Marcador adicionado para "${bookTitle}" no Capítulo ${currentChapter}.`);
}