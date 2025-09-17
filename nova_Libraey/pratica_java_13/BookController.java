package pratica_java_13;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final SocialLibrary library = new SocialLibrary();

    @GetMapping
    public Collection<Book> getBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category) {
        return library.getCatalog().values().stream()
                .filter(book -> title == null || book.getTitle().toLowerCase().contains(title.toLowerCase()))
                .filter(book -> author == null || book.getAuthor().toLowerCase().contains(author.toLowerCase()))
                .filter(book -> category == null || book.getCategory().toLowerCase().contains(category.toLowerCase()))
                .toList();
    }

    @PostMapping("/borrow")
    public String borrowBook(@RequestParam String userId, @RequestParam String bookId) {
        User user = library.findUserById(userId);
        Book book = library.getCatalog().get(bookId);
        if (user == null) return "Usuário não encontrado!";
        if (book == null) return "Livro não encontrado!";
        if (!book.isAvailable()) return "Livro já emprestado!";
        Loan loan = new Loan(user, book);
        library.getLoans().add(loan);
        book.setAvailable(false);
        return "Empréstimo realizado com sucesso!";
    }

    public int getYear() {
        return getYear();
    }
}