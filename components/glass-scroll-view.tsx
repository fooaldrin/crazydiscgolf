import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface GlassScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  trackTopOffset?: number;
  trackBottomOffset?: number;
}

/**
 * ScrollView with a persistent, translucent Liquid Glass vertical scroll indicator
 * on the right edge so users immediately see when content is scrollable.
 */
export const GlassScrollView = forwardRef<ScrollView, GlassScrollViewProps>(
  function GlassScrollView(
    {
      children,
      containerStyle,
      style,
      trackTopOffset = 8,
      trackBottomOffset = 12,
      onScroll,
      onContentSizeChange,
      onLayout,
      ...rest
    },
    ref,
  ) {
    const innerRef = useRef<ScrollView>(null);
    useImperativeHandle(ref, () => innerRef.current as ScrollView);

    const scrollY = useRef(new Animated.Value(0)).current;
    const [viewportHeight, setViewportHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    const isScrollable =
      contentHeight > 0 &&
      viewportHeight > 0 &&
      contentHeight > viewportHeight + 6;

    const trackHeight = Math.max(
      0,
      viewportHeight - trackTopOffset - trackBottomOffset,
    );

    const rawThumbHeight = isScrollable
      ? (viewportHeight / contentHeight) * trackHeight
      : 0;
    const thumbHeight = Math.max(36, Math.min(trackHeight * 0.75, rawThumbHeight));
    const maxScrollOffset = Math.max(1, contentHeight - viewportHeight);
    const maxThumbTravel = Math.max(0, trackHeight - thumbHeight);

    const thumbTranslateY = scrollY.interpolate({
      inputRange: [0, maxScrollOffset],
      outputRange: [0, maxThumbTravel],
      extrapolate: "clamp",
    });

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.setValue(e.nativeEvent.contentOffset.y);
      onScroll?.(e);
    };

    const handleLayout = (e: LayoutChangeEvent) => {
      setViewportHeight(e.nativeEvent.layout.height);
      onLayout?.(e);
    };

    const handleContentSizeChange = (w: number, h: number) => {
      setContentHeight(h);
      onContentSizeChange?.(w, h);
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        <ScrollView
          ref={innerRef}
          style={style}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onLayout={handleLayout}
          onContentSizeChange={handleContentSizeChange}
          {...rest}
        >
          {children}
        </ScrollView>

        {isScrollable && trackHeight > 40 && (
          <View
            pointerEvents="none"
            style={[
              styles.scrollbarTrack,
              {
                top: trackTopOffset,
                bottom: trackBottomOffset,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.scrollbarThumb,
                {
                  height: thumbHeight,
                  transform: [{ translateY: thumbTranslateY }],
                },
              ]}
            />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  scrollbarTrack: {
    position: "absolute",
    right: 4,
    width: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  scrollbarThumb: {
    width: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.36)",
    borderWidth: 0.5,
    borderColor: "rgba(168, 230, 76, 0.55)",
  },
});
