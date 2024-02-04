import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/features/home/controller/file_list_notifier.dart';
import 'package:fusic/features/home/controller/queue_notifier.dart';

class QueueView extends ConsumerWidget {
  const QueueView({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final files = ref.read(fileListNotifierProvider);
    final queue = ref.watch(queueNotifierProvider);
    final currentSongIndex = queue.indexOf(ref.read(currentSongIndexProvider));
    return Scaffold(
      body: ListView.builder(
        itemCount: files.length - currentSongIndex,
        itemBuilder: (context, index) {
          index += currentSongIndex;
          return ListTile(
            leading: files[queue[index]].artwork != null
                ? Image.memory(
                    files[queue[index]].artwork!,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                  )
                : const Icon(Icons.music_note),
            onTap: () => ref.read(queueNotifierProvider.notifier).playSong(queue[index]),
            title: Text(files[queue[index]].title),
            subtitle: Text(files[queue[index]].artist.join(', ')),
            trailing: Text('${files[queue[index]].duration ~/ 60}:${files[queue[index]].duration % 60}'),
          );
        },
      ),
    );
  }
}
