import 'dart:typed_data';
import 'package:hive/hive.dart';

part 'file_metadata.g.dart';

@HiveType(typeId: 0)
class FileMetadata extends HiveObject {
  @HiveField(0)
  final String filePath;
  @HiveField(1)
  final String title;
  @HiveField(2)
  final List<String> artist;
  @HiveField(3)
  final int duration;
  @HiveField(4)
  final String? album;
  @HiveField(5)
  final Uint8List? artwork;
  @HiveField(6)
  final String? lyrics;
  @HiveField(7)
  final String? genre;
  @HiveField(8)
  final String? albumArtist;
  @HiveField(9)
  final String? year;
  @HiveField(10)
  final String? comment;

  FileMetadata({
    required this.filePath,
    required this.title,
    required this.artist,
    required this.duration,
    this.album,
    this.artwork,
    this.lyrics,
    this.genre,
    this.albumArtist,
    this.year,
    this.comment,
  });

  @override
  String toString() {
    return 'FileMetadata(filePath: $filePath, title: $title, artist: $artist, album: $album, duration: $duration, artwork: $artwork, lyrics: $lyrics, genre: $genre, albumArtist: $albumArtist, year: $year, comment: $comment)';
  }
}
