import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/core/providers.dart';
import 'package:fusic/features/home/controller/file_list_notifier.dart';
import 'package:fusic/features/home/controller/queue_notifier.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:fusic/theme/theme.dart';
import 'package:go_router/go_router.dart';

class BottomCard extends ConsumerStatefulWidget {
  final List<FileMetadata> files;
  const BottomCard({super.key, required this.files});
  @override
  ConsumerState<BottomCard> createState() => _BottomCardState();
}

class _BottomCardState extends ConsumerState<BottomCard> {
  @override
  Widget build(BuildContext context) {
    final currentSongIndex = ref.watch(currentSongIndexProvider);
    return currentSongIndex == null
        ? const SizedBox()
        : Container(
            color: MyColors.lightGrey(context),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ListTile(
                  leading: widget.files[currentSongIndex].artwork != null
                      ? Image.memory(
                          widget.files[currentSongIndex].artwork!,
                          width: 50,
                          height: 50,
                          fit: BoxFit.cover,
                        )
                      : const Icon(Icons.music_note),
                  onTap: () {
                    context.pushNamed('queue');
                  },
                  title: Text(widget.files[currentSongIndex].title),
                  trailing: Text('${widget.files[currentSongIndex].duration ~/ 60}:${widget.files[currentSongIndex].duration % 60}'),
                  subtitle: Text(widget.files[currentSongIndex].artist.join(', ')),
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
                      icon: audioPlayer.playing ? const Icon(Icons.pause) : const Icon(Icons.play_arrow),
                      onPressed: () => setState(() => ref.read(queueNotifierProvider.notifier).playPause()),
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
