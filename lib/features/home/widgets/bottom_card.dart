import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/features/home/controller/file_list_notifier.dart';
import 'package:fusic/features/home/controller/queue_notifier.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:fusic/theme/theme.dart';
import 'package:go_router/go_router.dart';

class BottomCard extends ConsumerWidget {
  final List<FileMetadata> files;
  const BottomCard({super.key, required this.files});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentSongIndex = ref.watch(currentSongIndexProvider);

    return Container(
      color: MyColors.lightGrey(context),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          ListTile(
            leading: files[currentSongIndex].artwork != null
                ? Image.memory(
                    files[currentSongIndex].artwork!,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                  )
                : const Icon(Icons.music_note),
            onTap: () {
              context.pushNamed('queue');
            },
            title: Text(files[currentSongIndex].title),
            trailing: Text('${files[currentSongIndex].duration ~/ 60}:${files[currentSongIndex].duration % 60}'),
            subtitle: Text(files[currentSongIndex].artist.join(', ')),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                icon: const Icon(Icons.folder),
                onPressed: () async => await ref.read(fileListNotifierProvider.notifier).selectDirectory(),
              ),
              IconButton(
                icon: const Icon(Icons.shuffle),
                onPressed: () => ref.read(queueNotifierProvider.notifier).createQueue(currentSongIndex),
              ),
              IconButton(
                icon: const Icon(Icons.skip_previous),
                onPressed: ref.read(queueNotifierProvider.notifier).playPrevious,
              ),
              IconButton(
                icon: ref.read(queueNotifierProvider.notifier).audioPlayer.playing ? const Icon(Icons.pause) : const Icon(Icons.play_arrow),
                onPressed: ref.read(queueNotifierProvider.notifier).playPause,
              ),
              IconButton(
                icon: const Icon(Icons.skip_next),
                onPressed: ref.read(queueNotifierProvider.notifier).playNext,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
