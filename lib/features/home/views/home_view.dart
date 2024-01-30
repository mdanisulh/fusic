import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fusic/core/providers.dart';
import 'package:fusic/features/home/controller/file_list_controller.dart';
import 'package:fusic/features/home/widgets/custom_search_delegate.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:fusic/theme/theme.dart';
import 'package:just_audio/just_audio.dart';

class HomeView extends ConsumerWidget {
  const HomeView({super.key});

  Future<void> selectDirectory(WidgetRef ref) async {
    String? directoryPath = await FilePicker.platform.getDirectoryPath();
    if (directoryPath != null) {
      ref.read(fileListProvider.notifier).loadFiles(directoryPath);
    }
  }

  void playSong(AudioPlayer audioPlayer, String filePath, WidgetRef ref) async {
    await audioPlayer.setFilePath(filePath);
    if (audioPlayer.playing) {
      await audioPlayer.stop();
    }
    audioPlayer.play();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final audioPlayer = ref.watch(audioProvider);
    List<FileMetadata> files = ref.watch(fileListProvider);
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
              onPressed: () async {
                showSearch(context: context, delegate: CustomSearchDelegate());
              },
            ),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: files.length,
        itemBuilder: (context, index) {
          return ListTile(
            leading: files[index].artwork != null
                ? Image.memory(
                    files[index].artwork!,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                  )
                : const Icon(Icons.music_note),
            onTap: () => playSong(audioPlayer, files[index].filePath, ref),
            title: Text(files[index].title),
            subtitle: Text(files[index].artist.join(', ')),
          );
        },
      ),
    );
  }
}
