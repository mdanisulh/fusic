import 'package:flutter/material.dart';
import 'package:fusic/theme/theme.dart';

class OnboardingView extends StatelessWidget {
  const OnboardingView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Container(
              width: 100,
              height: 100,
              color: MyColors.white(context),
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  color: MyColors.black(context),
                ),
              ),
            ),
            Container(
              width: 100,
              height: 100,
              color: MyColors.lightGrey(context),
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  color: MyColors.grey(context),
                ),
              ),
            ),
            Container(
              width: 100,
              height: 100,
              color: MyColors.grey(context),
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  color: MyColors.lightGrey(context),
                ),
              ),
            ),
            Container(
              width: 100,
              height: 100,
              color: MyColors.black(context),
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  color: MyColors.white(context),
                ),
              ),
            ),
            Container(
              width: 100,
              height: 100,
              color: MyColors.violet(context),
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  color: MyColors.lightGrey(context),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
