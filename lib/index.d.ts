import React from 'react';
import { EasingFunction, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
interface BonesProps extends Omit<ScrollingLightProps, 'progress'> {
    key: string;
}
interface SkeletonContentProps {
    bones: BonesProps[];
    duration?: number;
    boomerang?: boolean;
    containerStyle?: ViewStyle;
    easing?: EasingFunction;
    colors?: ScrollingLightProps['colors'];
}
export declare const SkeletonContent: React.FC<SkeletonContentProps>;
declare type Directions = 'rightLeft' | 'leftRight' | 'topDown' | 'downTop' | 'diagonalTopRight' | 'diagonalTopLeft' | 'diagonalDownRight' | 'diagonalDownLeft';
interface BoneStyle {
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginVertical?: number;
    marginHorizontal?: number;
    margin?: number;
}
interface ScrollingLightProps {
    direction: Directions;
    width: number;
    height: number;
    progress: Animated.SharedValue<number>;
    lineWidth?: number;
    radius?: number;
    colors?: {
        boneBackground: string;
        lightGradient: string[];
    };
    boneStyle?: BoneStyle;
}
export declare const ScrollingLight: React.FC<ScrollingLightProps>;
export {};
