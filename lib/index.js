"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollingLight = exports.SkeletonContent = void 0;
/* eslint-disable react-native/no-inline-styles */
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_linear_gradient_1 = __importDefault(require("react-native-linear-gradient"));
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
exports.SkeletonContent = ({ bones, containerStyle, duration = 1000, boomerang = false, easing = react_native_reanimated_1.Easing.ease, colors, }) => {
    const progress = react_native_reanimated_1.useSharedValue(0);
    react_1.useEffect(() => {
        progress.value = react_native_reanimated_1.withRepeat(react_native_reanimated_1.withTiming(1, { duration, easing }), -1, boomerang);
    }, [boomerang, duration, easing, progress]);
    return (<react_native_1.View style={containerStyle}>
      {bones.map((bone) => (<exports.ScrollingLight key={bone.key} direction={bone.direction} height={bone.height} width={bone.width} boneStyle={bone.boneStyle} radius={bone.radius} progress={progress} colors={colors || bone.colors}/>))}
    </react_native_1.View>);
};
const directionsConfig = (direction, height, width) => {
    const props = {
        diagonalDownRight: {
            fromX: 0,
            fromY: 0,
            interpolateX: [0, width],
            interpolateY: [0, height],
            rotation: 1,
        },
        diagonalTopRight: {
            fromX: 0,
            fromY: height,
            interpolateX: [0, width],
            interpolateY: [height, 0],
            rotation: -1,
        },
        diagonalDownLeft: {
            fromX: width,
            fromY: 0,
            interpolateX: [width, 0],
            interpolateY: [0, height],
            rotation: -1,
        },
        diagonalTopLeft: {
            fromX: width,
            fromY: height,
            interpolateX: [width, 0],
            interpolateY: [height, 0],
            rotation: 1,
        },
        downTop: {
            fromX: 0,
            fromY: height,
            interpolateX: [0, 0],
            interpolateY: [height, 0],
            rotation: 1,
        },
        topDown: {
            fromX: 0,
            fromY: 0,
            interpolateX: [0, 0],
            interpolateY: [0, height],
            rotation: 1,
        },
        leftRight: {
            fromX: 0,
            fromY: 0,
            interpolateX: [0, width],
            interpolateY: [0, 0],
            rotation: 0,
        },
        rightLeft: {
            fromX: width,
            fromY: 0,
            interpolateX: [width, 0],
            interpolateY: [0, 0],
            rotation: 0,
        },
    };
    return props[direction];
};
;
exports.ScrollingLight = ({ direction, height, width, progress, lineWidth = 50, boneStyle, radius = 0, colors = {
    boneBackground: '#dcdcdc',
    lightGradient: ['#dcdcdc', '#ffffff', '#dcdcdc'],
}, }) => {
    const { fromX, fromY, interpolateX, interpolateY, rotation, } = directionsConfig(direction, height, width);
    const translateX = react_native_reanimated_1.useSharedValue(fromX);
    const translateY = react_native_reanimated_1.useSharedValue(fromY);
    const opacity = react_native_reanimated_1.useSharedValue(0.1);
    const diagonal = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
    const mainDimension = Math.max(width, height);
    const diagonalAngle = direction === 'topDown' || direction === 'downTop'
        ? 1.5708 // 90deg in rad
        : Math.acos(mainDimension / diagonal);
    const animatedStyle = react_native_reanimated_1.useAnimatedStyle(() => {
        translateX.value = react_native_reanimated_1.interpolate(progress.value, [0, 1], interpolateX);
        translateY.value = react_native_reanimated_1.interpolate(progress.value, [0, 1], interpolateY);
        opacity.value = react_native_reanimated_1.interpolate(progress.value, [0, 0.5, 1], [0, 1, 0]);
        return {
            height: Math.max(width, height) * 2,
            width: lineWidth,
            top: -Math.max(width, height),
            left: -lineWidth / 2,
            opacity: opacity.value,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });
    const gradientChild = {
        flex: 1,
        transform: [{ rotate: `${diagonalAngle * rotation}rad` }],
    };
    return (<Bone height={height} width={width} radius={radius} bgColor={colors.boneBackground} extraStyle={boneStyle}>
      <react_native_reanimated_1.default.View style={animatedStyle}>
        <react_native_linear_gradient_1.default colors={colors.lightGradient} style={gradientChild} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}/>
      </react_native_reanimated_1.default.View>
    </Bone>);
};
const Bone = ({ bgColor, height, radius, width, extraStyle }) => {
    const style = {
        width,
        height,
        borderRadius: radius,
        backgroundColor: bgColor,
        overflow: 'hidden',
        position: 'relative',
    };
    return <react_native_1.View style={[style, extraStyle]}/>;
};
