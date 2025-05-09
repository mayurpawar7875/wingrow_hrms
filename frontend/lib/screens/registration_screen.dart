import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({super.key});

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _employeeIdController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  String? selectedDesignation;
  bool isLoading = false;
  String? errorMessage;

  // List of designations
  final List<String> designations = [
    'Organizer',
    'Market Manager',
    'BDM',
    'BMS Executive',
    'HR',
    'Accountant',
  ];

  Future<void> _registerEmployee() async {
    final firstName = _firstNameController.text.trim();
    final lastName = _lastNameController.text.trim();
    final username = _usernameController.text.trim();
    final employeeId = _employeeIdController.text.trim();
    final password = _passwordController.text;

    // Validate input fields
    if (firstName.isEmpty ||
        lastName.isEmpty ||
        username.isEmpty ||
        selectedDesignation == null ||
        employeeId.isEmpty ||
        password.isEmpty) {
      setState(() {
        errorMessage = "All fields are required.";
      });
      return;
    }

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final apiService = ApiService();
      await apiService.registerEmployee(
        firstName: firstName,
        lastName: lastName,
        username: username,
        designation: selectedDesignation!,
        employeeId: employeeId,
        password: password,
      );
      // Show success message and navigate back or clear the form
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Employee registered successfully!"),
          backgroundColor: Colors.green,
        ),
      );
      _clearForm();
      Navigator.pushNamed(context, '/login');
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void _clearForm() {
    _firstNameController.clear();
    _lastNameController.clear();
    _usernameController.clear();
    _employeeIdController.clear();
    _passwordController.clear();
    setState(() {
      selectedDesignation = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Employee Registration"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (errorMessage != null)
                Text(
                  errorMessage!,
                  style: const TextStyle(color: Colors.red),
                ),
              const SizedBox(height: 10),
              TextField(
                controller: _firstNameController,
                decoration: const InputDecoration(
                  labelText: "First Name",
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _lastNameController,
                decoration: const InputDecoration(
                  labelText: "Last Name",
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _usernameController,
                decoration: const InputDecoration(
                  labelText: "Username",
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                value: selectedDesignation,
                onChanged: (value) {
                  setState(() {
                    selectedDesignation = value;
                  });
                },
                items: designations.map((designation) {
                  return DropdownMenuItem(
                    value: designation,
                    child: Text(designation),
                  );
                }).toList(),
                decoration: const InputDecoration(
                  labelText: "Designation",
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _employeeIdController,
                decoration: const InputDecoration(
                  labelText: "Employee ID",
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: "Password",
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: isLoading ? null : _registerEmployee,
                child: isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Register"),
              ),
              const SizedBox(height: 20),
              Center(
                child: GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, '/login');
                  },
                  child: const Text(
                    "Already have an account? Login here.",
                    style: TextStyle(
                      color: Colors.blue,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
