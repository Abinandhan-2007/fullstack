@Entity
@Table(name = "staff_members")
public class Staff {
    @Id
    private String email;
    private String name;
    private String department;
    private String designation;
    private String role = "STAFF";
    // Add Getters and Setters
}