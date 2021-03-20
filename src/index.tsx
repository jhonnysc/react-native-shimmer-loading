/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react";
import { EasingFunction, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  interpolate
} from "react-native-reanimated";
interface BonesProps extends Omit<ScrollingLightProps, "progress"> {
  key: string;
}

interface SkeletonContentProps {
  bones: BonesProps[];
  duration?: number;
  boomerang?: boolean;
  containerStyle?: ViewStyle;
  easing?: EasingFunction;
  colors?: ScrollingLightProps["colors"];
}

export const SkeletonContent: React.FC<SkeletonContentProps> = ({
  bones,
  containerStyle,
  duration = 1000,
  boomerang = false,
  easing = Easing.ease,
  colors
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing }),
      -1,
      boomerang
    );
  }, [boomerang, duration, easing, progress]);

  return (
    <View style={containerStyle}>
      {bones.map(bone => (
        <ScrollingLight
          key={bone.key}
          direction={bone.direction}
          height={bone.height}
          width={bone.width}
          boneStyle={bone.boneStyle}
          radius={bone.radius}
          progress={progress}
          colors={colors || bone.colors}
        />
      ))}
    </View>
  );
};

type Directions =
  | "rightLeft"
  | "leftRight"
  | "topDown"
  | "downTop"
  | "diagonalTopRight"
  | "diagonalTopLeft"
  | "diagonalDownRight"
  | "diagonalDownLeft";

type DirectionProps2 = {
  fromX: number;
  fromY: number;
  interpolateX: number[];
  interpolateY: number[];
  rotation: number;
};

const directionsConfig = (
  direction: Directions,
  height: number,
  width: number
): DirectionProps2 => {
  const props: Record<Directions, DirectionProps2> = {
    diagonalDownRight: {
      fromX: 0,
      fromY: 0,
      interpolateX: [0, width],
      interpolateY: [0, height],
      rotation: 1
    },
    diagonalTopRight: {
      fromX: 0,
      fromY: height,
      interpolateX: [0, width],
      interpolateY: [height, 0],
      rotation: -1
    },
    diagonalDownLeft: {
      fromX: width,
      fromY: 0,
      interpolateX: [width, 0],
      interpolateY: [0, height],
      rotation: -1
    },
    diagonalTopLeft: {
      fromX: width,
      fromY: height,
      interpolateX: [width, 0],
      interpolateY: [height, 0],
      rotation: 1
    },
    downTop: {
      fromX: 0,
      fromY: height,
      interpolateX: [0, 0],
      interpolateY: [height, 0],
      rotation: 1
    },
    topDown: {
      fromX: 0,
      fromY: 0,
      interpolateX: [0, 0],
      interpolateY: [0, height],
      rotation: 1
    },
    leftRight: {
      fromX: 0,
      fromY: 0,
      interpolateX: [0, width],
      interpolateY: [0, 0],
      rotation: 0
    },
    rightLeft: {
      fromX: width,
      fromY: 0,
      interpolateX: [width, 0],
      interpolateY: [0, 0],
      rotation: 0
    }
  };

  return props[direction];
};

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

export const ScrollingLight: React.FC<ScrollingLightProps> = ({
  direction,
  height,
  width,
  progress,
  lineWidth = 50,
  boneStyle,
  radius = 0,
  colors = {
    boneBackground: "#dcdcdc",
    lightGradient: ["#dcdcdc", "#ffffff", "#dcdcdc"]
  }
}) => {
  const {
    fromX,
    fromY,
    interpolateX,
    interpolateY,
    rotation
  } = directionsConfig(direction, height, width);

  const translateX = useSharedValue(fromX);
  const translateY = useSharedValue(fromY);
  const opacity = useSharedValue(0.1);

  const diagonal = Math.sqrt(height ** 2 + width ** 2);
  const mainDimension = Math.max(width, height);
  const diagonalAngle =
    direction === "topDown" || direction === "downTop"
      ? 1.5708 // 90deg in rad
      : Math.acos(mainDimension / diagonal);

  const animatedStyle = useAnimatedStyle(() => {
    translateX.value = interpolate(progress.value, [0, 1], interpolateX);
    translateY.value = interpolate(progress.value, [0, 1], interpolateY);
    opacity.value = interpolate(progress.value, [0, 0.5, 1], [0, 1, 0]);
    return {
      height: Math.max(width, height) * 2,
      width: lineWidth,
      top: -Math.max(width, height),
      left: -lineWidth / 2,
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value }
      ]
    };
  });

  const gradientChild: ViewStyle = {
    flex: 1,
    transform: [{ rotate: `${diagonalAngle * rotation}rad` }]
  };

  return (
    <Bone
      height={height}
      width={width}
      radius={radius}
      bgColor={colors.boneBackground}
      extraStyle={boneStyle}
    >
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={colors.lightGradient}
          style={gradientChild}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </Bone>
  );
};

interface BoneProps {
  width: number;
  height: number;
  radius: number;
  bgColor: string;
  extraStyle?: BoneStyle;
}

const Bone: React.FC<BoneProps> = ({
  bgColor,
  height,
  radius,
  width,
  extraStyle
}) => {
  const style: ViewStyle = {
    width,
    height,
    borderRadius: radius,
    backgroundColor: bgColor,
    overflow: "hidden",
    position: "relative"
  };

  return <View style={[style, extraStyle]} />;
};
