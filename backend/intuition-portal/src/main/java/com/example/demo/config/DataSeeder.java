package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(
            UserRepository userRepo,
            StudentRepository studentRepo,
            StaffRepository staffRepo,
            CourseRepository courseRepo,
            DepartmentRepository deptRepo,
            MarkRepository markRepo,
            AttendanceRepository attendanceRepo,
            FeePaymentRepository feeRepo,
            TimetableSlotRepository timetableRepo,
            ExamScheduleRepository examRepo,
            LibraryBookRepository bookRepo,
            LibraryIssueRepository issueRepo,
            HostelRoomRepository roomRepo,
            HostelAllocationRepository hostelAllocRepo,
            HostelComplaintRepository complaintRepo,
            MessMenuRepository messRepo,
            CompanyRepository companyRepo,
            PlacementApplicationRepository placementAppRepo,
            AnnouncementRepository announcementRepo,
            EventRepository eventRepo,
            StaffLeaveRepository staffLeaveRepo,
            StudentLeaveRepository studentLeaveRepo,
            StaffAttendanceRecordRepository staffAttendRepo,
            PayrollRepository payrollRepo,
            SecurityLogRepository logRepo,
            PasswordEncoder encoder
    ) {
        return args -> {
            if (userRepo.count() > 0) return;

            System.out.println("Starting Comprehensive Intuition Portal Data Seeding...");

            // 1. Departments
            Department cs = createDept(deptRepo, "Computer Science and Engineering", "CS");
            Department ec = createDept(deptRepo, "Electronics and Communication", "EC");
            Department me = createDept(deptRepo, "Mechanical Engineering", "ME");
            Department cv = createDept(deptRepo, "Civil Engineering", "CV");
            Department it = createDept(deptRepo, "Information Technology", "IT");

            // 2. Staff (15 - 3 per dept)
            List<Staff> staffList = new ArrayList<>();
            // CS
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S001", "Rajeshkumar G", "Professor", "CS", "raj@intuition.ac.in", "CS10963", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S002", "Meena Devi", "Asst Professor", "CS", "meena@intuition.ac.in", "CS10964", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S003", "Vijay Kumar", "Asst Professor", "CS", "vijay@intuition.ac.in", "CS10965", "ROLE_STAFF"));
            // EC
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S004", "Priya Sharma", "Professor", "EC", "priya@intuition.ac.in", "EC10966", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S005", "Arun Balaji", "Asst Professor", "EC", "arun@intuition.ac.in", "EC10967", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S006", "Lakshmi R", "Asst Professor", "EC", "lakshmi@intuition.ac.in", "EC10968", "ROLE_STAFF"));
            // ME
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S007", "Suresh Kumar", "Professor", "ME", "suresh@intuition.ac.in", "ME10969", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S008", "Dinesh P", "Asst Professor", "ME", "dinesh@intuition.ac.in", "ME10970", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S009", "Kavitha M", "Asst Professor", "ME", "kavitha@intuition.ac.in", "ME10971", "ROLE_STAFF"));
            // CV
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S010", "Anitha Rajan", "Professor", "CV", "anitha@intuition.ac.in", "CV10972", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S011", "Mohan Das", "Asst Professor", "CV", "mohan@intuition.ac.in", "CV10973", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S012", "Saranya K", "Asst Professor", "CV", "saranya@intuition.ac.in", "CV10974", "ROLE_STAFF"));
            // IT
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S013", "Karthik Nair", "Professor", "IT", "karthik@intuition.ac.in", "IT10975", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S014", "Divya S", "Asst Professor", "IT", "divya@intuition.ac.in", "IT10976", "ROLE_STAFF"));
            staffList.add(createStaff(staffRepo, userRepo, encoder, "S015", "Prakash T", "Asst Professor", "IT", "prakash@intuition.ac.in", "IT10977", "ROLE_STAFF"));

            // Special Accounts
            createUser(userRepo, "admin@intuition.ac.in", "Administrator", "ROLE_ADMIN", "ADMIN001");
            createUser(userRepo, "coe@intuition.ac.in", "COE Officer", "ROLE_COE", "COE001");
            createUser(userRepo, "finance@intuition.ac.in", "Finance Officer", "ROLE_FINANCE", "FIN001");
            createUser(userRepo, "hostel@intuition.ac.in", "Hostel Warden", "ROLE_WARDEN", "WARD001");
            createUser(userRepo, "library@intuition.ac.in", "Librarian", "ROLE_LIBRARIAN", "LIB001");
            createUser(userRepo, "placement@intuition.ac.in", "Placement Officer", "ROLE_PLACEMENT", "PLACE001");
            createUser(userRepo, "staffadmin@intuition.ac.in", "Staff Admin Officer", "ROLE_STAFFADMIN", "SA001");
            createUser(userRepo, "parent@gmail.com", "Parent of Abinandhan K", "ROLE_PARENT", "7376241CS101");

            // 3. Students (50 - 10 per dept)
            List<Student> students = new ArrayList<>();
            String[] studentNames = {"Abinandhan K", "Preethi R", "Surya M", "Dharani S", "Keerthana V", "Arun Prasad", "Nithya Devi", "Rajesh T", "Sowmiya P", "Manikandan R"};
            String[] studentEmails = {"abi@gmail.com", "preethi@gmail.com", "surya@gmail.com", "dharani@gmail.com", "keerthana@gmail.com", "arunprasad@gmail.com", "nithya@gmail.com", "rajesh@gmail.com", "sowmiya@gmail.com", "mani@gmail.com"};
            String[] bloods = {"O+", "A+", "B+", "O-", "AB+", "A+", "B-", "O+", "A-", "AB-"};

            for (int i = 0; i < 10; i++) {
                students.add(createStudent(studentRepo, userRepo, encoder, "7376241CS1" + String.format("%02d", i+1), studentNames[i], studentEmails[i], "CS", bloods[i], "IV"));
            }
            
            String[] depts = {"EC", "ME", "CV", "IT"};
            for (String dp : depts) {
                for (int i = 1; i <= 10; i++) {
                    String reg = "7376241" + dp + "1" + String.format("%02d", i);
                    students.add(createStudent(studentRepo, userRepo, encoder, reg, "Student " + dp + " " + i, "student." + dp.toLowerCase() + i + "@gmail.com", dp, "B+", "IV"));
                }
            }

            // 4. Courses (25 - 5 per dept)
            List<Course> allCourses = new ArrayList<>();
            String[][] courseData = {
                {"CS", "Data Structures & Algorithms", "CS401", "4"},
                {"CS", "Database Management Systems", "CS402", "4"},
                {"CS", "Operating Systems", "CS403", "3"},
                {"CS", "Computer Networks", "CS404", "3"},
                {"CS", "Software Engineering", "CS405", "3"},
                {"EC", "Digital Signal Processing", "EC401", "4"},
                {"EC", "VLSI Design", "EC402", "4"},
                {"EC", "Microprocessors", "EC403", "3"},
                {"EC", "Communication Systems", "EC404", "3"},
                {"EC", "Embedded Systems", "EC405", "3"},
                {"ME", "Thermodynamics", "ME401", "4"},
                {"ME", "Fluid Mechanics", "ME402", "4"},
                {"ME", "Heat Transfer", "ME403", "3"},
                {"ME", "Machine Design", "ME404", "3"},
                {"ME", "Dynamics of Machines", "ME405", "3"},
                {"CV", "Structural Analysis", "CV401", "4"},
                {"CV", "Concrete Technology", "CV402", "4"},
                {"CV", "Environmental Engg", "CV403", "3"},
                {"CV", "Surveying", "CV404", "3"},
                {"CV", "Geotechnical Engg", "CV405", "3"},
                {"IT", "Web Technologies", "IT401", "4"},
                {"IT", "Python Programming", "IT402", "4"},
                {"IT", "Cyber Security", "IT403", "3"},
                {"IT", "Cloud Computing", "IT404", "3"},
                {"IT", "Mobile App Dev", "IT405", "3"}
            };

            for (String[] cd : courseData) {
                allCourses.add(createCourse(courseRepo, cd[1], cd[2], Integer.parseInt(cd[3]), cd[0]));
            }

            // 5. Marks and Attendance
            for (Student s : students) {
                List<Course> deptCourses = new ArrayList<>();
                for (Course c : allCourses) if (c.getDepartment().equals(s.getDepartment())) deptCourses.add(c);

                for (Course c : deptCourses) {
                    // Marks
                    int c1 = 30 + (int)(Math.random() * 20);
                    int c2 = 30 + (int)(Math.random() * 20);
                    int mod = 60 + (int)(Math.random() * 40);
                    
                    // Specifics for Abinandhan
                    if (s.getRegisterNumber().equals("7376241CS101")) {
                        if (c.getSubjectCode().equals("CS401")) { c1=42; c2=45; mod=87; }
                        else if (c.getSubjectCode().equals("CS402")) { c1=38; c2=41; mod=79; }
                        else if (c.getSubjectCode().equals("CS403")) { c1=46; c2=44; mod=91; }
                        else if (c.getSubjectCode().equals("CS404")) { c1=35; c2=38; mod=72; }
                        else if (c.getSubjectCode().equals("CS405")) { c1=40; c2=43; mod=83; }
                    }

                    createMark(markRepo, s, c, "CIA1", c1, 50);
                    createMark(markRepo, s, c, "CIA2", c2, 50);
                    createMark(markRepo, s, c, "Model", mod, 100);

                    // Attendance (45 sessions)
                    int presentCount = 34 + (int)(Math.random() * 11); // 34-45
                    if (s.getRegisterNumber().equals("7376241CS103") && c.getSubjectCode().equals("CS401")) presentCount = 28;
                    if (s.getRegisterNumber().equals("7376241CS107") && c.getSubjectCode().equals("CS402")) presentCount = 31;
                    if (s.getRegisterNumber().equals("7376241CS104") && c.getSubjectCode().equals("CS403")) presentCount = 33;
                    
                    for (int j = 0; j < 45; j++) {
                        createAttendance(attendanceRepo, s, c, LocalDate.now().minusDays(45-j), j < presentCount);
                    }
                }
                
                // Historical Marks for SGPA Chart
                createMark(markRepo, s, allCourses.get(0), "SEM_1_SGPA", (int)(85 + Math.random()*7), 100);
                createMark(markRepo, s, allCourses.get(0), "SEM_2_SGPA", (int)(80 + Math.random()*8), 100);
                createMark(markRepo, s, allCourses.get(0), "SEM_3_SGPA", (int)(78 + Math.random()*7), 100);

                // Fee Records
                boolean isDefaulter = s.getId() != null && s.getId() % 10 == 0;
                boolean isPartial = s.getId() != null && s.getId() % 10 == 5;
                
                createFee(feeRepo, s, "Tuition Fee", 45000.0, "2026-03-31", isDefaulter ? null : "2026-02-15", isDefaulter ? "PENDING" : "PAID", isDefaulter ? null : "RCP0"+s.getRegisterNumber());
                createFee(feeRepo, s, "Exam Fee", 2500.0, "2026-04-15", (isDefaulter || isPartial) ? null : "2026-03-10", (isDefaulter || isPartial) ? "PENDING" : "PAID", (isDefaulter || isPartial) ? null : "RCP1"+s.getRegisterNumber());
                createFee(feeRepo, s, "Lab Fee", 5000.0, "2026-03-31", isDefaulter ? null : "2026-02-20", isDefaulter ? "PENDING" : "PAID", isDefaulter ? null : "RCP2"+s.getRegisterNumber());
            }

            // 6. Timetable (CS Dept)
            Staff s1 = staffRepo.findByStaffId("S001").get();
            Staff s2 = staffRepo.findByStaffId("S002").get();
            Staff s3 = staffRepo.findByStaffId("S003").get();
            
            Course cs401 = courseRepo.findBySubjectCode("CS401").get();
            Course cs402 = courseRepo.findBySubjectCode("CS402").get();
            Course cs403 = courseRepo.findBySubjectCode("CS403").get();
            Course cs404 = courseRepo.findBySubjectCode("CS404").get();
            Course cs405 = courseRepo.findBySubjectCode("CS405").get();

            String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
            for (String day : days) {
                createSlot(timetableRepo, s1, cs401, day, 1, "CS101", "IV", "A");
                createSlot(timetableRepo, s2, cs402, day, 2, "CS102", "IV", "A");
                createSlot(timetableRepo, s3, cs403, day, 3, "CS101", "IV", "A");
                createSlot(timetableRepo, s1, cs404, day, 4, "CS103", "IV", "A");
                createSlot(timetableRepo, s2, cs405, day, 5, "CS102", "IV", "A");
            }

            // 7. Exam Schedule
            createExam(examRepo, cs401, "Final", "2026-06-02", "09:00", "Hall A", 100, true);
            createExam(examRepo, cs402, "Final", "2026-06-04", "09:00", "Hall B", 100, true);
            createExam(examRepo, cs403, "Final", "2026-06-06", "14:00", "Hall A", 100, false);
            createExam(examRepo, cs404, "Final", "2026-06-09", "09:00", "Hall C", 100, false);
            createExam(examRepo, cs405, "Final", "2026-06-11", "14:00", "Hall B", 100, false);
            createExam(examRepo, allCourses.get(5), "Final", "2026-06-03", "09:00", "Hall D", 100, true);

            // 8. Library Books (20)
            String[][] bookData = {
                {"B001", "Introduction to Algorithms", "Cormen", "CS", "9780262033848", "5", "3"},
                {"B002", "Database System Concepts", "Silberschatz", "CS", "9780078022159", "4", "2"},
                {"B003", "Operating System Concepts", "Galvin", "CS", "9781118063330", "4", "4"},
                {"B004", "Computer Networks", "Tanenbaum", "CS", "9780132126953", "3", "1"},
                {"B005", "Software Engineering", "Pressman", "CS", "9780078022128", "3", "3"},
                {"B006", "Digital Signal Processing", "Proakis", "EC", "9780131873742", "4", "3"},
                {"B007", "VLSI Design", "Weste", "EC", "9780321547743", "3", "2"},
                {"B008", "Microprocessor Architecture", "Brey", "EC", "9780135026458", "4", "4"},
                {"B009", "Engineering Mathematics Vol 1", "Grewal", "ALL", "9788121935906", "8", "5"},
                {"B010", "Engineering Mathematics Vol 2", "Grewal", "ALL", "9788121935920", "8", "6"},
                {"B011", "Strength of Materials", "Bansal", "ME", "9788174091277", "5", "4"},
                {"B012", "Thermodynamics", "Cengel", "ME", "9780073398174", "4", "3"},
                {"B013", "Fluid Mechanics", "White", "ME/CV", "9780073398273", "4", "2"},
                {"B014", "Structural Analysis", "Bhavikatti", "CV", "9788122427974", "4", "4"},
                {"B015", "Concrete Technology", "Shetty", "CV", "9788121928915", "3", "3"},
                {"B016", "Web Technologies", "Godbole", "IT", "9780070146839", "5", "3"},
                {"B017", "Python Programming", "Guido", "IT/CS", "9780596009427", "6", "4"},
                {"B018", "Machine Learning", "Mitchell", "CS/IT", "9780070428072", "4", "2"},
                {"B019", "Data Science Handbook", "Field Cady", "ALL", "9781491931615", "3", "1"},
                {"B020", "Clean Code", "Martin", "ALL", "9780132350884", "5", "3"}
            };
            List<LibraryBook> books = new ArrayList<>();
            for (String[] bd : bookData) {
                books.add(createBook(bookRepo, bd[0], bd[1], bd[2], bd[3], bd[4], Integer.parseInt(bd[5]), Integer.parseInt(bd[6])));
            }

            // Library Issues
            createIssue(issueRepo, students.get(0), books.get(0), "2026-04-20", "2026-05-04", null, "OVERDUE", 24.0);
            createIssue(issueRepo, students.get(1), books.get(16), "2026-05-01", "2026-05-15", null, "OVERDUE", 2.0);
            createIssue(issueRepo, students.get(2), books.get(8), "2026-05-10", "2026-05-24", null, "ISSUED", 0.0);
            createIssue(issueRepo, students.get(3), books.get(17), "2026-05-12", "2026-05-26", null, "ISSUED", 0.0);

            // 9. Hostel
            for (int i=1; i<=5; i++) createRoom(roomRepo, "A10"+i, "Block A", 1, 4, 4);
            for (int i=1; i<=5; i++) createRoom(roomRepo, "A20"+i, "Block A", 2, 4, 4);
            for (int i=1; i<=5; i++) createRoom(roomRepo, "B10"+i, "Block B", 1, 4, 4);
            for (int i=1; i<=5; i++) createRoom(roomRepo, "B20"+i, "Block B", 2, 4, 4);

            HostelRoom r1 = roomRepo.findByRoomNumber("A101").get();
            createAllocation(hostelAllocRepo, students.get(0), r1, "Bed 1");
            createAllocation(hostelAllocRepo, students.get(1), r1, "Bed 2");

            createComplaint(complaintRepo, students.get(0), "Electrical", "Fan in room A101 not working", "2026-05-10", "RESOLVED");
            createComplaint(complaintRepo, students.get(2), "Plumbing", "Tap leaking in bathroom", "2026-05-12", "IN_PROGRESS");
            createComplaint(complaintRepo, students.get(1), "Cleanliness", "Room not cleaned for 3 days", "2026-05-14", "OPEN");

            for (String day : days) {
                createMenu(messRepo, day, "Institutional Breakfast", "Institutional Lunch", "Tea/Coffee + Snacks", "Institutional Dinner");
            }

            // 10. Placement
            Company tcs = createCompany(companyRepo, "TCS", "IT Services", "2026-07-15", 6.0, "Upcoming", "3.5-7 LPA");
            Company infosys = createCompany(companyRepo, "Infosys", "IT Services", "2026-07-22", 6.5, "Upcoming", "4-8 LPA");
            Company wipro = createCompany(companyRepo, "Wipro", "IT Services", "2026-08-05", 6.0, "Upcoming", "3.5-6 LPA");
            Company zoho = createCompany(companyRepo, "Zoho", "Product", "2026-08-12", 7.5, "Upcoming", "6-12 LPA");
            Company amazon = createCompany(companyRepo, "Amazon", "E-commerce", "2026-09-01", 8.0, "Upcoming", "12-20 LPA");
            Company lt = createCompany(companyRepo, "L&T", "Construction", "2026-07-20", 6.5, "Upcoming", "4-7 LPA");

            createApp(placementAppRepo, students.get(0), zoho, "2025-12-01", "PLACED", "8 LPA");
            createApp(placementAppRepo, students.get(1), tcs, "2025-11-10", "PLACED", "4.5 LPA");

            // 11. Announcements & Events
            createAnnouncement(announcementRepo, "Final Exam Hall Tickets Released for CS and EC departments", "Admin", "2026-05-14", "URGENT");
            createAnnouncement(announcementRepo, "Fee payment last date extended to May 30, 2026", "Finance", "2026-05-12", "IMPORTANT");
            createAnnouncement(announcementRepo, "Library will remain closed on May 19 (holiday)", "Library", "2026-05-11", "NORMAL");
            createAnnouncement(announcementRepo, "TCS Campus Drive registration open until May 25", "Placement", "2026-05-10", "URGENT");

            createEvent(eventRepo, "Buddha Purnima", "College Holiday", "2026-05-19", "Holiday");
            createEvent(eventRepo, "Sports Day 2026", "Annual sports meet", "2026-06-01", "Event");
            createEvent(eventRepo, "Final Exam Begins", "Semester IV finals start", "2026-06-02", "Exam");

            // 12. Leaves
            createStaffLeave(staffLeaveRepo, s1, "Medical", "2026-05-05", "2026-05-07", 3, "APPROVED");
            createStaffLeave(staffLeaveRepo, s2, "Casual", "2026-05-10", "2026-05-10", 1, "APPROVED");
            createStaffLeave(staffLeaveRepo, s3, "Duty", "2026-05-15", "2026-05-16", 2, "PENDING");

            createStudentLeave(studentLeaveRepo, students.get(0), "Medical", "2026-04-28", "2026-04-29", 2, "APPROVED");
            createStudentLeave(studentLeaveRepo, students.get(1), "Casual", "2026-05-02", "2026-05-02", 1, "APPROVED");

            // 13. Payroll & Logs
            for (Staff st : staffList) {
                double base = st.getDesignation().equals("Professor") ? 80000 : 55000;
                createPayroll(payrollRepo, st, "May 2026", base, base*0.2, base*0.1, base*1.1, "PROCESSED");
            }

            createLog(logRepo, "abi@gmail.com", "STUDENT", "LOGIN", "192.168.1.10", "SUCCESS", "2026-05-16 08:15");
            createLog(logRepo, "admin@intuition.ac.in", "ADMIN", "LOGIN", "192.168.1.1", "SUCCESS", "2026-05-16 08:22");
            createLog(logRepo, "hacker@evil.com", "UNKNOWN", "LOGIN", "45.67.89.123", "FAILED", "2026-05-13 22:15");

            System.out.println("Comprehensive Data Seeding Completed.");
        };
    }

    private Department createDept(DepartmentRepository repo, String name, String code) {
        Department d = new Department();
        d.setName(name); d.setShortForm(code);
        return repo.save(d);
    }

    private Staff createStaff(StaffRepository repo, UserRepository uRepo, PasswordEncoder enc, String sid, String name, String des, String dept, String email, String eid, String role) {
        Staff s = new Staff();
        s.setStaffId(sid); s.setName(name); s.setDesignation(des); s.setDepartment(dept); s.setEmail(email); s.setEmployeeId(eid); s.setRole(role); s.setPassword(enc.encode("password"));
        createUser(uRepo, email, name, role, sid);
        return repo.save(s);
    }

    private void createUser(UserRepository repo, String email, String name, String role, String lid) {
        User u = new User();
        u.setEmail(email); u.setName(name); u.setRole(role); u.setLinkedId(lid);
        repo.save(u);
    }

    private Student createStudent(StudentRepository repo, UserRepository uRepo, PasswordEncoder enc, String reg, String name, String email, String dept, String blood, String sem) {
        Student s = new Student();
        s.setRegisterNumber(reg); s.setName(name); s.setEmail(email); s.setDepartment(dept); s.setBloodGroup(blood); s.setSemester(sem); s.setRole("ROLE_STUDENT"); s.setPassword(enc.encode("password"));
        createUser(uRepo, email, name, "ROLE_STUDENT", reg);
        return repo.save(s);
    }

    private Course createCourse(CourseRepository repo, String name, String code, int cred, String dept) {
        Course c = new Course();
        c.setSubjectName(name); c.setSubjectCode(code); c.setCredits(cred); c.setDepartment(dept);
        return repo.save(c);
    }

    private void createMark(MarkRepository repo, Student s, Course c, String type, int score, int max) {
        Mark m = new Mark(); m.setStudent(s); m.setCourse(c); m.setExamType(type); m.setScore(score); m.setMaxScore(max);
        repo.save(m);
    }

    private void createAttendance(AttendanceRepository repo, Student s, Course c, LocalDate d, boolean p) {
        Attendance a = new Attendance(); a.setStudent(s); a.setCourse(c); a.setDate(d); a.setPresent(p);
        repo.save(a);
    }

    private void createFee(FeePaymentRepository repo, Student s, String t, double a, String d, String p, String st, String r) {
        FeePayment f = new FeePayment(); f.setStudent(s); f.setFeeType(t); f.setAmount(a); f.setDueDate(d); f.setPaidDate(p); f.setStatus(st); f.setReceiptNumber(r);
        repo.save(f);
    }

    private void createSlot(TimetableSlotRepository repo, Staff st, Course c, String day, int per, String room, String year, String sec) {
        TimetableSlot t = new TimetableSlot(); t.setStaff(st); t.setSubject(c); t.setDay(day); t.setPeriod(per); t.setRoomNumber(room); t.setYear(year); t.setSection(sec);
        repo.save(t);
    }

    private void createExam(ExamScheduleRepository repo, Course c, String type, String d, String t, String v, int m, boolean h) {
        ExamSchedule e = new ExamSchedule(); e.setSubject(c); e.setExamType(type); e.setDate(d); e.setTime(t); e.setVenue(v); e.setMaxMarks(m); e.setHallTicketReleased(h);
        repo.save(e);
    }

    private LibraryBook createBook(LibraryBookRepository repo, String c, String t, String a, String d, String i, int cp, int av) {
        LibraryBook b = new LibraryBook(); b.setTitle(t); b.setAuthor(a); b.setCategory(d); b.setIsbn(i); b.setTotalCopies(cp); b.setAvailableCopies(av);
        return repo.save(b);
    }

    private void createIssue(LibraryIssueRepository repo, Student s, LibraryBook b, String i, String d, String r, String st, double f) {
        LibraryIssue issue = new LibraryIssue(); issue.setStudent(s); issue.setBook(b); issue.setIssueDate(i); issue.setDueDate(d); issue.setReturnDate(r); issue.setFinePaid(f);
        repo.save(issue);
    }

    private void createRoom(HostelRoomRepository repo, String n, String b, int f, int c, int o) {
        HostelRoom r = new HostelRoom(); r.setRoomNumber(n); r.setBlock(b); r.setFloor(f); r.setTotalBeds(c); r.setStatus(o<c?"AVAILABLE":"FULL");
        repo.save(r);
    }

    private void createAllocation(HostelAllocationRepository repo, Student s, HostelRoom r, String b) {
        HostelAllocation a = new HostelAllocation(); a.setStudent(s); a.setRoom(r); a.setBedNumber(b); a.setAllocatedOn(LocalDate.now().toString());
        repo.save(a);
    }

    private void createComplaint(HostelComplaintRepository repo, Student s, String t, String desc, String d, String st) {
        HostelComplaint c = new HostelComplaint(); c.setStudent(s); c.setPriority("NORMAL"); c.setDescription(t+" - "+desc); c.setCreatedAt(d); c.setStatus(st);
        repo.save(c);
    }

    private void createMenu(MessMenuRepository repo, String day, String b, String l, String s, String d) {
        MessMenu m = new MessMenu(); m.setDay(day); m.setBreakfast(b); m.setLunch(l); m.setSnacks(s); m.setDinner(d);
        repo.save(m);
    }

    private Company createCompany(CompanyRepository repo, String n, String i, String d, double m, String s, String p) {
        Company c = new Company(); c.setCompanyName(n); c.setIndustry(i); c.setDriveDate(d); c.setMinCGPA(m); c.setStatus(s); c.setPackageRange(p);
        return repo.save(c);
    }

    private void createApp(PlacementApplicationRepository repo, Student s, Company c, String d, String st, String p) {
        PlacementApplication a = new PlacementApplication(); a.setStudent(s); a.setCompany(c); a.setAppliedOn(d); a.setStatus(st); a.setPackageOffered(p);
        repo.save(a);
    }

    private void createAnnouncement(AnnouncementRepository repo, String t, String a, String d, String p) {
        Announcement ann = new Announcement(); ann.setTitle(t); ann.setSentBy(a); ann.setSentAt(d); ann.setPriority(p);
        repo.save(ann);
    }

    private void createEvent(EventRepository repo, String n, String ds, String d, String t) {
        Event e = new Event(); e.setTitle(n); e.setDescription(ds); e.setDate(d); e.setType(t);
        repo.save(e);
    }

    private void createStaffLeave(StaffLeaveRepository repo, Staff s, String t, String f, String to, int d, String st) {
        StaffLeave l = new StaffLeave(); l.setStaff(s); l.setLeaveType(t); l.setFromDate(f); l.setToDate(to); l.setDays(d); l.setStatus(st);
        repo.save(l);
    }

    private void createStudentLeave(StudentLeaveRepository repo, Student s, String t, String f, String to, int d, String st) {
        StudentLeave l = new StudentLeave(); l.setStudent(s); l.setLeaveType(t); l.setFromDate(f); l.setToDate(to); l.setDays(d); l.setStatus(st);
        repo.save(l);
    }

    private void createPayroll(PayrollRepository repo, Staff s, String m, double b, double a, double d, double n, String st) {
        Payroll p = new Payroll(); p.setStaff(s); p.setMonth(m); p.setBasicPay(b); p.setAllowances(a); p.setDeductions(d); p.setNetPay(n); p.setStatus(st);
        repo.save(p);
    }

    private void createLog(SecurityLogRepository repo, String e, String r, String a, String ip, String st, String t) {
        SecurityLog l = new SecurityLog(); l.setUserEmail(e); l.setRole(r); l.setAction(a); l.setIpAddress(ip); l.setStatus(st); l.setTimestamp(t);
        repo.save(l);
    }
}
