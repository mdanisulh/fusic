import 'package:audio_video_progress_bar/audio_video_progress_bar.dart';
import 'package:flutter/material.dart';
import 'package:fusic/core/providers.dart';
import 'package:fusic/theme/theme.dart';

class MyProgressBar extends StatelessWidget {
  const MyProgressBar({super.key});
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: audioPlayer.positionStream,
      builder: (context, snapshot) {
        final progress = audioPlayer.position;
        final buffered = audioPlayer.playbackEvent.bufferedPosition;
        final total = audioPlayer.duration ?? Duration.zero;
        return ProgressBar(
          progress: progress,
          buffered: buffered,
          total: total,
          onSeek: audioPlayer.seek,
          onDragUpdate: (details) {
            debugPrint('${details.timeStamp}, ${details.localPosition}');
          },
          timeLabelTextStyle: TextStyle(color: MyColors.white(context)),
          timeLabelType: TimeLabelType.remainingTime,
        );
      },
    );
  }
}
