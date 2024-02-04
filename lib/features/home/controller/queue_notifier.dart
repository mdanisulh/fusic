import 'dart:async';

import 'package:fusic/core/providers.dart';
import 'package:fusic/features/home/controller/file_list_notifier.dart';
import 'package:fusic/models/file_metadata.dart';
import 'package:just_audio/just_audio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'queue_notifier.g.dart';

@riverpod
class CurrentSongIndex extends _$CurrentSongIndex {
  void set(int value) => state = value;

  @override
  int build() {
    return 0;
  }
}

@Riverpod(keepAlive: true)
class QueueNotifier extends _$QueueNotifier {
  late final List<FileMetadata> _files = ref.read(fileListNotifierProvider);
  late final AudioPlayer audioPlayer = ref.read(audioPlayerProvider);
  late int _currentIndex;
  StreamSubscription<PlayerState>? _playerStateSubscription;

  void addSongToQueue(int index) {
    state = [...state, index];
  }

  void removeSongFromQueue(int index) {
    state = state.where((songIndex) => songIndex != index).toList();
  }

  void createQueue(int index) {
    int n = _files.length;
    List<int> queue = List.generate(n, (index) => index);
    queue.shuffle();
    int tmp = queue.indexWhere((element) => element == index);
    queue[tmp] = queue[0];
    queue[0] = index;
    _currentIndex = 0;
    state = queue;
  }

  Future<void> playSong(int index) async {
    if (state.isEmpty) {
      createQueue(index);
    }
    await audioPlayer.setFilePath(_files[index].filePath);
    if (audioPlayer.playing) {
      await audioPlayer.stop();
      _playerStateSubscription?.cancel();
    }
    _currentIndex = state.indexOf(index);
    ref.read(currentSongIndexProvider.notifier).set(index);
    audioPlayer.play();
    _playerStateSubscription = audioPlayer.playerStateStream.listen((event) {
      if (event.processingState == ProcessingState.completed) {
        playNext();
      }
    });
  }

  void playNext() {
    if (_currentIndex == state.length - 1) {
      _currentIndex = -1;
    }
    playSong(state[_currentIndex += 1]);
  }

  void playPrevious() {
    if (_currentIndex == 0) {
      _currentIndex = state.length;
    }
    playSong(state[_currentIndex -= 1]);
  }

  void playPause() {
    if (audioPlayer.playing) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
  }

  @override
  List<int> build() {
    return [];
  }
}
