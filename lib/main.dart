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
        colorScheme: ColorScheme.light(background: MyColors.white(context)),
        fontFamily: 'Inter',
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.dark(background: MyColors.black(context)),
        fontFamily: 'Inter',
      ),
      themeMode: ThemeMode.system,
    );
  }
}
