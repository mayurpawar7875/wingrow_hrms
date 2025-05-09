import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome to Wingrow Market Dashboard!',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 30),

            // Profile Button
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/profile');
              },
              child: const Text('View Profile'),
            ),
            const SizedBox(height: 15),

            // Attendance Button
            ElevatedButton(
              onPressed: () {
                // Replace with your attendance route
                Navigator.pushNamed(context, '/attendance');
              },
              child: const Text('Attendance'),
            ),
            const SizedBox(height: 15),

            // Leave Management Button
            ElevatedButton(
              onPressed: () {
                // Replace with your leave management route
                Navigator.pushNamed(context, '/leaves');
              },
              child: const Text('Leave Management'),
            ),
            const SizedBox(height: 15),

            // Logout Button
            ElevatedButton(
              onPressed: () {
                Navigator.popUntil(context, ModalRoute.withName('/'));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
              ),
              child: const Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }
}
