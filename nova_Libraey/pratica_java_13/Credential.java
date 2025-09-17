package pratica_java_13;

public class Credential {
    private String username;
    private String password;

    public Credential(String username, String password) {
        this.username = username;
        this.password = password; // ou hashpw(password, gensalt()) se implementar
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
