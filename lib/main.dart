import 'package:flutter/material.dart';
import 'package:fusic/core/core.dart';
import 'package:fusic/theme/theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
      title: 'Fusic',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: MyColors.violet),
        fontFamily: 'Inter',
        useMaterial3: true,
      ),
    );
  }
}
