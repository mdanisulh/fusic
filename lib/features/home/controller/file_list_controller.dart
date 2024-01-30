import 'dart:io';
import 'dart:typed_data';
import 'package:audiotagger/models/audiofile.dart';
import 'package:audiotagger/models/tag.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/core/providers.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:hive/hive.dart';

final fileListProvider = StateNotifierProvider<FileListController, List<FileMetadata>>((ref) => FileListController(ref));

class FileListController extends StateNotifier<List<FileMetadata>> {
  final StateNotifierProviderRef ref;
  FileListController(this.ref) : super([]) {
    loadState();
  }

  Future<void> loadState() async {
    Box<FileMetadata> box = Hive.box<FileMetadata>('files');
    List<FileMetadata> files = box.values.toList();
    state = files;
  }

  Future<FileMetadata?> loadMetadata(String path) async {
    try {
      final AudioFile? audioFile = await ref.read(audiotaggerProvider).readAudioFile(path: path);
      final Tag? tag = await ref.read(audiotaggerProvider).readTags(path: path);
      final Uint8List? artwork = await ref.read(audiotaggerProvider).readArtwork(path: path);
      if (tag == null || audioFile == null) throw Exception('Failed to load metadata');
      final int duration = audioFile.length ?? 0;
      return FileMetadata(
        filePath: path,
        title: tag.title ?? '',
        artist: (tag.artist as String).split(',').map((e) => e.trim()).toList(),
        duration: duration,
        album: tag.album,
        lyrics: tag.lyrics,
        genre: tag.genre,
        albumArtist: tag.albumArtist,
        year: tag.year,
        comment: tag.comment,
        artwork: artwork,
      );
    } catch (_) {
      return null;
    }
  }

  Future<void> saveState() async {
    Box<FileMetadata> box = Hive.box<FileMetadata>('files');
    await box.clear();
    for (FileMetadata metadata in state) {
      await box.add(metadata);
    }
  }

  void loadFiles(String directoryPath) async {
    final dir = Directory(directoryPath);
    List<FileSystemEntity> fileList = dir.listSync(recursive: true);
    state = [];
    List<String> files = fileList.map((file) => file.path).toList();
    for (final String file in files) {
      final FileMetadata? metadata = await loadMetadata(file);
      if (metadata != null) {
        state = [...state, metadata];
      }
    }
    state.sort((a, b) => a.title.compareTo(b.title));
    saveState();
  }
}
