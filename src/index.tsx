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
  const currentYOffset = useRef<number>(0);
  const numberOfValue = useRef<number>(maxValue - minValue + 1);
  const initialOffset = useRef<number>(
    (maxValue - minValue + 0.5) * HEIGHT_OF_ITEM -
      (HEIGHT_OF_LIST % HEIGHT_OF_ITEM) / 2
  );

  // initialize number array
  useEffect(() => {
    const arr = [];
    for (let i = minValue; i <= maxValue; i++) {
      arr.push(i);
    }
    setData([...arr, ...arr, ...arr]);
  }, []);

  // set offset in center of list when rendered
  useEffect(() => {
    if (data.length === 0) return;
    flatListRef.current?.scrollToOffset({
      offset: initialOffset.current,
      animated: false,
    });
    currentYOffset.current = initialOffset.current;
  }, [data.length === 0]);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.contentOffset.y;

    if (offsetY < currentYOffset.current) {
      if (
        offsetY <=
        initialOffset.current - HEIGHT_OF_ITEM * (numberOfValue.current / 2)
      ) {
        flatListRef.current?.scrollToOffset({
          offset: offsetY + HEIGHT_OF_ITEM * (maxValue - minValue + 1),
          animated: false,
        });
        currentYOffset.current =
          offsetY + HEIGHT_OF_ITEM * (maxValue - minValue + 1);
        setTmp(currentYOffset.current);
        return;
      }
    }

    if (offsetY > currentYOffset.current) {
      if (
        offsetY >
        initialOffset.current + HEIGHT_OF_ITEM * (numberOfValue.current / 2)
      ) {
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
      <View>
        <Text>current offset: {currentYOffset.current}</Text>
      </View>
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

// TODO: change to props
const styles = StyleSheet.create({
  mainContainer: {
    width: 100,
    height: HEIGHT_OF_LIST,
    backgroundColor: "white",
  },
});
