package pratica_java_13;

public class User {
    private String id;
    private String name;
    private String ageGroup;
    private String disability;

    public User(String id, String name, String ageGroup, String disability) {
        this.id = id;
        this.name = name;
        this.ageGroup = ageGroup;
        this.disability = disability;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public String getDisability() {
        return disability;
    }

    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "', ageGroup='" + ageGroup + "', disability='" + disability + "'}";
    }

    boolean hasDisability(String visual) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}