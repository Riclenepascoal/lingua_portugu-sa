package pratica_java_13;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;

class Book {
    private String id, title, author, category;
    private int year;
    private boolean available, audio, braille, largePrint;

    public Book(String id, String title, String author, int year, String category, boolean available, boolean audio, boolean braille, boolean largePrint) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.category = category;
        this.available = available;
        this.audio = audio;
        this.braille = braille;
        this.largePrint = largePrint;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getCategory() { return category; }
    public int getPages() { return 100; } // Placeholder
    public boolean isAvailable() { return available; }
    public boolean hasAudio() { return audio; }
    public boolean hasBraille() { return braille; }
    public boolean hasLargePrint() { return largePrint; }
    public void setAvailable(boolean available) { this.available = available; }
    @Override
    public String toString() { return id + ": " + title + " by " + author + " (" + category + ")"; }
}

class Credential {
    private String username, password;

    public Credential(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }
    public String getPassword() { return password; }
}

class Loan {
    private User user;
    private Book book;
    private LocalDate loanDate, dueDate, returnDate;

    public Loan(User user, Book book) {
        this.user = user;
        this.book = book;
        this.loanDate = LocalDate.now();
        this.dueDate = loanDate.plusDays(SocialLibrary.LOAN_DAYS);
    }

    public User getUser() { return user; }
    public Book getBook() { return book; }
    public LocalDate getLoanDate() { return loanDate; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDate getReturnDate() { return returnDate; }
    public void markAsReturned() { this.returnDate = LocalDate.now(); }
    @Override
    public String toString() { return "Loan: " + book.getTitle() + " to " + user.getName() + " due " + dueDate; }
}

class User {
    private String id, name, ageGroup, disability;

    public User(String id, String name, String ageGroup, String disability) {
        this.id = id;
        this.name = name;
        this.ageGroup = ageGroup;
        this.disability = disability;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getAgeGroup() { return ageGroup; }
    public boolean hasDisability(String type) { return disability.equalsIgnoreCase(type); }
    @Override
    public String toString() { return id + ": " + name + " (" + ageGroup + ", " + disability + ")"; }
}

public class SocialLibrary {
    private HashMap<String, Book> catalog;
    private ArrayList<User> users;
    private ArrayList<Loan> loans;
    private Scanner scanner;
    private List<Credential> credentials = new ArrayList<>();
    private static final String CREDENTIALS_FILE = "credentials.txt";
    public static final int LOAN_DAYS = 14;

    public SocialLibrary() {
        catalog = new HashMap<>();
        users = new ArrayList<>();
        loans = new ArrayList<>();
        scanner = new Scanner(System.in);
        loadCredentials();
        initializeData();
    }

    public SocialLibrary(ArrayList<Credential> credentials, ArrayList<Loan> loans) {
        this.credentials = credentials;
        this.loans = loans;
        catalog = new HashMap<>();
        users = new ArrayList<>();
        scanner = new Scanner(System.in);
        loadCredentials();
        initializeData();
    }

    public SocialLibrary(HashMap<String, Book> catalog, ArrayList<Credential> credentials, ArrayList<Loan> loans, Scanner scanner, ArrayList<User> users) {
        this.catalog = catalog;
        this.credentials = credentials;
        this.loans = loans;
        this.scanner = scanner;
        this.users = users;
    }

    private void initializeData() {
        addBook(new Book("B001", "O Pequeno Príncipe", "Antoine de Saint-Exupéry", 1943, "Infantil", true, true, false, false));
        addBook(new Book("B002", "Harry Potter e a Pedra Filosofal", "J.K. Rowling", 1997, "Juvenil", true, false, true, false));
        addBook(new Book("B003", "A Revolução dos Bichos", "George Orwell", 1945, "Adulto", false, true, false, false));
        addBook(new Book("B004", "O Livro dos Abraços", "Eduardo Galeano", 1989, "Adulto", true, false, true, false));

        users.add(new User("U001", "João Silva", "child", "visual"));
        users.add(new User("U002", "Maria Souza", "senior", "mobility"));
        users.add(new User("U003", "Pedro Oliveira", "adult", "none"));
    }

