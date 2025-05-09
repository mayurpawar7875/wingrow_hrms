import 'package:flutter/material.dart';

class EmployeeDashboard extends StatelessWidget {
  const EmployeeDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Employee Dashboard"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Section
            Card(
              elevation: 4,
              child: ListTile(
                leading: const Icon(Icons.person, size: 40),
                title: const Text(
                  "John Doe", // Replace with dynamic data
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                subtitle: const Text("Employee ID: E12345"), // Dynamic data
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () {
                    // Add edit functionality if required
                  },
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Attendance Section
            Card(
              elevation: 4,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text(
                      "Attendance",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          // Call check-in API
                        },
                        child: const Text("Check-In"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          // Call check-out API
                        },
                        child: const Text("Check-Out"),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Leave Section
            Card(
              elevation: 4,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text(
                      "Leave Requests",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      // Navigate to leave request screen
                      Navigator.pushNamed(context, '/leaveRequest');
                    },
                    child: const Text("Request Leave"),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Payroll Section
            Card(
              elevation: 4,
              child: ListTile(
                leading: const Icon(Icons.receipt),
                title: const Text(
                  "View Latest Payslip",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                onTap: () {
                  // Navigate to payslip screen or download functionality
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
