import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/employee_profile_screen.dart';
import 'screens/edit_profile_screen.dart';
import 'screens/attendance_screen.dart';
import 'screens/leave_management_screen.dart';
import 'screens/registration_screen.dart';
import 'services/api_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Wingrow Market',
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      initialRoute: '/', // Initial Route
      routes: {
        '/': (context) => const LoginScreen(), // Home route (Login)
        '/registration': (context) => const RegistrationPage(), // Registration
        '/dashboard': (context) => const DashboardScreen(), // Dashboard
        '/attendance': (context) => const AttendanceScreen(), // Attendance
        '/leaves': (context) =>
            const LeaveManagementScreen(), // Leave Management
        '/profile': (context) => FutureBuilder<Map<String, dynamic>>(
              future: ApiService()
                  .getUserProfile(), // Fetch user profile dynamically
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Scaffold(
                    body: Center(
                      child: Text(
                        'Failed to load profile: ${snapshot.error}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  );
                } else if (snapshot.hasData) {
                  return EmployeeProfileScreen(
                    initialData: snapshot.data!,
                    onProfileUpdated: (updatedData) {
                      // Handle profile updates
                      print('Profile Updated: $updatedData');
                    },
                  );
                } else {
                  return const Scaffold(
                    body: Center(
                      child: Text('No profile data available.'),
                    ),
                  );
                }
              },
            ),
        '/edit-profile': (context) => FutureBuilder<Map<String, dynamic>>(
              future: ApiService()
                  .getUserProfile(), // Fetch user profile dynamically
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Scaffold(
                    body: Center(
                      child: Text(
                        'Failed to load profile: ${snapshot.error}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  );
                } else if (snapshot.hasData) {
                  return EditProfileScreen(
                    initialData: snapshot.data!,
                    onProfileUpdated: (updatedData) {
                      // Handle profile updates
                      print('Profile Updated from Edit: $updatedData');
                    },
                  );
                } else {
                  return const Scaffold(
                    body: Center(
                      child: Text('No profile data available.'),
                    ),
                  );
                }
              },
            ),
      },
    );
  }
}
