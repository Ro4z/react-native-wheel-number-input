import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HEIGHT = 60;

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
    console.log(nativeEvent.contentOffset.y);

    if (false) setData([...data, ...data.slice(data.length / 2)]);
  };

  useEffect(() => {
    if (maxValue < minValue) maxValue = minValue;
    const tmpArray = [];
    for (let i = minValue; i <= maxValue; i++) {
      tmpArray.push(i);
    }
    setData(tmpArray);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        snapToAlignment="center"
        data={data}
        snapToInterval={HEIGHT}
        onScroll={onScroll}
        scrollEventThrottle={1000}
        decelerationRate="fast"
        initialScrollIndex={0}
        ref={flatListRef}
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={(data, index) => ({
          length: HEIGHT,
          offset: HEIGHT * index,
          index,
        })}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width: "100%",
                height: HEIGHT,
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
    height: 210,
    backgroundColor: "white",
  },
});
