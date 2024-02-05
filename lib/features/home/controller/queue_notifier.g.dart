// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'queue_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$currentSongIndexHash() => r'111ab4567971795ae462866fb36c3b94f52d22d9';

/// See also [CurrentSongIndex].
@ProviderFor(CurrentSongIndex)
final currentSongIndexProvider =
    AutoDisposeNotifierProvider<CurrentSongIndex, int?>.internal(
  CurrentSongIndex.new,
  name: r'currentSongIndexProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$currentSongIndexHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$CurrentSongIndex = AutoDisposeNotifier<int?>;
String _$queueNotifierHash() => r'ac343231e77b88a50c977877fc1c997ad192b03a';

/// See also [QueueNotifier].
@ProviderFor(QueueNotifier)
final queueNotifierProvider =
    NotifierProvider<QueueNotifier, List<int>>.internal(
  QueueNotifier.new,
  name: r'queueNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$queueNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$QueueNotifier = Notifier<List<int>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member
