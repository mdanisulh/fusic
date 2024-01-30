// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'file_metadata.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class FileMetadataAdapter extends TypeAdapter<FileMetadata> {
  @override
  final int typeId = 0;

  @override
  FileMetadata read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return FileMetadata(
      filePath: fields[0] as String,
      title: fields[1] as String,
      artist: (fields[2] as List).cast<String>(),
      album: fields[4] as String?,
      duration: fields[3] as int,
      artwork: fields[5] as Uint8List?,
      lyrics: fields[6] as String?,
      genre: fields[7] as String?,
      albumArtist: fields[8] as String?,
      year: fields[9] as String?,
      comment: fields[10] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, FileMetadata obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.filePath)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.artist)
      ..writeByte(3)
      ..write(obj.duration)
      ..writeByte(4)
      ..write(obj.album)
      ..writeByte(5)
      ..write(obj.artwork)
      ..writeByte(6)
      ..write(obj.lyrics)
      ..writeByte(7)
      ..write(obj.genre)
      ..writeByte(8)
      ..write(obj.albumArtist)
      ..writeByte(9)
      ..write(obj.year)
      ..writeByte(10)
      ..write(obj.comment);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FileMetadataAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
