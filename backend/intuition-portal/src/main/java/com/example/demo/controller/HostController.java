@RestController
@RequestMapping("/api/host")
@CrossOrigin(origins = "*")
public class HostController {
    @Autowired
    private StaffRepository staffRepository;

    @PostMapping("/add-staff")
    public Staff addStaff(@RequestBody Staff staff) {
        return staffRepository.save(staff);
    }

    @GetMapping("/all-staff")
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
}