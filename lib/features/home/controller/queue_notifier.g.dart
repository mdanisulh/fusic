// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'queue_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$currentSongIndexHash() => r'381a5215ef0adbbdca8eaddc2f221060ef31845f';

/// See also [CurrentSongIndex].
@ProviderFor(CurrentSongIndex)
final currentSongIndexProvider =
    AutoDisposeNotifierProvider<CurrentSongIndex, int>.internal(
  CurrentSongIndex.new,
  name: r'currentSongIndexProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$currentSongIndexHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$CurrentSongIndex = AutoDisposeNotifier<int>;
String _$queueNotifierHash() => r'97bc511ba251921d17a2313bf7b38547de847f7d';

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