    private void addBook(Book book) {
        catalog.put(book.getId(), book);
    }

    private void loadCredentials() {
        File file = new File(CREDENTIALS_FILE);
        if (!file.exists()) {
            credentials.add(new Credential("admin", "1234"));
            credentials.add(new Credential("user", "abcd"));
            saveCredentials();
            return;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(":");
                if (parts.length == 2) {
                    credentials.add(new Credential(parts[0], parts[1]));
                }
            }
        } catch (IOException e) {
            System.out.println("Erro ao carregar credenciais: " + e.getMessage());
        }
    }

    private void saveCredentials() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(CREDENTIALS_FILE))) {
            for (Credential cred : credentials) {
                writer.write(cred.getUsername() + ":" + cred.getPassword());
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("Erro ao salvar credenciais: " + e.getMessage());
        }
    }

    private boolean isValidPassword(String password) {
        if (password.length() < 8) return false;
        boolean hasUpperCase = false, hasNumber = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpperCase = true;
            if (Character.isDigit(c)) hasNumber = true;
        }
        return hasUpperCase && hasNumber;
    }

    public void start() {
        System.out.println("🐾 Bem-vindo à Social Library! 🐾");
        System.out.println("Biblioteca Inteligente e Inclusiva");

        int loginAttempts = 0;
        final int MAX_ATTEMPTS = 3;

        OUTER:
        while (loginAttempts < MAX_ATTEMPTS) {
            System.out.println("\n=== TELA DE LOGIN ===");
            System.out.println("1. Fazer Login");
            System.out.println("2. Criar Conta");
            System.out.print("Escolha uma opção (1-2): ");
            int loginChoice = scanner.nextInt();
            scanner.nextLine();
            switch (loginChoice) {
                case 1 -> {
                    System.out.print("Digite o nome de usuário: ");
                    String inputUsername = scanner.nextLine();
                    System.out.print("Digite a senha: ");
                    String inputPassword = scanner.nextLine();
                    if (authenticate(inputUsername, inputPassword)) {
                        System.out.println("\nLogin bem-sucedido! 🐾");
                        break OUTER;
                    } else {
                        loginAttempts++;
                        int remainingAttempts = MAX_ATTEMPTS - loginAttempts;
                        System.out.println("Nome de usuário ou senha incorretos! Tentativas restantes: " + remainingAttempts);
                    }
                }
                case 2 -> {
                    System.out.print("Digite um novo nome de usuário: ");
                    String newUsername = scanner.nextLine();
                    if (isUsernameTaken(newUsername)) {
                        System.out.println("Este nome de usuário já existe! Tente outro.");
                        continue;
                    }
                    System.out.print("Digite uma senha (mín. 8 caracteres, com letra maiúscula e número): ");
                    String newPassword = scanner.nextLine();
                    if (!isValidPassword(newPassword)) {
                        System.out.println("Senha inválida! Deve ter pelo menos 8 caracteres, uma letra maiúscula e um número.");
                        continue;
                    }
                    credentials.add(new Credential(newUsername, newPassword));
                    saveCredentials();
                    System.out.println("Conta criada com sucesso! Faça login com suas novas credenciais.");
                }
                default -> System.out.println("Opção inválida. Tente novamente.");
            }
        }

        if (loginAttempts >= MAX_ATTEMPTS) {
            System.out.println("Muitas tentativas falhas. Programa encerrado!");
            scanner.close();
            return;
        }

        System.out.println("🐾 Bem-vindo à Social Library!🐾 a social labrary é um projecto privado-escolar de Sithólia João ");
        System.out.println("com a participação executiva de Pascoal Fortunato, inicialmente o grupo social labrary consta com 5 membros que");
        System.out.println("são Sithólia João Pascoal Fortunato Vania da Costa Teresa Andre Olivia Manuel🐾");
        System.out.println("A social library é um projecto que visa ajudar pessoas portadoras de deficiencia diminuindo a analfabetisacão ");
        System.out.println("entre os mesmos ");

        while (true) {
            System.out.println("\n=== MENU PRINCIPAL ===");
            System.out.println("1. Buscar Livros");
            System.out.println("2. Realizar Empréstimo");
            System.out.println("3. Devolver Livro");
            System.out.println("4. Cadastrar Usuário");
            System.out.println("5. Recursos de Acessibilidade");
            System.out.println("6. Área Infantil");
            System.out.println("0. Sair");
            System.out.print("Escolha uma opção: ");

            int choice = scanner.nextInt();
            scanner.nextLine();

            switch (choice) {
                case 1 -> searchBooks();
                case 2 -> borrowBook();
                case 3 -> returnBook();
                case 4 -> registerUser();
                case 5 -> accessibilityFeatures();
                case 6 -> kidsArea();
                case 0 -> {
                    System.out.println("Obrigado por usar a Social Library!");
                    scanner.close();
                    return;
                }
                default -> System.out.println("Opção inválida. Tente novamente.");
            }
        }
    }

    private boolean isUsernameTaken(String username) {
        for (Credential cred : credentials) {
            if (cred.getUsername().equals(username)) {
                return true;
            }
        }
        return false;
    }

    private void searchBooks() {
        System.out.println("\n=== BUSCAR LIVROS ===");
        System.out.println("1. Buscar por título");
        System.out.println("2. Buscar por autor");
        System.out.println("3. Buscar por categoria");
        System.out.println("4. Mostrar todos");
        System.out.print("Escolha: ");

        int searchType = scanner.nextInt();
        scanner.nextLine();

        System.out.print("Digite o termo de busca (ou deixe em branco para todos): ");
        String searchTerm = scanner.nextLine().toLowerCase();

        System.out.println("\nResultados da busca:");
        boolean found = false;

        for (Book book : catalog.values()) {
            boolean match = switch (searchType) {
                case 1 -> book.getTitle().toLowerCase().contains(searchTerm);
                case 2 -> book.getAuthor().toLowerCase().contains(searchTerm);
                case 3 -> book.getCategory().toLowerCase().contains(searchTerm);
                case 4 -> true;
                default -> false;
            };

            if (match) {
                System.out.println(book);
                found = true;
            }
        }

        if (!found) {
            System.out.println("Nenhum livro encontrado com os critérios informados.");
        }
    }

    private void borrowBook() {
        System.out.println("\n=== REALIZAR EMPRÉSTIMO ===");

        System.out.println("Usuários cadastrados:");
        for (User user : users) {
            System.out.println(user.getId() + " - " + user.getName());
        }

        System.out.print("Digite o ID do usuário: ");
        String userId = scanner.nextLine();

        User user = findUserById(userId);
        if (user == null) {
            System.out.println("Usuário não encontrado!");
            return;
        }

        System.out.println("\nLivros disponíveis:");
        for (Book book : catalog.values()) {
            if (book.isAvailable()) {
                System.out.println(book);
            }
        }

        System.out.print("Digite o ID do livro: ");
        String bookId = scanner.nextLine();

        Book livro = catalog.get(bookId);
        if (livro == null) {
            System.out.println("Livro não encontrado!");
            return;
        }

        if (!livro.isAvailable()) {
            System.out.println("Este livro já está emprestado!");
            return;
        }

        if (user.hasDisability("visual") && !livro.hasAudio()) {
            System.out.println("Atenção: Este usuário precisa de audiolivro mas este livro não está disponível em áudio!");
            System.out.print("Deseja continuar mesmo assim? (S/N): ");
            String confirm = scanner.nextLine();
            if (!confirm.equalsIgnoreCase("S")) {
                return;
            }
        }

        Loan loan = new Loan(user, livro);
        loans.add(loan);
        livro.setAvailable(false);

        System.out.println("\nEmpréstimo realizado com sucesso!");
        System.out.println("Detalhes:");
        System.out.println(loan);

        suggestAccessibilityFeatures(user, livro);
    }

    private void suggestAccessibilityFeatures(User user, Book book) {
        System.out.println("\n💡 Sugestões de acessibilidade:");

        if (user.hasDisability("visual")) {
            if (book.hasAudio()) {
                System.out.println("- Este livro está disponível em formato de áudio");
            } else {
                System.out.println("- Infelizmente este livro não está disponível em áudio");
            }
            System.out.println("- Você pode usar nosso leitor de tela integrado");
        }

        if (user.hasDisability("mobility")) {
            System.out.println("- Você pode solicitar entrega em casa");
            System.out.println("- Temos rampas de acesso e mesas adaptadas");
        }

        if (user.getAgeGroup().equals("child")) {
            System.out.println("- Que tal visitar nossa área infantil com livros interativos?");
            System.out.println("- Temos atividades especiais para crianças todas as quartas!");
        }
    }

    private void returnBook() {
        System.out.println("\n=== DEVOLVER LIVRO ===");

        System.out.print("Digite o ID do livro a ser devolvido: ");
        String bookId = scanner.nextLine();

        Book book = catalog.get(bookId);
        if (book == null) {
            System.out.println("Livro não encontrado!");
            return;
        }

        if (book.isAvailable()) {
            System.out.println("Este livro já está disponível!");
            return;
        }

        Loan activeLoan = null;
        for (Loan loan : loans) {
            if (loan.getBook().getId().equals(bookId)) {
                activeLoan = loan;
                break;
            }
        }

        if (activeLoan == null) {
            System.out.println("Não foi encontrado empréstimo ativo para este livro!");
            return;
        }

        activeLoan.markAsReturned();
        book.setAvailable(true);

        LocalDate returnDate = activeLoan.getReturnDate();
        LocalDate dueDate = activeLoan.getDueDate();
        if (returnDate.isAfter(dueDate)) {
            System.out.println("Atenção: Devolução atrasada! Multa aplicável.");
            long daysLate = java.time.temporal.ChronoUnit.DAYS.between(dueDate, returnDate);
            System.out.println("Atraso de " + daysLate + " dias.");
        }

        System.out.println("Livro devolvido com sucesso!");
        System.out.println("Detalhes:");
        System.out.println(activeLoan);
    }

    private void registerUser() {
        System.out.println("\n=== CADASTRAR USUÁRIO ===");

        System.out.print("Nome completo: ");
        String name = scanner.nextLine();

        System.out.println("Faixa etária:");
        System.out.println("1. Criança (0-12)");
        System.out.println("2. Adolescente (13-17)");
        System.out.println("3. Adulto (18-59)");
        System.out.println("4. Idoso (60+)");
        System.out.print("Escolha: ");
        int ageChoice = scanner.nextInt();
        scanner.nextLine();

        String ageGroup;
        switch (ageChoice) {
            case 1 -> ageGroup = "child";
            case 2 -> ageGroup = "teen";
            case 3 -> ageGroup = "adult";
            case 4 -> ageGroup = "senior";
            default -> {
                System.out.println("Opção inválida, definindo como adulto");
                ageGroup = "adult";
            }
        }

        System.out.println("Necessidades especiais (deixe em branco se não houver):");
        System.out.println("Opções: visual, auditivo, mobilidade, cognitiva, nenhuma");
        System.out.print("Digite: ");
        String disability = scanner.nextLine().toLowerCase();

        if (disability.isEmpty()) {
            disability = "none";
        }

        String newId = "U" + String.format("%03d", users.size() + 1);

        User newUser = new User(newId, name, ageGroup, disability);
        users.add(newUser);

        System.out.println("\nUsuário cadastrado com sucesso!");
        System.out.println(newUser);

        System.out.println("\nRecursos disponíveis para você:");
        if (!disability.equals("none")) {
            System.out.println("- Acesso prioritário a recursos de acessibilidade");
        }
        if (ageGroup.equals("child")) {
            System.out.println("- Área infantil com atividades especiais");
            System.out.println("- Livros interativos e jogos educativos");
        }
    }

    private void accessibilityFeatures() {
        System.out.println("\n=== RECURSOS DE ACESSIBILIDADE ===");
        System.out.println("1. Audiolivros");
        System.out.println("2. Livros em Braille");
        System.out.println("3. Leitores de tela");
        System.out.println("4. Livros com fonte ampliada");
        System.out.println("5. Acessibilidade física");
        System.out.print("Escolha: ");

        int choice = scanner.nextInt();
        scanner.nextLine();

        switch (choice) {
            case 1 -> {
                System.out.println("\nAudiolivros disponíveis:");
                for (Book book : catalog.values()) {
                    if (book.hasAudio()) {
                        System.out.println("- " + book.getTitle() + " (Duração: aprox. " +
                                (book.getPages() / 3) + " horas)");
                    }
                }
            }
            case 2 -> {
                System.out.println("\nLivros em Braille disponíveis:");
                for (Book book : catalog.values()) {
                    if (book.hasBraille()) {
                        System.out.println("- " + book.getTitle());
                    }
                }
            }
            case 3 -> {
                System.out.println("\nLeitores de tela disponíveis:");
                System.out.println("- NVDA (Windows)");
                System.out.println("- VoiceOver (Mac/iOS)");
                System.out.println("- TalkBack (Android)");
                System.out.println("\nNosso aplicativo tem integração com todos esses leitores!");
            }
            case 4 -> {
                System.out.println("\nLivros com fonte ampliada:");
                for (Book book : catalog.values()) {
                    if (book.hasLargePrint()) {
                        System.out.println("- " + book.getTitle());
                    }
                }
            }
            case 5 -> {
                System.out.println("\nAcessibilidade física na biblioteca:");
                System.out.println("- Rampas de acesso");
                System.out.println("- Banheiros adaptados");
                System.out.println("- Mesas reguláveis");
                System.out.println("- Estacionamento reservado");
            }
            default -> System.out.println("Opção inválida");
        }
    }

    private void kidsArea() {
        System.out.println("\n🐯=== ÁREA INFANTIL ===🐯");
        System.out.println("Bem-vindo ao cantinho mágico da Social Library!");

        System.out.println("\nLivros recomendados:");
        for (Book book : catalog.values()) {
            if (book.getCategory().equalsIgnoreCase("Infantil")) {
                System.out.println("- " + book.getTitle() + " (" + book.getAuthor() + ")");
            }
        }

        System.out.println("\nAtividades especiais:");
        System.out.println("1. Hora do Conto (Quarta e Sábado às 10h) Com a professora Teresa");
        System.out.println("2. Oficina de Desenhos Com a professora Vania");
        System.out.println("3. Jogos Educativos");
        System.out.println("4. Livros Interativos com Realidade Aumentada");
        System.out.println("5. Vamos aprender diversos idiomas com Social Library");

        System.out.println("\nDica: Peça para seus pais te ajudarem a pegar livros emprestados!");
    }

    public User findUserById(String id) {
        for (User user : users) {
            if (user.getId().equalsIgnoreCase(id)) {
                return user;
            }
        }
        return null;
    }

    public Scanner getScanner() {
        return scanner;
    }

    public HashMap<String, Book> getCatalog() {
        return catalog;
    }

    public List<User> getUsers() {
        return users;
    }

    public List<Loan> getLoans() {
        return loans;
    }

    public void setCatalog(HashMap<String, Book> catalog) {
        this.catalog = catalog;
    }

    public void setScanner(Scanner scanner) {
        this.scanner = scanner;
    }

    public boolean authenticate(String username, String password) {
        for (Credential c : credentials) {
            if (c.getUsername().equals(username) && c.getPassword().equals(password)) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        SocialLibrary library = new SocialLibrary();
        library.start();
    }
}