import 'dart:io';
import 'dart:typed_data';

import 'package:audiotagger/models/audiofile.dart';
import 'package:audiotagger/models/tag.dart';
import 'package:file_picker/file_picker.dart';
import 'package:fusic/core/providers.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:hive/hive.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'file_list_notifier.g.dart';

@riverpod
class FileListNotifier extends _$FileListNotifier {
  late final _audiotagger = ref.read(audiotaggerProvider);
  @override
  List<FileMetadata> build() {
    Box<FileMetadata> box = Hive.box<FileMetadata>('files');
    return box.values.toList();
  }

  Future<FileMetadata?> loadMetadata(String path) async {
    try {
      final AudioFile? audioFile = await _audiotagger.readAudioFile(path: path);
      final Tag? tag = await _audiotagger.readTags(path: path);
      final Uint8List? artwork = await _audiotagger.readArtwork(path: path);
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

  Future<void> selectDirectory() async {
    String? directoryPath = await FilePicker.platform.getDirectoryPath();
    if (directoryPath != null) {
      ref.read(fileListNotifierProvider.notifier).loadFiles(directoryPath);
    }
  }
}
