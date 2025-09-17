package pratica_java_13;

public class SocialLibraryConsole {
    private SocialLibrary library;

    public SocialLibraryConsole(SocialLibrary library) {
        this.library = library;
    }

    public void start() {
        // Copie o conteúdo do método start() da SocialLibrary para cá,
        // substituindo todas as referências a campos privados por chamadas aos métodos públicos da SocialLibrary,
        // ou torne os métodos necessários públicos em SocialLibrary.
        library.start();
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

    public static void main(String[] args) {
        SocialLibrary library = new SocialLibrary();
        SocialLibraryConsole console = new SocialLibraryConsole(library);
        console.start();
    }
}