import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/core/providers.dart';
import 'package:fusic/features/home/controller/file_list_notifier.dart';
import 'package:fusic/features/home/controller/queue_notifier.dart';
import 'package:fusic/features/home/widgets/progress_bar.dart';
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
            color: MyColors.grey(context),
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
                  title: Text(
                    widget.files[currentSongIndex].title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: MyColors.white(context)),
                  ),
                  trailing: Text(
                    '${widget.files[currentSongIndex].duration ~/ 60}:${widget.files[currentSongIndex].duration % 60}',
                    style: TextStyle(color: MyColors.white(context)),
                  ),
                  subtitle: Text(
                    widget.files[currentSongIndex].artist.join(', '),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: MyColors.white(context)),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 15),
                  child: MyProgressBar(),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    IconButton(
                      icon: Icon(Icons.folder, color: MyColors.white(context)),
                      onPressed: () async => await ref.read(fileListNotifierProvider.notifier).selectDirectory(),
                    ),
                    IconButton(
                      icon: Icon(Icons.skip_previous, color: MyColors.white(context)),
                      onPressed: ref.read(queueNotifierProvider.notifier).playPrevious,
                    ),
                    IconButton(
                      icon: audioPlayer.playing ? Icon(Icons.pause, color: MyColors.white(context)) : Icon(Icons.play_arrow, color: MyColors.white(context)),
                      onPressed: () => setState(() => ref.read(queueNotifierProvider.notifier).playPause()),
                    ),
                    IconButton(
                      icon: Icon(Icons.skip_next, color: MyColors.white(context)),
                      onPressed: ref.read(queueNotifierProvider.notifier).playNext,
                    ),
                    IconButton(
                      icon: Icon(Icons.shuffle, color: MyColors.white(context)),
                      onPressed: () => ref.read(queueNotifierProvider.notifier).createQueue(currentSongIndex),
                    ),
                  ],
                ),
              ],
            ),
          );
  }
}
