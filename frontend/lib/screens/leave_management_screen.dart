// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/material.dart';

class LeaveManagementScreen extends StatefulWidget {
  const LeaveManagementScreen({super.key});

  @override
  _LeaveManagementScreenState createState() => _LeaveManagementScreenState();
}

class _LeaveManagementScreenState extends State<LeaveManagementScreen> {
  final TextEditingController startDateController = TextEditingController();
  final TextEditingController endDateController = TextEditingController();
  final TextEditingController reasonController = TextEditingController();

  List<Map<String, String>> leaveRequests = []; // Leave request history

  @override
  void initState() {
    super.initState();
    fetchLeaveRequests(); // Fetch leave requests when the screen loads
  }

  void fetchLeaveRequests() async {
    // Call your leave requests API here
    // For now, we are using mock data
    setState(() {
      leaveRequests = [
        {
          'startDate': '2024-12-10',
          'endDate': '2024-12-12',
          'status': 'Approved'
        },
        {
          'startDate': '2024-12-05',
          'endDate': '2024-12-06',
          'status': 'Pending'
        },
      ];
    });
  }

  void submitLeaveRequest() async {
    // Call your leave request API here
    setState(() {
      leaveRequests.add({
        'startDate': startDateController.text,
        'endDate': endDateController.text,
        'status': 'Pending',
      });
      startDateController.clear();
      endDateController.clear();
      reasonController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Leave Management'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Leave Request Form
            const Text(
              'Request Leave:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: startDateController,
              decoration: const InputDecoration(labelText: 'Start Date'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: endDateController,
              decoration: const InputDecoration(labelText: 'End Date'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(labelText: 'Reason'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: submitLeaveRequest,
              child: const Text('Submit Request'),
            ),
            const SizedBox(height: 30),

            // Leave Requests Section
            const Text(
              'Leave Requests:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            Expanded(
              child: ListView.builder(
                itemCount: leaveRequests.length,
                itemBuilder: (context, index) {
                  final request = leaveRequests[index];
                  return ListTile(
                    title: Text(
                        'From: ${request['startDate']} To: ${request['endDate']}'),
                    subtitle: Text('Status: ${request['status']}'),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
