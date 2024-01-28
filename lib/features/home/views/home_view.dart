import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fusic/features/home/widgets/custom_search_delegate.dart';
import 'package:fusic/theme/theme.dart';
import 'package:just_audio/just_audio.dart';
import 'package:permission_handler/permission_handler.dart';

final AudioPlayer audioPlayer = AudioPlayer();

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  // Future<void> pickDirectoryAndListFiles() async {
  //   PermissionStatus status = await Permission.audio.request();
  //   print(status);
  //   String? directoryPath = await FilePicker.platform.getDirectoryPath();

  //   if (directoryPath == null) {
  //     print('No directory selected');
  //     return;
  //   }

  //   final dir = Directory(directoryPath);
  //   print(directoryPath);
  //   List<FileSystemEntity> files = dir.listSync(recursive: true, followLinks: false);
  //   print(files.length);
  //   for (FileSystemEntity file in files) {
  //     print(file.path);
  //   }
  // }

  Future<void> pickAndPlayAudioFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(type: FileType.audio);

    if (result != null) {
      PlatformFile file = result.files.first;
      await audioPlayer.setFilePath(file.path!);
      audioPlayer.play();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: MyColors.white(context),
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: MyColors.violet(context),
              radius: 20,
              child: Padding(
                padding: const EdgeInsets.only(left: 5),
                child: SvgPicture.asset(
                  'assets/images/logo.svg',
                  width: 25,
                  height: 25,
                  colorFilter: ColorFilter.mode(MyColors.white(context), BlendMode.srcIn),
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'Fusic',
              style: TextStyle(fontWeight: FontWeight.w500),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: IconButton(
              icon: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: MyColors.lightGrey(context),
                    width: 1,
                  ),
                ),
                child: CircleAvatar(
                  radius: 20,
                  backgroundColor: MyColors.white(context),
                  child: Icon(Icons.search, size: 25, color: MyColors.black(context)),
                ),
              ),
              onPressed: () {
                showSearch(context: context, delegate: CustomSearchDelegate());
              },
            ),
          ),
        ],
      ),
      body: const Center(
        child: Text('Home'),
      ),
    );
  }
}
