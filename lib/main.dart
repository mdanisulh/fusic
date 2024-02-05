import 'package:audio_service/audio_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/core/core.dart';
import 'package:fusic/features/home/controller/audio_handler.dart';
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

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  void init(WidgetRef ref) async {
    final status = await Permission.audio.request();
    if (status.isPermanentlyDenied) {
      openAppSettings();
    } else if (status.isDenied) {
      await Permission.audio.request();
    }
    audioHandler = await AudioService.init(
      builder: () => AudioPlayerHandler(ref),
      config: const AudioServiceConfig(
        androidNotificationChannelId: 'co.anicoder.fusic.audio',
        androidNotificationChannelName: 'Fusic',
        androidNotificationOngoing: true,
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    init(ref);
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
