# Libraey API

API RESTful para a plataforma Social Library utilizando o framework Spark Java.

## Requisitos

- Java 11 ou superior
- Maven

## Instalação

### Instalando o Maven (caso não tenha instalado)

#### Windows
1. Baixe o Maven do site oficial: https://maven.apache.org/download.cgi
2. Extraia o arquivo baixado para um diretório (ex: C:\Program Files\Maven)
3. Adicione o diretório bin do Maven ao PATH do sistema:
   - Painel de Controle > Sistema > Configurações avançadas do sistema > Variáveis de Ambiente
   - Em Variáveis do Sistema, encontre e edite a variável PATH
   - Adicione o caminho para o diretório bin do Maven (ex: C:\Program Files\Maven\bin)
4. Verifique a instalação abrindo um novo prompt de comando e digitando: `mvn -version`

#### Linux/Mac
```bash
# No Ubuntu/Debian
sudo apt install maven

# No Mac com Homebrew
brew install maven
```

## Executando o projeto

### Método 1: Usando Maven
1. Clone este repositório
2. Navegue até a pasta do projeto
3. Execute o comando:

```bash
mvn clean package
java -jar target/libraey-api-1.0-SNAPSHOT.jar
```

### Método 2: Sem Maven (mais fácil)
1. Clone este repositório
2. Navegue até a pasta do projeto
3. Execute o script apropriado para seu sistema:

**Windows (usando PowerShell):**
```
ExecutarAPI.bat
```

**Windows (usando wget):**
```
ExecutarAPIWget.bat
```
Nota: Para o script com wget, você precisa ter o wget instalado. Baixe em: https://eternallybored.org/misc/wget/

**Linux/Mac:**
```bash
chmod +x ExecutarAPI.sh
./ExecutarAPI.sh
```

Este método baixará automaticamente todas as dependências necessárias.

O servidor será iniciado na porta 4567.

## Endpoints da API

### Livros

- `GET /api/books` - Listar todos os livros
- `GET /api/books/:id` - Obter um livro específico
- `POST /api/books` - Adicionar um novo livro
- `PUT /api/books/:id` - Atualizar um livro existente
- `DELETE /api/books/:id` - Excluir um livro

### Livros Infantis

- `GET /api/kidsbooks` - Listar todos os livros infantis
- `GET /api/kidsbooks/:id` - Obter um livro infantil específico
- `POST /api/kidsbooks` - Adicionar um novo livro infantil
- `PUT /api/kidsbooks/:id` - Atualizar um livro infantil existente
- `DELETE /api/kidsbooks/:id` - Excluir um livro infantil

### Recomendações de Livros

- `GET /api/recommendations` - Listar todos os estados emocionais
- `GET /api/recommendations/:state` - Obter recomendações para um estado emocional específico
- `POST /api/recommendations/:state` - Adicionar uma recomendação a um estado emocional
- `POST /api/recommendations` - Adicionar novos estados emocionais com recomendações
- `DELETE /api/recommendations/:state/:index` - Excluir uma recomendação de um estado emocional

### Idiomas

- `GET /api/languages` - Listar todos os idiomas
- `GET /api/languages/:id` - Obter um idioma específico
- `POST /api/languages` - Adicionar um novo idioma
- `PUT /api/languages/:id` - Atualizar um idioma existente
- `DELETE /api/languages/:id` - Excluir um idioma

## Exemplos de uso

### Obter todos os livros

```
GET /api/books
```

Resposta:

```json
[
  {
    "id": "dom-casmurro",
    "title": "dom casmurro",
    "content": "Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu..."
  },
  {
    "id": "o-cortico",
    "title": "o cortiço",
    "content": "João Romão foi, dos treze aos vinte e cinco anos, empregado de um vendeiro que enriqueceu entre as quatro paredes de uma suja e obscura taverna nos refolhos do bairro do Botafogo..."
  }
]
```

### Adicionar um novo livro

```
POST /api/books
```

Corpo da requisição:

```json
{
  "title": "Grande Sertão: Veredas",
  "content": "Nonada. Tiros que o senhor ouviu foram de briga de homem não, Deus esteja..."
}
```

Resposta:

```json
{
  "message": "Book added successfully"
}
``` 