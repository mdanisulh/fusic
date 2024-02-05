import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fusic/features/home/controller/file_list_notifier.dart';
import 'package:fusic/features/home/controller/queue_notifier.dart';
import 'package:fusic/features/home/widgets/bottom_card.dart';
import 'package:fusic/features/home/widgets/custom_search_delegate.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:fusic/theme/theme.dart';

class HomeView extends ConsumerWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final List<FileMetadata> files = ref.watch(fileListNotifierProvider);
    final currentSongIndex = ref.watch(currentSongIndexProvider);
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
                showSearch(context: context, delegate: CustomSearchDelegate(files, ref));
              },
            ),
          ),
        ],
      ),
      body: files.isEmpty
          ? Center(
              child:IconButton(
                icon: const Icon(Icons.folder),
                onPressed: () async => await ref.read(fileListNotifierProvider.notifier).selectDirectory(),
              ),
            )
          : ListView.builder(
              itemCount: files.length,
              itemBuilder: (context, index) {
                return ListTile(
                  selectedColor: MyColors.black(context),
                  selectedTileColor: MyColors.lightGrey(context),
                  selected: currentSongIndex == index,
                  leading: files[index].artwork != null
                      ? Image.memory(
                          files[index].artwork!,
                          width: 50,
                          height: 50,
                          fit: BoxFit.cover,
                        )
                      : const Icon(Icons.music_note),
                  onTap: () => ref.read(queueNotifierProvider.notifier).playSong(index),
                  title: Text(files[index].title),
                  subtitle: Text(files[index].artist.join(', ')),
                  trailing: Text('${files[index].duration ~/ 60}:${files[index].duration % 60}'),
                );
              },
            ),
      bottomNavigationBar: BottomCard(files: files),
    );
  }
}
