import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

// TODO: change const to props
const HEIGHT_OF_ITEM = 60;
const HEIGHT_OF_LIST = HEIGHT_OF_ITEM * 2.2;

// TODO: add selectedValue props
type WheelNumberPickerProps = {
  minValue: number;
  maxValue: number;
  selectedValue?: number;
  onValueChange?: (value: number) => void;
};

function WheelNumberPicker({
  minValue = 1,
  maxValue = 5,
  selectedValue,
  onValueChange,
}: WheelNumberPickerProps): ReactElement {
  const [data, setData] = useState<number[]>([]);
  const [value, setValue] = useState<number>(selectedValue || minValue);
  const flatListRef = useRef<FlatList>(null);
  const currentYOffset = useRef<number>(0);
  const valueArray = useRef<number[]>([]);
  const numberOfValue = useRef<number>(maxValue - minValue + 1);
  const initialOffset = useRef<number>(
    (maxValue - minValue + 0.5) * HEIGHT_OF_ITEM -
      (HEIGHT_OF_LIST % HEIGHT_OF_ITEM) / 2
  );

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
        offset += HEIGHT_OF_ITEM * selectedValueIndex;
      }
    }

    flatListRef.current?.scrollToOffset({
      offset: offset,
      animated: false,
    });
    currentYOffset.current = initialOffset.current;
  }, [!!data]);

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
    let index = Math.ceil((offsetY % initialOffset.current) / HEIGHT_OF_ITEM);
    index = index < numberOfValue.current ? index : numberOfValue.current - 1;
    const selectedValue = valueArray.current[index];
    if (value !== selectedValue) {
      setValue(selectedValue);
    }

    if (offsetY < currentYOffset.current) {
      if (offsetY <= initialOffset.current - HEIGHT_OF_ITEM) {
        flatListRef.current?.scrollToOffset({
          offset: offsetY + HEIGHT_OF_ITEM * (maxValue - minValue + 1),
          animated: false,
        });
        currentYOffset.current =
          offsetY + HEIGHT_OF_ITEM * (maxValue - minValue + 1);
        return;
      }
    }

    if (offsetY > currentYOffset.current) {
      if (offsetY > initialOffset.current + HEIGHT_OF_ITEM) {
        flatListRef.current?.scrollToOffset({
          offset: offsetY - HEIGHT_OF_ITEM * (maxValue - minValue + 1),
          animated: false,
        });
        currentYOffset.current =
          offsetY - HEIGHT_OF_ITEM * (maxValue - minValue + 1);
        return;
      }
    }

    currentYOffset.current = offsetY;
  };

  return (
    <>
      <View>{/* <Text>selected value: {value}</Text> */}</View>
      <View style={styles.mainContainer}>
        <FlatList
          data={data}
          onScroll={onScroll}
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          snapToInterval={HEIGHT_OF_ITEM}
          scrollEventThrottle={16}
          decelerationRate="fast"
          initialScrollIndex={0}
          keyExtractor={(item, index) => `WNPicker_${index.toString()}`}
          getItemLayout={(_, index) => ({
            length: HEIGHT_OF_ITEM,
            offset: HEIGHT_OF_ITEM * index,
            index,
          })}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: "100%",
                  height: HEIGHT_OF_ITEM,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                {item === value ? (
                  <Text style={[styles.number]}>{item}</Text>
                ) : (
                  <Text style={[styles.number, { color: "gray" }]}>{item}</Text>
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

// TODO: change to props
const styles = StyleSheet.create({
  mainContainer: {
    width: HEIGHT_OF_ITEM * 1.2,
    height: HEIGHT_OF_LIST,
    backgroundColor: "white",
  },
  number: {
    fontSize: 24,
  },
});
