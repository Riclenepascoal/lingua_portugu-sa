package pratica_java_13;

import java.time.LocalDate;

public class Loan {
    private final User user;
    private final Book book;
    private final LocalDate loanDate;
    private LocalDate returnDate;
    private boolean returned;
    private LocalDate dueDate; // Adicionada a variável dueDate

    public Loan(User user, Book book) {
        this.user = user;
        this.book = book;
        this.loanDate = LocalDate.now();
        this.returned = false;
    }

    /**
     * Verifica se o empréstimo está atrasado.
     * @param daysAllowed número de dias permitidos para devolução
     * @return true se o empréstimo está atrasado, false caso contrário
     */
    public boolean isOverdue(int daysAllowed) {
        if (returned) {
            return false;
        }
        dueDate = loanDate.plusDays(daysAllowed); // Atualiza a dueDate aqui
        return LocalDate.now().isAfter(dueDate);
    }

    @Override
    public String toString() {
        return "Loan{" +
                "user=" + user +
                ", book=" + book +
                ", loanDate=" + loanDate +
                ", returnDate=" + returnDate +
                ", returned=" + returned +
                '}';
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void markAsReturned() {
        this.returned = true;
        this.returnDate = LocalDate.now();
    }

    public Book getBook() {
        return book;
    }

    public User getUser() {
        return user;
    }

    public boolean isReturned() {
        return returned;
    }

    public LocalDate getLoanDate() {
        return loanDate;
    }

    public void setDueDate(LocalDate dueDate) { // Método setDueDate adicionado
        this.dueDate = dueDate;
    }
}

class User {

    public User(String newId, String name, String ageGroup, String disability) {
        //TODO Auto-generated constructor stub
    }

    public String getId() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getId'");
    }
    // User class implementation

    public Object getAgeGroup() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAgeGroup'");
    }

    public boolean hasDisability(String string) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'hasDisability'");
    }

    public String getName() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getName'");
    }
}
