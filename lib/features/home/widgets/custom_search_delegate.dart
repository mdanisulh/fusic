import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/features/home/controller/queue_notifier.dart';
import 'package:fusic/models/file_metadata.dart';

class CustomSearchDelegate extends SearchDelegate<String> {
  final List<FileMetadata> files;
  final WidgetRef ref;

  CustomSearchDelegate(this.files, this.ref);
  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: AnimatedIcon(
        icon: AnimatedIcons.menu_arrow,
        progress: transitionAnimation,
      ),
      onPressed: () {
        close(context, '');
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    return Container();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final suggestions = files.where((file) => file.title.toLowerCase().contains(query.toLowerCase())).toList();
    return ListView.builder(
      itemCount: suggestions.length,
      itemBuilder: (context, index) {
        return ListTile(
          leading: suggestions[index].artwork != null
              ? Image.memory(
                  suggestions[index].artwork!,
                  width: 50,
                  height: 50,
                  fit: BoxFit.cover,
                )
              : const Icon(Icons.music_note),
          title: Text(suggestions[index].title),
          onTap: () {
            ref.read(queueNotifierProvider.notifier).playSong(files.indexOf(suggestions[index]));
            close(context, suggestions[index].title);
          },
        );
      },
    );
  }
}
