package pratica_java_13;

public class Book {
    private String id;
    private String title;
    private String author;
    private int year;
    private String category;
    private boolean available;
    private boolean hasAudio;
    private boolean hasBraille;
    private boolean hasLargePrint;

    public Book(String id, String title, String author, int year, String category, boolean available, boolean hasAudio,
            boolean hasBraille, boolean hasLargePrint) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.category = category;
        this.available = available;
        this.hasAudio = hasAudio;
        this.hasBraille = hasBraille;
        this.hasLargePrint = hasLargePrint;
    }

    public String getCategory() {
        return category;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public boolean hasLargePrint() {
        return hasLargePrint;
    }

    public boolean hasBraille() {
        return hasBraille;
    }

    public int getPages() {
        return year;
    }

    public boolean hasAudio() {
        return hasAudio;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getId() {
        return id;
    }
}