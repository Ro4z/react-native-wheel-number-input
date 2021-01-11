import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  StyleSheet,
  Text,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  FlexStyle,
} from "react-native";

type WheelNumberPickerProps = {
  minValue: number;
  maxValue: number;
  height: number;
  textStyle?: StyleProp<TextStyle>;
  dividerWidth?: ViewStyle["borderBottomWidth"];
  dividerColor?: ViewStyle["borderBottomColor"];
  selectedValue?: number;
  onValueChange?: (value: number) => void;
};

function WheelNumberPicker({
  minValue = 1,
  maxValue = 5,
  height = 25,
  textStyle,
  dividerWidth = 1,
  dividerColor,
  selectedValue,
  onValueChange,
}: WheelNumberPickerProps): ReactElement {
  const [data, setData] = useState<number[]>([]);
  const [value, setValue] = useState<number>(selectedValue || minValue);

  const flatListRef = useRef<FlatList>(null);
  const currentYOffset = useRef<number>(0);
  const valueArray = useRef<number[]>([]);
  const numberOfValue = useRef<number>(maxValue - minValue + 1);
  const initialOffset = useRef<number>((maxValue - minValue + 0.5) * height);

  // initialize number array
  useEffect(() => {
    valueArray.current = [];
    for (let i = minValue; i <= maxValue; i++) {
      valueArray.current.push(i);
    }
    setData([
      ...valueArray.current,
      ...valueArray.current,
      ...valueArray.current,
    ]);
  }, []);

  // set offset in center of list when rendered
  useEffect(() => {
    if (data.length === 0) return;
    let offset = initialOffset.current;
    if (selectedValue) {
      const selectedValueIndex = valueArray.current.indexOf(selectedValue);
      if (selectedValueIndex !== -1) {
        offset += height * selectedValueIndex;
      }
    }

    flatListRef.current?.scrollToOffset({
      offset: offset,
      animated: false,
    });
    currentYOffset.current = initialOffset.current;
  }, [data.length]);

  // for onValueChange props
  useEffect(() => {
    if (!onValueChange) return;
    onValueChange(value);
  }, [value]);

  // FIXME: not snap to center when scrollToOffset sometime
  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.contentOffset.y;
    let index = Math.ceil((offsetY % initialOffset.current) / height);
    index = index < numberOfValue.current ? index : numberOfValue.current - 1;
    const selectedValue = valueArray.current[index];
    if (value !== selectedValue) {
      setValue(selectedValue);
    }

    if (offsetY < currentYOffset.current) {
      if (offsetY <= initialOffset.current - height) {
        flatListRef.current?.scrollToOffset({
          offset: offsetY + height * (maxValue - minValue + 1),
          animated: false,
        });
        currentYOffset.current = offsetY + height * (maxValue - minValue + 1);
        return;
      }
    }

    if (offsetY > currentYOffset.current) {
      if (offsetY > initialOffset.current + height) {
        flatListRef.current?.scrollToOffset({
          offset: offsetY - height * (maxValue - minValue + 1),
          animated: false,
        });
        currentYOffset.current = offsetY - height * (maxValue - minValue + 1);
        return;
      }
    }

    currentYOffset.current = offsetY;
  };

  return (
    <>
      <View>{/* <Text>selected value: {value}</Text> */}</View>
      <View
        style={{
          // borderWidth: 1,
          // height: height,
          // width: height * 1.2,

          position: "absolute",
        }}
      >
        <View
          style={{
            marginTop: height / 1.5,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            height: height,
            width: height * 1.2,
          }}
        ></View>
      </View>
      <View style={{ width: height * 1.2, height: height * 2 }}>
        <FlatList
          data={data}
          onScroll={onScroll}
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          snapToInterval={height}
          scrollEventThrottle={16}
          decelerationRate="fast"
          initialScrollIndex={0}
          keyExtractor={(item, index) => `WNPicker_${index.toString()}`}
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: "100%",
                  height: height,
                  alignItems: "center",
                  justifyContent: "center",
                  // borderBottomWidth: dividerWidth,
                  // borderBottomColor: dividerColor,
                }}
              >
                {item === value ? (
                  <Text style={textStyle}>{item}</Text>
                ) : (
                  <Text style={[textStyle, { color: "rgba(200,200,200,0.6)" }]}>
                    {item}
                  </Text>
                )}
              </View>
            );
          }}
        />
      </View>
    </>
  );
}

export default WheelNumberPicker;
