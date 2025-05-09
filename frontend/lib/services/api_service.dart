import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart'; // important

class ApiService {
  final String baseUrl = 'http://localhost:5000/api'; // 🔥 Your backend base

  // ✅ Retrieve token
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // ✅ Retrieve user ID
  Future<String?> _getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userId');
  }

  // ✅ Get headers
  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // ✅ Get Market List
  Future<List<String>> getMarkets() async {
    final headers = await _getHeaders();
    final response =
        await http.get(Uri.parse('$baseUrl/market/list'), headers: headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((market) => market["location"].toString()).toList();
    } else {
      throw Exception('❌ Failed to fetch markets: ${response.body}');
    }
  }

  // ✅ Register Employee
  Future<void> registerEmployee({
    required String firstName,
    required String lastName,
    required String username,
    required String designation,
    required String employeeId,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/employees/register'),
      headers: await _getHeaders(),
      body: json.encode({
        'firstName': firstName,
        'lastName': lastName,
        'username': username,
        'designation': designation,
        'employeeId': employeeId,
        'password': password,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('❌ Employee registration failed: ${response.body}');
    }
  }

  // ✅ Login
  Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      await prefs.setString('userId', data['userId']);
      return data;
    } else {
      throw Exception('❌ Login failed: ${response.body}');
    }
  }

  // ✅ Fetch User Profile
  Future<Map<String, dynamic>> getUserProfile() async {
    final userId = await _getUserId();
    if (userId == null) throw Exception('User ID not found.');

    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/employees/profile?userId=$userId'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('❌ Failed to fetch profile: ${response.body}');
    }
  }

  // ✅ Submit Stall Confirmation
  Future<void> submitStallConfirmation(String marketName, String marketDate,
      List<Map<String, String>> stalls) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/stalls/submit-confirmation'),
      headers: headers,
      body: json.encode({
        'marketName': marketName,
        'marketDate': marketDate,
        'stalls': stalls,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('❌ Stall confirmation failed: ${response.body}');
    }
  }

  // ✅ Fetch Stall Confirmation Preview
  Future<List<Map<String, String>>> getStallConfirmationList(
      String marketName, String marketDate) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse(
          '$baseUrl/stalls/preview-confirmation?marketName=$marketName&marketDate=$marketDate'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return List<Map<String, String>>.from(json.decode(response.body));
    } else {
      throw Exception('❌ Failed to fetch stall preview: ${response.body}');
    }
  }

  // ✅ Remove Stall from Preview
  Future<void> removeStallFromPreview(
      String stallName, String farmerName) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/stalls/remove-stall'),
      headers: headers,
      body: json.encode({'stallName': stallName, 'farmerName': farmerName}),
    );

    if (response.statusCode != 200) {
      throw Exception('❌ Failed to remove stall: ${response.body}');
    }
  }

  // ✅ Upload GPS with Selfie
  Future<void> uploadGPSWithSelfie({
    required double latitude,
    required double longitude,
    required String selfiePath,
  }) async {
    final headers = await _getHeaders();
    var uri = Uri.parse('$baseUrl/gps/upload-gps-selfie');

    var request = http.MultipartRequest('POST', uri)
      ..headers.addAll(headers)
      ..fields['latitude'] = latitude.toString()
      ..fields['longitude'] = longitude.toString()
      ..files.add(await http.MultipartFile.fromPath('selfie', selfiePath));

    var response = await request.send();
    if (response.statusCode != 201) {
      final responseBody = await response.stream.bytesToString();
      throw Exception('❌ Failed to upload GPS + Selfie: $responseBody');
    }
  }

  // ✅ Upload File With Market Metadata
  Future<void> uploadFileWithData({
    required String filePath,
    required String fileType,
    required String marketName,
    required String marketDate,
  }) async {
    final token = await _getToken(); // ✅ Get token properly
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/market/upload-market-file'),
    );

    request.headers.addAll({
      'Authorization': 'Bearer $token',
      'Content-Type': 'multipart/form-data', // Important!
    });

    request.files.add(await http.MultipartFile.fromPath('file', filePath));
    request.fields['fileType'] = fileType;
    request.fields['marketName'] = marketName;
    request.fields['marketDate'] = marketDate;

    var response = await request.send();
    if (response.statusCode != 201) {
      final responseBody = await response.stream.bytesToString();
      throw Exception('❌ Failed to upload file: $responseBody');
    }
  }

  // ✅ Upload Generic File
  Future<void> uploadFile({
    required String filePath,
    required String endpoint,
  }) async {
    final headers = await _getHeaders();
    var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/$endpoint'))
      ..headers.addAll(headers)
      ..files.add(await http.MultipartFile.fromPath('file', filePath));

    var response = await request.send();
    if (response.statusCode != 201) {
      final responseBody = await response.stream.bytesToString();
      throw Exception('❌ Failed to upload to $endpoint: $responseBody');
    }
  }

  // ✅ Upload Selfie (Separate API if needed)
  Future<void> uploadSelfie(String selfiePath) async {
    await uploadFile(filePath: selfiePath, endpoint: 'selfie/upload');
  }

  // ✅ Upload Market Video
  Future<void> uploadMarketVideo({
    required String filePath,
    required String marketName,
    required String marketDate,
  }) async {
    var uri = Uri.parse('http://localhost:5000/api/market/upload-market-file');

    var request = http.MultipartRequest('POST', uri);

    request.fields['fileType'] = 'market_video';
    request.fields['marketName'] = marketName;
    request.fields['marketDate'] = marketDate;

    request.files.add(
      await http.MultipartFile.fromPath(
        'file',
        filePath,
        contentType: MediaType('video', 'mp4'), // 🛡️ IMPORTANT
      ),
    );

    var response = await request.send();

    if (response.statusCode == 201) {
      print('✅ Market Video uploaded successfully');
    } else {
      final responseBody = await response.stream.bytesToString();
      throw Exception('❌ Failed to upload Market Video: $responseBody');
    }
  }

  // ✅ Upload Market Cleaning Video

  Future<void> uploadMarketCleaningVideo({
    required String filePath,
    required String marketName,
    required String marketDate,
  }) async {
    var uri = Uri.parse('http://localhost:5000/api/market/upload-market-file');

    var request = http.MultipartRequest('POST', uri);

    request.fields['fileType'] = 'cleaning_video';
    request.fields['marketName'] = marketName;
    request.fields['marketDate'] = marketDate;

    request.files.add(
      await http.MultipartFile.fromPath(
        'file',
        filePath,
        contentType: MediaType('video', 'mp4'), // 🛡️ IMPORTANT
      ),
    );

    var response = await request.send();

    if (response.statusCode == 201) {
      print('✅ Market Video uploaded successfully');
    } else {
      final responseBody = await response.stream.bytesToString();
      throw Exception('❌ Failed to upload Market Video: $responseBody');
    }
  }

  // ✅ Upload Inspection Form
  Future<void> uploadInspectionForm(String filePath) async {
    await uploadFile(filePath: filePath, endpoint: 'market/inspection-form');
  }
}
