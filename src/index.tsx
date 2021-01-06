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
  const flatListRef: React.MutableRefObject<FlatList | null> = useRef(null);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log("y offset::>>", nativeEvent.contentOffset.y);
  };

  // initialize number array
  useEffect(() => {
    const tmp = [];
    for (let i = minValue; i <= maxValue; i++) {
      tmp.push(i);
    }
    setData([...tmp, ...tmp, ...tmp]);
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const LENGTH = maxValue - minValue + 1;
    const OFFSET =
      (LENGTH + 1) * HEIGHT_OF_ITEM - (HEIGHT_OF_LIST % HEIGHT_OF_ITEM) / 2;
    console.log("OFFSET", OFFSET);
    flatListRef.current?.scrollToOffset({
      offset: OFFSET,
      animated: false,
    });
  }, [data]);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        snapToAlignment="center"
        data={data}
        snapToInterval={HEIGHT_OF_ITEM}
        onScroll={onScroll}
        scrollEventThrottle={1000}
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
