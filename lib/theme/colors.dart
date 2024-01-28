import 'package:flutter/material.dart';

class MyColors {
  // Colors are named after their light mode color
  static Color white(BuildContext context) {
    return Theme.of(context).brightness == Brightness.light ? const Color(0xFFFFFFFF) : const Color(0xFF242424);
  }

  static Color black(BuildContext context) {
    return Theme.of(context).brightness == Brightness.light ? const Color(0xFF242424) : const Color(0xFFFFFFFF);
  }

  static Color grey(BuildContext context) {
    return Theme.of(context).brightness == Brightness.light ? const Color(0xFF808080) : const Color(0xFFE0E0E0);
  }

  static Color lightGrey(BuildContext context) {
    return Theme.of(context).brightness == Brightness.light ? const Color(0xFFE0E0E0) : const Color(0xFF808080);
  }

  static Color violet(BuildContext context) {
    return const Color(0xFF6E44FF);
  }
}
