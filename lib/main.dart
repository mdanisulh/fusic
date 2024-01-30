import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/core/core.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:fusic/theme/theme.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:permission_handler/permission_handler.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  Hive.registerAdapter(FileMetadataAdapter());
  await Hive.openBox<FileMetadata>('files');
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  void getPermission() async {
    final status = await Permission.audio.request();
    if (status.isPermanentlyDenied) {
      openAppSettings();
    } else if (status.isDenied) {
      await Permission.audio.request();
    }
  }

  @override
  Widget build(BuildContext context) {
    getPermission();
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
