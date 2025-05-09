import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import 'package:geolocator/geolocator.dart';
import 'package:intl/intl.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  _AttendanceScreenState createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  bool isLoading = false;
  String? selectedMarket;
  String? selectedDate;
  List<String> markets = [];
  bool isMarketLocked = false;
  bool isDateLocked = false;
  List<Map<String, String>> stallConfirmationList = [];

  final TextEditingController _stallNameController = TextEditingController();
  final TextEditingController _farmerNameController = TextEditingController();
  final TextEditingController _dateController = TextEditingController();

  @override
  void initState() {
    super.initState();
    requestLocationPermission();
    fetchMarkets();
  }

  void showSnackBar(String message, bool isSuccess) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isSuccess ? Colors.green : Colors.red,
      ),
    );
  }

  Future<void> requestLocationPermission() async {
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      await Geolocator.requestPermission();
    }
  }

  Future<void> fetchMarkets() async {
    try {
      final apiService = ApiService();
      List<String> fetchedMarkets = await apiService.getMarkets();
      setState(() => markets = fetchedMarkets);
    } catch (e) {
      showSnackBar('Failed to fetch markets: $e', false);
    }
  }

  void addStallToConfirmationList() {
    if (_stallNameController.text.isEmpty ||
        _farmerNameController.text.isEmpty) {
      showSnackBar('Both Stall Name and Farmer Name are required!', false);
      return;
    }
    setState(() {
      stallConfirmationList.add({
        'stallName': _stallNameController.text,
        'farmerName': _farmerNameController.text,
      });
      _stallNameController.clear();
      _farmerNameController.clear();
    });
  }

  void openStallConfirmationSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 16,
          right: 16,
          top: 20,
        ),
        child: Center(
          child: SingleChildScrollView(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Align(
                    alignment: Alignment.topLeft,
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                  DropdownButtonFormField<String>(
                    decoration:
                        const InputDecoration(labelText: 'Select Market'),
                    value: selectedMarket,
                    items: markets.map((market) {
                      return DropdownMenuItem(
                          value: market, child: Text(market));
                    }).toList(),
                    onChanged: isMarketLocked
                        ? null
                        : (value) {
                            setState(() {
                              selectedMarket = value;
                              isMarketLocked = true;
                            });
                          },
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    controller: _dateController,
                    readOnly: true,
                    decoration: const InputDecoration(labelText: 'Select Date'),
                    onTap: isDateLocked
                        ? null
                        : () async {
                            DateTime? picked = await showDatePicker(
                              context: context,
                              initialDate: DateTime.now(),
                              firstDate: DateTime.now()
                                  .subtract(const Duration(days: 1)),
                              lastDate:
                                  DateTime.now().add(const Duration(days: 30)),
                            );
                            if (picked != null) {
                              setState(() {
                                selectedDate =
                                    DateFormat('yyyy-MM-dd').format(picked);
                                _dateController.text = selectedDate!;
                                isDateLocked = true;
                              });
                            }
                          },
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _stallNameController,
                    decoration: const InputDecoration(labelText: 'Stall Name'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _farmerNameController,
                    decoration: const InputDecoration(labelText: 'Farmer Name'),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton.icon(
                    onPressed: addStallToConfirmationList,
                    icon: const Icon(Icons.add),
                    label: const Text("Add Stall"),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton.icon(
                    onPressed: previewStallList,
                    icon: const Icon(Icons.visibility),
                    label: const Text("Preview Stall List"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void previewStallList() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Preview Stall Confirmation List"),
        content: SizedBox(
          height: 300,
          width: 300,
          child: ListView(
            children: stallConfirmationList.map((stall) {
              return ListTile(
                title: Text("${stall['stallName']} - ${stall['farmerName']}"),
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    setState(() => stallConfirmationList.remove(stall));
                    Navigator.pop(context);
                    previewStallList();
                  },
                ),
              );
            }).toList(),
          ),
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              submitStallConfirmationList();
              Navigator.pop(context);
            },
            child: const Text("Confirm & Submit"),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
        ],
      ),
    );
  }

  Future<void> submitStallConfirmationList() async {
    if (selectedMarket == null || selectedDate == null) {
      showSnackBar('❌ Please select market and date!', false);
      return;
    }
    if (stallConfirmationList.isEmpty) {
      showSnackBar('❌ Add stalls before submission!', false);
      return;
    }
    setState(() => isLoading = true);
    try {
      final apiService = ApiService();
      await apiService.submitStallConfirmation(
          selectedMarket!, selectedDate!, stallConfirmationList);
      showSnackBar('✅ Stall confirmation submitted!', true);
      setState(() => stallConfirmationList.clear());
    } catch (e) {
      showSnackBar('❌ Failed to submit: $e', false);
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> uploadGPSWithFaceDetection() async {
    if (selectedMarket == null || selectedDate == null) {
      showSnackBar('❌ Please select a market and date!', false);
      return;
    }
    try {
      Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(source: ImageSource.camera);
      if (pickedFile == null) {
        showSnackBar("❌ No selfie captured", false);
        return;
      }
      final apiService = ApiService();
      await apiService.uploadGPSWithSelfie(
        latitude: position.latitude,
        longitude: position.longitude,
        selfiePath: pickedFile.path,
      );
      showSnackBar("✅ GPS and selfie uploaded!", true);
    } catch (e) {
      showSnackBar("❌ Failed to upload GPS/selfie: $e", false);
    }
  }

  Future<void> pickAndUploadMarketVideo() async {
    if (selectedMarket == null || selectedDate == null) {
      showSnackBar('❌ Please select a market and date first!', false);
      return;
    }
    final picker = ImagePicker();
    final pickedFile = await picker.pickVideo(source: ImageSource.gallery);
    if (pickedFile != null) {
      try {
        final apiService = ApiService();
        await apiService.uploadFileWithData(
          filePath: pickedFile.path,
          fileType: 'market_video',
          marketName: selectedMarket!,
          marketDate: selectedDate!,
        );
        showSnackBar("✅ Market video uploaded!", true);
      } catch (e) {
        showSnackBar("❌ Failed to upload market video: $e", false);
      }
    }
  }

  Future<void> pickAndUploadMarketCleaningVideo() async {
    if (selectedMarket == null || selectedDate == null) {
      showSnackBar('❌ Please select a market and date first!', false);
      return;
    }
    final picker = ImagePicker();
    final pickedFile = await picker.pickVideo(source: ImageSource.gallery);
    if (pickedFile != null) {
      try {
        final apiService = ApiService();
        await apiService.uploadFileWithData(
          filePath: pickedFile.path,
          fileType: 'cleaning_video',
          marketName: selectedMarket!,
          marketDate: selectedDate!,
        );
        showSnackBar("✅ Cleaning video uploaded!", true);
      } catch (e) {
        showSnackBar("❌ Failed to upload cleaning video: $e", false);
      }
    }
  }

  Widget taskButton(String title, IconData icon, VoidCallback onPressed) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 5),
      child: ElevatedButton.icon(
        onPressed: isLoading ? null : onPressed,
        icon: Icon(icon, color: Colors.white),
        label: Text(title, style: const TextStyle(color: Colors.white)),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.deepPurple,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Attendance Management')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (isLoading) const LinearProgressIndicator(),
            taskButton("🗂 Upload Stall Confirmation List", Icons.table_chart,
                openStallConfirmationSheet),
            taskButton("📍 Upload GPS + Face Detection", Icons.face,
                uploadGPSWithFaceDetection),
            taskButton("📹 Upload Market Video", Icons.video_library,
                pickAndUploadMarketVideo),
            taskButton("🧹 Upload Market Cleaning Video",
                Icons.cleaning_services, pickAndUploadMarketCleaningVideo),
          ],
        ),
      ),
    );
  }
}
