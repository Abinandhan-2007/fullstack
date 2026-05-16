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
import java.util.Arrays;
import java.util.Date;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(
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
            // Only seed if database is empty
            if (studentRepo.count() > 0) return;

            System.out.println("Beginning Data Seeding...");

            // 1. Departments
            Department cs = createDept(deptRepo, "Computer Science and Engineering", "CS", "Dr. Rajeshkumar G");
            Department ec = createDept(deptRepo, "Electronics and Communication", "EC", "Dr. Priya Sharma");
            Department me = createDept(deptRepo, "Mechanical Engineering", "ME", "Dr. Suresh Kumar");
            Department cv = createDept(deptRepo, "Civil Engineering", "CV", "Dr. Anitha Rajan");
            Department it = createDept(deptRepo, "Information Technology", "IT", "Dr. Karthik Nair");

            // 2. Staff
            List<Staff> staffList = new ArrayList<>();
            staffList.add(createStaff(staffRepo, encoder, "S001", "Rajeshkumar G", "Professor", "CS", "raj@intuition.ac.in", "CS10963"));
            staffList.add(createStaff(staffRepo, encoder, "S002", "Meena Devi", "Asst Professor", "CS", "meena@intuition.ac.in", "CS10964"));
            staffList.add(createStaff(staffRepo, encoder, "S003", "Vijay Kumar", "Asst Professor", "CS", "vijay@intuition.ac.in", "CS10965"));

            staffList.add(createStaff(staffRepo, encoder, "S004", "Priya Sharma", "Professor", "EC", "priya@intuition.ac.in", "EC10966"));
            staffList.add(createStaff(staffRepo, encoder, "S005", "Arun Balaji", "Asst Professor", "EC", "arun@intuition.ac.in", "EC10967"));
            staffList.add(createStaff(staffRepo, encoder, "S006", "Lakshmi R", "Asst Professor", "EC", "lakshmi@intuition.ac.in", "EC10968"));

            staffList.add(createStaff(staffRepo, encoder, "S007", "Suresh Kumar", "Professor", "ME", "suresh@intuition.ac.in", "ME10969"));
            staffList.add(createStaff(staffRepo, encoder, "S008", "Dinesh P", "Asst Professor", "ME", "dinesh@intuition.ac.in", "ME10970"));
            staffList.add(createStaff(staffRepo, encoder, "S009", "Kavitha M", "Asst Professor", "ME", "kavitha@intuition.ac.in", "ME10971"));

            staffList.add(createStaff(staffRepo, encoder, "S010", "Anitha Rajan", "Professor", "CV", "anitha@intuition.ac.in", "CV10972"));
            staffList.add(createStaff(staffRepo, encoder, "S011", "Mohan Das", "Asst Professor", "CV", "mohan@intuition.ac.in", "CV10973"));
            staffList.add(createStaff(staffRepo, encoder, "S012", "Saranya K", "Asst Professor", "CV", "saranya@intuition.ac.in", "CV10974"));

            staffList.add(createStaff(staffRepo, encoder, "S013", "Karthik Nair", "Professor", "IT", "karthik@intuition.ac.in", "IT10975"));
            staffList.add(createStaff(staffRepo, encoder, "S014", "Divya S", "Asst Professor", "IT", "divya@intuition.ac.in", "IT10976"));
            staffList.add(createStaff(staffRepo, encoder, "S015", "Prakash T", "Asst Professor", "IT", "prakash@intuition.ac.in", "IT10977"));

            // Generate other specific users based on roles needed
            createAdmin(staffRepo, encoder, "Administrator", "admin@intuition.ac.in", "ROLE_ADMIN");
            createAdmin(staffRepo, encoder, "COE Officer", "coe@intuition.ac.in", "ROLE_COE");
            createAdmin(staffRepo, encoder, "Finance Officer", "finance@intuition.ac.in", "ROLE_FINANCE");
            createAdmin(staffRepo, encoder, "Hostel Warden", "hostel@intuition.ac.in", "ROLE_WARDEN");
            createAdmin(staffRepo, encoder, "Librarian", "library@intuition.ac.in", "ROLE_LIBRARIAN");
            createAdmin(staffRepo, encoder, "Placement Officer", "placement@intuition.ac.in", "ROLE_PLACEMENT");
            createAdmin(staffRepo, encoder, "Staff Admin Officer", "staffadmin@intuition.ac.in", "ROLE_STAFFADMIN");
            // Parent created as Staff with ROLE_PARENT mapped for auth
            createAdmin(staffRepo, encoder, "Parent of Abinandhan K", "parent@gmail.com", "ROLE_PARENT");

            // 3. Students
            List<Student> students = new ArrayList<>();
            // CS
            students.add(createStudent(studentRepo, encoder, "7376241CS101", "Abinandhan K", "abi@gmail.com", "CS", "O+", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS102", "Preethi R", "preethi@gmail.com", "CS", "A+", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS103", "Surya M", "surya@gmail.com", "CS", "B+", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS104", "Dharani S", "dharani@gmail.com", "CS", "O-", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS105", "Keerthana V", "keerthana@gmail.com", "CS", "AB+", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS106", "Arun Prasad", "arunprasad@gmail.com", "CS", "A+", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS107", "Nithya Devi", "nithya@gmail.com", "CS", "B-", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS108", "Rajesh T", "rajesh@gmail.com", "CS", "O+", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS109", "Sowmiya P", "sowmiya@gmail.com", "CS", "A-", "IV"));
            students.add(createStudent(studentRepo, encoder, "7376241CS110", "Manikandan R", "mani@gmail.com", "CS", "AB-", "IV"));

            // Other Departments Auto Generate
            String[] depts = {"EC", "ME", "CV", "IT"};
            for (String dp : depts) {
                for (int i=1; i<=10; i++) {
                    String reg = "7376241" + dp + "1" + String.format("%02d", i);
                    students.add(createStudent(studentRepo, encoder, reg, "Student " + dp + " " + i, "student" + i + "@" + dp.toLowerCase() + ".com", dp, "O+", "IV"));
                }
            }

            // 4. Courses
            List<Course> csCourses = new ArrayList<>();
            csCourses.add(createCourse(courseRepo, "Data Structures & Algorithms", "CS401", 4, "CS"));
            csCourses.add(createCourse(courseRepo, "Database Management Systems", "CS402", 4, "CS"));
            csCourses.add(createCourse(courseRepo, "Operating Systems", "CS403", 3, "CS"));
            csCourses.add(createCourse(courseRepo, "Computer Networks", "CS404", 3, "CS"));
            csCourses.add(createCourse(courseRepo, "Software Engineering", "CS405", 3, "CS"));

            List<Course> ecCourses = new ArrayList<>();
            ecCourses.add(createCourse(courseRepo, "Digital Signal Processing", "EC401", 4, "EC"));
            ecCourses.add(createCourse(courseRepo, "VLSI Design", "EC402", 4, "EC"));
            ecCourses.add(createCourse(courseRepo, "Microprocessors", "EC403", 3, "EC"));
            ecCourses.add(createCourse(courseRepo, "Communication Systems", "EC404", 3, "EC"));
            ecCourses.add(createCourse(courseRepo, "Embedded Systems", "EC405", 3, "EC"));

            List<Course> meCourses = new ArrayList<>();
            meCourses.add(createCourse(courseRepo, "Thermodynamics", "ME401", 4, "ME"));
            meCourses.add(createCourse(courseRepo, "Fluid Mechanics", "ME402", 4, "ME"));

            List<Course> cvCourses = new ArrayList<>();
            cvCourses.add(createCourse(courseRepo, "Structural Analysis", "CV401", 4, "CV"));
            cvCourses.add(createCourse(courseRepo, "Concrete Technology", "CV402", 4, "CV"));

            List<Course> itCourses = new ArrayList<>();
            itCourses.add(createCourse(courseRepo, "Web Technologies", "IT401", 4, "IT"));
            itCourses.add(createCourse(courseRepo, "Python Programming", "IT402", 4, "IT"));

            // 5. Marks and Attendance
            for (Student s : students) {
                List<Course> cList;
                if (s.getDepartment().equals("CS")) cList = csCourses;
                else if (s.getDepartment().equals("EC")) cList = ecCourses;
                else if (s.getDepartment().equals("ME")) cList = meCourses;
                else if (s.getDepartment().equals("CV")) cList = cvCourses;
                else cList = itCourses;

                for (Course c : cList) {
                    // Marks
                    boolean isArrear = Math.random() < 0.1; // 10% chance of arrear
                    int c1 = isArrear ? 20 + (int)(Math.random() * 15) : 35 + (int)(Math.random() * 15);
                    int c2 = isArrear ? 20 + (int)(Math.random() * 15) : 35 + (int)(Math.random() * 15);
                    int mod = isArrear ? 40 + (int)(Math.random() * 20) : 70 + (int)(Math.random() * 30);
                    
                    if (s.getRegisterNumber().equals("7376241CS101") && c.getSubjectCode().equals("CS401")) { c1=42; c2=45; mod=87; }
                    if (s.getRegisterNumber().equals("7376241CS101") && c.getSubjectCode().equals("CS402")) { c1=38; c2=41; mod=79; }
                    if (s.getRegisterNumber().equals("7376241CS101") && c.getSubjectCode().equals("CS403")) { c1=46; c2=44; mod=91; }
                    if (s.getRegisterNumber().equals("7376241CS101") && c.getSubjectCode().equals("CS404")) { c1=35; c2=38; mod=72; }
                    if (s.getRegisterNumber().equals("7376241CS101") && c.getSubjectCode().equals("CS405")) { c1=40; c2=43; mod=83; }

                    createMark(markRepo, s, c, "CIA1", c1, 50);
                    createMark(markRepo, s, c, "CIA2", c2, 50);
                    createMark(markRepo, s, c, "Model", mod, 100);

                    // Attendance
                    int present = 35 + (int)(Math.random() * 10); // 35-45
                    if (s.getRegisterNumber().equals("7376241CS103") && c.getSubjectCode().equals("CS401")) present = 28;
                    if (s.getRegisterNumber().equals("7376241CS107") && c.getSubjectCode().equals("CS402")) present = 31;
                    if (s.getRegisterNumber().equals("7376241CS104") && c.getSubjectCode().equals("CS403")) present = 33;
                    
                    for (int j=0; j<45; j++) {
                        boolean isP = j < present;
                        createAttendance(attendanceRepo, s, c, LocalDate.now().minusDays(45-j), isP);
                    }
                }
                
                // Fees
                double rand = Math.random();
                if (rand < 0.6) { // 60% all paid
                    createFee(feeRepo, s, "Tuition Fee", 45000.0, "2026-03-31", "2026-02-15", "PAID", "RCP0" + s.getId());
                    createFee(feeRepo, s, "Exam Fee", 2500.0, "2026-04-15", "2026-03-10", "PAID", "RCP1" + s.getId());
                    createFee(feeRepo, s, "Lab Fee", 5000.0, "2026-03-31", "2026-02-20", "PAID", "RCP2" + s.getId());
                } else if (rand < 0.9) { // 30% partial
                    createFee(feeRepo, s, "Tuition Fee", 45000.0, "2026-03-31", "2026-03-25", "PAID", "RCP0" + s.getId());
                    createFee(feeRepo, s, "Exam Fee", 2500.0, "2026-04-15", null, "PENDING", null);
                    createFee(feeRepo, s, "Lab Fee", 5000.0, "2026-03-31", "2026-03-25", "PAID", "RCP2" + s.getId());
                } else { // 10% defaulter
                    createFee(feeRepo, s, "Tuition Fee", 45000.0, "2026-03-31", null, "PENDING", null);
                    createFee(feeRepo, s, "Exam Fee", 2500.0, "2026-04-15", null, "PENDING", null);
                    createFee(feeRepo, s, "Lab Fee", 5000.0, "2026-03-31", null, "PENDING", null);
                }
            }

            // 6. Timetable
            Staff s001 = staffRepo.findByStaffId("S001").orElse(staffList.get(0));
            Staff s002 = staffRepo.findByStaffId("S002").orElse(staffList.get(1));
            Staff s003 = staffRepo.findByStaffId("S003").orElse(staffList.get(2));
            
            createSlot(timetableRepo, s001, csCourses.get(0), "Monday", 1, "CS101", "IV", "A");
            createSlot(timetableRepo, s002, csCourses.get(1), "Monday", 2, "CS102", "IV", "A");
            createSlot(timetableRepo, s003, csCourses.get(2), "Monday", 3, "CS101", "IV", "A");
            createSlot(timetableRepo, s001, csCourses.get(3), "Monday", 4, "CS103", "IV", "A");
            createSlot(timetableRepo, s002, csCourses.get(4), "Monday", 5, "CS102", "IV", "A");

            createSlot(timetableRepo, s003, csCourses.get(2), "Tuesday", 1, "CS101", "IV", "A");
            createSlot(timetableRepo, s001, csCourses.get(0), "Tuesday", 2, "CS102", "IV", "A");
            createSlot(timetableRepo, s002, csCourses.get(4), "Tuesday", 3, "CS103", "IV", "A");
            createSlot(timetableRepo, s002, csCourses.get(1), "Tuesday", 4, "CS101", "IV", "A");
            createSlot(timetableRepo, s001, csCourses.get(3), "Tuesday", 5, "CS102", "IV", "A");

            // 7. Exam Schedule
            createExam(examRepo, csCourses.get(0), "Final", "2026-06-02", "09:00", "Hall A", 100, true);
            createExam(examRepo, csCourses.get(1), "Final", "2026-06-04", "09:00", "Hall B", 100, true);
            createExam(examRepo, csCourses.get(2), "Final", "2026-06-06", "14:00", "Hall A", 100, false);
            createExam(examRepo, csCourses.get(3), "Final", "2026-06-09", "09:00", "Hall C", 100, false);
            createExam(examRepo, csCourses.get(4), "Final", "2026-06-11", "14:00", "Hall B", 100, false);
            createExam(examRepo, ecCourses.get(0), "Final", "2026-06-03", "09:00", "Hall D", 100, true);

            // 8. Library Books
            LibraryBook b1 = createBook(bookRepo, "B001", "Introduction to Algorithms", "Cormen", "CS", "9780262033848", 5, 3);
            LibraryBook b2 = createBook(bookRepo, "B002", "Database System Concepts", "Silberschatz", "CS", "9780078022159", 4, 2);
            LibraryBook b3 = createBook(bookRepo, "B003", "Operating System Concepts", "Galvin", "CS", "9781118063330", 4, 4);
            LibraryBook b4 = createBook(bookRepo, "B004", "Computer Networks", "Tanenbaum", "CS", "9780132126953", 3, 1);
            LibraryBook b5 = createBook(bookRepo, "B005", "Software Engineering", "Pressman", "CS", "9780078022128", 3, 3);
            LibraryBook b6 = createBook(bookRepo, "B006", "Digital Signal Processing", "Proakis", "EC", "9780131873742", 4, 3);
            LibraryBook b7 = createBook(bookRepo, "B007", "VLSI Design", "Weste", "EC", "9780321547743", 3, 2);
            LibraryBook b8 = createBook(bookRepo, "B008", "Microprocessor Architecture", "Brey", "EC", "9780135026458", 4, 4);
            LibraryBook b9 = createBook(bookRepo, "B009", "Engineering Mathematics Vol 1", "Grewal", "ALL", "9788121935906", 8, 5);
            LibraryBook b16 = createBook(bookRepo, "B016", "Web Technologies", "Godbole", "IT", "9780070146839", 5, 3);
            LibraryBook b17 = createBook(bookRepo, "B017", "Python Programming", "Guido", "IT/CS", "9780596009427", 6, 4);
            LibraryBook b18 = createBook(bookRepo, "B018", "Machine Learning", "Mitchell", "CS/IT", "9780070428072", 4, 2);
            LibraryBook b20 = createBook(bookRepo, "B020", "Clean Code", "Martin", "ALL", "9780132350884", 5, 3);

            // Library Issues
            createIssue(issueRepo, students.get(0), b1, "2026-04-20", "2026-05-04", null, "OVERDUE", 24.0);
            createIssue(issueRepo, students.get(1), b17, "2026-05-01", "2026-05-15", null, "OVERDUE", 2.0);
            createIssue(issueRepo, students.get(2), b9, "2026-05-10", "2026-05-24", null, "ISSUED", 0.0);
            createIssue(issueRepo, students.get(3), b18, "2026-05-12", "2026-05-26", null, "ISSUED", 0.0);
            
            createIssue(issueRepo, students.get(0), b2, "2026-03-01", "2026-03-14", "2026-03-14", "RETURNED", 0.0);
            createIssue(issueRepo, students.get(1), b20, "2026-03-05", "2026-03-20", "2026-03-20", "RETURNED", 0.0);
            createIssue(issueRepo, students.get(2), b17, "2026-03-10", "2026-04-01", "2026-04-01", "RETURNED", 34.0);

            // 9. Hostel Rooms & Allocations
            HostelRoom a101 = createRoom(roomRepo, "A101", "Block A", 1, 4, 4);
            HostelRoom a102 = createRoom(roomRepo, "A102", "Block A", 1, 4, 3);
            HostelRoom a103 = createRoom(roomRepo, "A103", "Block A", 1, 4, 2);
            
            createAllocation(hostelAllocRepo, students.get(0), a101, "Bed 1");
            createAllocation(hostelAllocRepo, students.get(1), a101, "Bed 2");
            createAllocation(hostelAllocRepo, students.get(10), a101, "Bed 3");
            createAllocation(hostelAllocRepo, students.get(20), a101, "Bed 4");

            createAllocation(hostelAllocRepo, students.get(2), a102, "Bed 1");
            createAllocation(hostelAllocRepo, students.get(3), a102, "Bed 2");
            createAllocation(hostelAllocRepo, students.get(11), a102, "Bed 3");

            // Hostel Complaints
            createComplaint(complaintRepo, students.get(0), "Electrical", "Fan in room A101 not working", "2026-05-10", "RESOLVED");
            createComplaint(complaintRepo, students.get(2), "Plumbing", "Tap leaking in bathroom", "2026-05-12", "IN_PROGRESS");
            createComplaint(complaintRepo, students.get(1), "Cleanliness", "Room not cleaned for 3 days", "2026-05-14", "OPEN");

            // Mess Menu
            createMenu(messRepo, "Monday", "Idli (3) + Sambar + Coconut Chutney", "Rice + Dal + Rajma + Papad + Curd", "Bread Toast + Tea", "Chapati (3) + Paneer Butter Masala + Rice + Dal");
            createMenu(messRepo, "Tuesday", "Dosa (2) + Chutney + Sambar", "Rice + Sambar + Potato Fry + Appalam + Buttermilk", "Vada + Coffee", "Chapati + Chicken Curry + Rice + Raita");

            // 10. Placement Companies
            Company tcs = createCompany(companyRepo, "TCS", "IT Services", "2026-07-15", 6.0, "Upcoming", "3.5-7 LPA");
            Company infosys = createCompany(companyRepo, "Infosys", "IT Services", "2026-07-22", 6.5, "Upcoming", "4-8 LPA");
            Company wipro = createCompany(companyRepo, "Wipro", "IT Services", "2026-08-05", 6.0, "Upcoming", "3.5-6 LPA");
            Company zoho = createCompany(companyRepo, "Zoho", "Product", "2026-08-12", 7.5, "Upcoming", "6-12 LPA");

            // Placement Applications
            createApp(placementAppRepo, students.get(0), zoho, "2025-12-01", "PLACED", "8 LPA");
            createApp(placementAppRepo, students.get(1), tcs, "2025-11-10", "PLACED", "4.5 LPA");
            createApp(placementAppRepo, students.get(10), infosys, "2025-11-20", "PLACED", "5 LPA");

            // 11. Announcements & Events
            createAnnouncement(announcementRepo, "Final Exam Hall Tickets Released for CS and EC departments", "Admin", "2026-05-14", "URGENT");
            createAnnouncement(announcementRepo, "Fee payment last date extended to May 30, 2026", "Finance", "2026-05-12", "IMPORTANT");
            createAnnouncement(announcementRepo, "Library will remain closed on May 19 (holiday)", "Library", "2026-05-11", "NORMAL");

            createEvent(eventRepo, "Buddha Purnima", "College Holiday", "2026-05-19", "Holiday");
            createEvent(eventRepo, "Sports Day 2026", "Annual sports meet", "2026-06-01", "Event");

            // 12. Leaves
            createStaffLeave(staffLeaveRepo, s001, "Medical", "2026-05-05", "2026-05-07", 3, "APPROVED");
            createStaffLeave(staffLeaveRepo, s002, "Casual", "2026-05-10", "2026-05-10", 1, "APPROVED");
            createStaffLeave(staffLeaveRepo, s003, "Duty", "2026-05-15", "2026-05-16", 2, "PENDING");

            createStudentLeave(studentLeaveRepo, students.get(0), "Medical", "2026-04-28", "2026-04-29", 2, "APPROVED");
            createStudentLeave(studentLeaveRepo, students.get(1), "Casual", "2026-05-02", "2026-05-02", 1, "APPROVED");
            createStudentLeave(studentLeaveRepo, students.get(2), "Medical", "2026-05-10", "2026-05-12", 3, "PENDING");

            // 13. Payroll
            for (Staff st : staffList) {
                if (st.getDesignation().equals("Professor")) {
                    createPayroll(payrollRepo, st, "May 2026", 80000.0, 20000.0, 15000.0, 85000.0, "PROCESSED");
                } else {
                    createPayroll(payrollRepo, st, "May 2026", 55000.0, 15000.0, 10000.0, 60000.0, "PROCESSED");
                }
            }

            // 14. Security Logs
            createLog(logRepo, "abi@gmail.com", "STUDENT", "LOGIN", "192.168.1.10", "SUCCESS", "2026-05-16 08:15");
            createLog(logRepo, "raj@intuition.ac.in", "STAFF", "LOGIN", "192.168.1.11", "SUCCESS", "2026-05-16 08:20");
            createLog(logRepo, "admin@intuition.ac.in", "ADMIN", "LOGIN", "192.168.1.1", "SUCCESS", "2026-05-16 08:22");
            createLog(logRepo, "unknown@test.com", "UNKNOWN", "LOGIN", "203.45.67.89", "FAILED", "2026-05-16 08:45");

            System.out.println("Data Seeding Completed Successfully.");
        };
    }

    private Department createDept(DepartmentRepository repo, String name, String code, String hod) {
        Department d = new Department();
        d.setName(name);
        d.setShortForm(code);
        return repo.save(d);
    }

    private Staff createStaff(StaffRepository repo, PasswordEncoder encoder, String staffId, String name, String desig, String dept, String email, String empId) {
        Staff s = new Staff();
        s.setStaffId(staffId);
        s.setName(name);
        s.setDesignation(desig);
        s.setDepartment(dept);
        s.setEmail(email);
        s.setEmployeeId(empId);
        s.setRole("ROLE_STAFF");
        s.setPassword(encoder.encode("password"));
        return repo.save(s);
    }

    private Staff createAdmin(StaffRepository repo, PasswordEncoder encoder, String name, String email, String role) {
        Staff s = new Staff();
        s.setName(name);
        s.setEmail(email);
        s.setRole(role);
        s.setDepartment("Admin");
        s.setStaffId("A" + (int)(Math.random() * 1000));
        s.setPassword(encoder.encode("password"));
        return repo.save(s);
    }

    private Student createStudent(StudentRepository repo, PasswordEncoder encoder, String regNo, String name, String email, String dept, String blood, String sem) {
        Student s = new Student();
        s.setRegisterNumber(regNo);
        s.setName(name);
        s.setEmail(email);
        s.setDepartment(dept);
        s.setBloodGroup(blood);
        s.setSemester(sem);
        s.setRole("ROLE_STUDENT");
        s.setPassword(encoder.encode("password"));
        return repo.save(s);
    }

    private Course createCourse(CourseRepository repo, String name, String code, int cred, String dept) {
        Course c = new Course();
        c.setSubjectName(name);
        c.setSubjectCode(code);
        c.setCredits(cred);
        c.setDepartment(dept);
        return repo.save(c);
    }

    private Mark createMark(MarkRepository repo, Student s, Course c, String type, int score, int max) {
        Mark m = new Mark();
        m.setStudent(s);
        m.setCourse(c);
        m.setExamType(type);
        m.setScore(score);
        m.setMaxScore(max);
        return repo.save(m);
    }

    private Attendance createAttendance(AttendanceRepository repo, Student s, Course c, LocalDate date, boolean present) {
        Attendance a = new Attendance();
        a.setStudent(s);
        a.setCourse(c);
        a.setDate(date);
        a.setPresent(present);
        return repo.save(a);
    }

    private FeePayment createFee(FeePaymentRepository repo, Student s, String type, double amt, String due, String paid, String status, String rec) {
        FeePayment f = new FeePayment();
        f.setStudent(s);
        f.setFeeType(type);
        f.setAmount(amt);
        f.setDueDate(due);
        f.setPaidDate(paid);
        f.setStatus(status);
        f.setReceiptNumber(rec);
        return repo.save(f);
    }

    private TimetableSlot createSlot(TimetableSlotRepository repo, Staff st, Course c, String day, int period, String room, String year, String sec) {
        TimetableSlot t = new TimetableSlot();
        t.setStaff(st);
        t.setSubject(c);
        t.setDay(day);
        t.setPeriod(period);
        t.setRoomNumber(room);
        t.setYear(year);
        t.setSection(sec);
        return repo.save(t);
    }

    private ExamSchedule createExam(ExamScheduleRepository repo, Course c, String type, String date, String time, String venue, int max, boolean hall) {
        ExamSchedule e = new ExamSchedule();
        e.setSubject(c);
        e.setExamType(type);
        e.setDate(date);
        e.setTime(time);
        e.setVenue(venue);
        e.setMaxMarks(max);
        e.setHallTicketReleased(hall);
        return repo.save(e);
    }

    private LibraryBook createBook(LibraryBookRepository repo, String code, String title, String author, String dept, String isbn, int copies, int avail) {
        LibraryBook b = new LibraryBook();
        b.setTitle(title);
        b.setAuthor(author);
        b.setCategory(dept);
        b.setIsbn(isbn);
        b.setTotalCopies(copies);
        b.setAvailableCopies(avail);
        return repo.save(b);
    }

    private LibraryIssue createIssue(LibraryIssueRepository repo, Student s, LibraryBook b, String issue, String due, String ret, String status, double fine) {
        LibraryIssue i = new LibraryIssue();
        i.setStudent(s);
        i.setBook(b);
        i.setIssueDate(issue);
        i.setDueDate(due);
        i.setReturnDate(ret);
        i.setFinePaid(fine);
        return repo.save(i);
    }

    private HostelRoom createRoom(HostelRoomRepository repo, String num, String block, int floor, int cap, int occ) {
        HostelRoom r = new HostelRoom();
        r.setRoomNumber(num);
        r.setBlock(block);
        r.setFloor(floor);
        r.setTotalBeds(cap);
        r.setStatus(occ < cap ? "AVAILABLE" : "FULL");
        return repo.save(r);
    }

    private HostelAllocation createAllocation(HostelAllocationRepository repo, Student s, HostelRoom r, String bed) {
        HostelAllocation a = new HostelAllocation();
        a.setStudent(s);
        a.setRoom(r);
        a.setBedNumber(bed);
        a.setAllocatedOn(LocalDate.now().toString());
        return repo.save(a);
    }

    private HostelComplaint createComplaint(HostelComplaintRepository repo, Student s, String type, String desc, String date, String status) {
        HostelComplaint c = new HostelComplaint();
        c.setStudent(s);
        c.setPriority("NORMAL");
        c.setDescription(type + " - " + desc);
        c.setCreatedAt(date);
        c.setStatus(status);
        return repo.save(c);
    }

    private MessMenu createMenu(MessMenuRepository repo, String day, String b, String l, String s, String d) {
        MessMenu m = new MessMenu();
        m.setDay(day);
        m.setBreakfast(b);
        m.setLunch(l);
        m.setSnacks(s);
        m.setDinner(d);
        return repo.save(m);
    }

    private Company createCompany(CompanyRepository repo, String name, String ind, String date, double min, String stat, String pack) {
        Company c = new Company();
        c.setCompanyName(name);
        c.setIndustry(ind);
        c.setDriveDate(date);
        c.setMinCGPA(min);
        c.setStatus(stat);
        c.setPackageRange(pack);
        return repo.save(c);
    }

    private PlacementApplication createApp(PlacementApplicationRepository repo, Student s, Company c, String date, String stat, String pack) {
        PlacementApplication p = new PlacementApplication();
        p.setStudent(s);
        p.setCompany(c);
        p.setAppliedOn(date);
        p.setStatus(stat);
        p.setPackageOffered(pack);
        return repo.save(p);
    }

    private Announcement createAnnouncement(AnnouncementRepository repo, String title, String author, String date, String prio) {
        Announcement a = new Announcement();
        a.setTitle(title);
        a.setSentBy(author);
        a.setSentAt(date);
        a.setPriority(prio);
        return repo.save(a);
    }

    private Event createEvent(EventRepository repo, String name, String desc, String date, String type) {
        Event e = new Event();
        e.setTitle(name);
        e.setDescription(desc);
        e.setDate(date);
        e.setType(type);
        return repo.save(e);
    }

    private StaffLeave createStaffLeave(StaffLeaveRepository repo, Staff s, String type, String from, String to, int days, String stat) {
        StaffLeave l = new StaffLeave();
        l.setStaff(s);
        l.setLeaveType(type);
        l.setFromDate(from);
        l.setToDate(to);
        l.setDays(days);
        l.setStatus(stat);
        return repo.save(l);
    }

    private StudentLeave createStudentLeave(StudentLeaveRepository repo, Student s, String type, String from, String to, int days, String stat) {
        StudentLeave l = new StudentLeave();
        l.setStudent(s);
        l.setLeaveType(type);
        l.setFromDate(from);
        l.setToDate(to);
        l.setDays(days);
        l.setStatus(stat);
        return repo.save(l);
    }

    private Payroll createPayroll(PayrollRepository repo, Staff s, String month, double b, double a, double d, double net, String stat) {
        Payroll p = new Payroll();
        p.setStaff(s);
        p.setMonth(month);
        p.setBasicPay(b);
        p.setAllowances(a);
        p.setDeductions(d);
        p.setNetPay(net);
        p.setStatus(stat);
        return repo.save(p);
    }

    private SecurityLog createLog(SecurityLogRepository repo, String email, String role, String action, String ip, String status, String time) {
        SecurityLog l = new SecurityLog();
        l.setUserEmail(email);
        l.setRole(role);
        l.setAction(action);
        l.setIpAddress(ip);
        l.setStatus(status);
        l.setTimestamp(time);
        return repo.save(l);
    }
}
