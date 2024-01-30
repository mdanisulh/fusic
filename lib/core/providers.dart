import 'package:audiotagger/audiotagger.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';

final audioProvider = Provider.autoDispose<AudioPlayer>((ref) => AudioPlayer());
final audiotaggerProvider = Provider.autoDispose<Audiotagger>((ref) => Audiotagger());
