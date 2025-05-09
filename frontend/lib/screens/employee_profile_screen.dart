// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/material.dart';
import 'edit_profile_screen.dart'; // Ensure this import exists

class EmployeeProfileScreen extends StatefulWidget {
  final Map<String, dynamic> initialData;
  final void Function(Map<String, dynamic>) onProfileUpdated;

  const EmployeeProfileScreen({
    super.key,
    required this.initialData,
    required this.onProfileUpdated,
  });

  @override
  _EmployeeProfileScreenState createState() => _EmployeeProfileScreenState();
}

class _EmployeeProfileScreenState extends State<EmployeeProfileScreen> {
  late Map<String, dynamic> profileData;

  @override
  void initState() {
    super.initState();
    // Initialize the profile data from the initialData passed to the widget
    profileData = widget.initialData;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Employee Profile'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Displaying Name
            Text(
              'Name: ${profileData['name']}',
              style: const TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 10),

            // Displaying Role
            Text(
              'Role: ${profileData['role']}',
              style: const TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 30),

            // Edit Profile Button
            Center(
              child: ElevatedButton(
                onPressed: () async {
                  // Navigate to EditProfileScreen
                  final updatedData = await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => EditProfileScreen(
                        initialData: profileData,
                        onProfileUpdated: (updatedData) {
                          setState(() {
                            // Update local profile data with new values
                            profileData = updatedData;
                          });
                          widget.onProfileUpdated(updatedData);
                        },
                      ),
                    ),
                  );

                  // Update profile data when returning from EditProfileScreen
                  if (updatedData != null) {
                    setState(() {
                      profileData = updatedData;
                    });
                    widget.onProfileUpdated(updatedData);
                  }
                },
                child: const Text('Edit Profile'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
