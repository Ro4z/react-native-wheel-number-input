import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HEIGHT_OF_ITEM = 60;
const HEIGHT_OF_LIST = 210;

type WheelNumberPickerProps = {
  minValue: number;
  maxValue: number;
};

function WheelNumberPicker({
  minValue = 1,
  maxValue = 5,
}: WheelNumberPickerProps): ReactElement {
  const [data, setData] = useState<number[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const currentYOffset = useRef(0);
  const numberArray = useRef<number[]>([]);
  const initialOffset = useRef<number>(
    (maxValue - minValue + 2) * HEIGHT_OF_ITEM -
      (HEIGHT_OF_LIST % HEIGHT_OF_ITEM) / 2
  );

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.contentOffset.y;

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

  // initialize number array
  useEffect(() => {
    const arr = [];
    for (let i = minValue; i <= maxValue; i++) {
      arr.push(i);
    }
    setData([...arr, ...arr, ...arr]);
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const length = maxValue - minValue + 1;
    const offset =
      (length + 1) * HEIGHT_OF_ITEM - (HEIGHT_OF_LIST % HEIGHT_OF_ITEM) / 2;

    flatListRef.current?.scrollToOffset({
      offset: offset,
      animated: false,
    });
    currentYOffset.current = offset;
  }, [data.length === 0]);

  return (
    <>
      <View>
        <Text>current offset: {currentYOffset.current}</Text>
      </View>
      <View style={styles.mainContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          data={data}
          snapToInterval={HEIGHT_OF_ITEM}
          onScroll={onScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          initialScrollIndex={0}
          ref={flatListRef}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(data, index) => ({
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
                <Text>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    </>
  );
}

export default WheelNumberPicker;

const styles = StyleSheet.create({
  mainContainer: {
    width: 100,
    height: HEIGHT_OF_LIST,
    backgroundColor: "white",
  },
});
