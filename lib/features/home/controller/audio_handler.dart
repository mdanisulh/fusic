import 'dart:io';
import 'dart:typed_data';

import 'package:audio_service/audio_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fusic/core/providers.dart';
import 'package:fusic/features/home/controller/queue_notifier.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:just_audio/just_audio.dart';
import 'package:path_provider/path_provider.dart';

late final AudioPlayerHandler audioHandler;

class AudioPlayerHandler extends BaseAudioHandler with SeekHandler {
  final WidgetRef ref;
  AudioPlayerHandler(this.ref) {
    audioPlayer.playbackEventStream.map(_transformEvent).pipe(playbackState);
  }

  @override
  Future<void> play() => audioPlayer.play();

  @override
  Future<void> pause() => audioPlayer.pause();

  @override
  Future<void> seek(Duration position) => audioPlayer.seek(position);

  @override
  Future<void> stop() => audioPlayer.stop();

  @override
  Future<void> skipToNext() async => ref.read(queueNotifierProvider.notifier).playNext();

  @override
  Future<void> skipToPrevious() async => ref.read(queueNotifierProvider.notifier).playPrevious();

  String getImageType(Uint8List bytes) {
    if (bytes[0] == 0xFF && bytes[1] == 0xD8) return 'jpg';
    if (bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47) return 'png';
    return 'unknown';
  }

  Future<void> setSong(FileMetadata song) async {
    Directory tempDir = await getTemporaryDirectory();
    String tempPath = tempDir.path;
    File file = File('$tempPath/${song.title}.${getImageType(song.artwork!)}');
    await file.writeAsBytes(song.artwork!);
    mediaItem.add(MediaItem(
      id: song.filePath,
      title: song.title,
      artist: song.artist.join(', '),
      album: song.album,
      duration: Duration(seconds: song.duration),
      artUri: Uri.file(file.path),
    ));
    await audioPlayer.setFilePath(song.filePath);
  }

  PlaybackState _transformEvent(PlaybackEvent event) {
    return PlaybackState(
      controls: [
        MediaControl.skipToPrevious,
        if (audioPlayer.playing) MediaControl.play else MediaControl.pause,
        MediaControl.skipToNext,
      ],
      systemActions: const {
        MediaAction.seek,
        MediaAction.seekForward,
        MediaAction.seekBackward,
      },
      androidCompactActionIndices: const [0, 1, 3],
      processingState: const {
        ProcessingState.idle: AudioProcessingState.idle,
        ProcessingState.loading: AudioProcessingState.loading,
        ProcessingState.buffering: AudioProcessingState.buffering,
        ProcessingState.ready: AudioProcessingState.ready,
        ProcessingState.completed: AudioProcessingState.completed,
      }[audioPlayer.processingState]!,
      playing: audioPlayer.playing,
      updatePosition: audioPlayer.position,
      bufferedPosition: audioPlayer.bufferedPosition,
      speed: audioPlayer.speed,
      queueIndex: event.currentIndex,
    );
  }
}
