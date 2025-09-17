package pratica_java_13;

public class BCrypt {
    public static String gensalt() {
        return "salt";
    }
    public static String hashpw(String password, String salt) {
        // Implementação simples para testes
        return password + salt;
    }
}
