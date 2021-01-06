import React, { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const tmp: number[] = [];
for (let i = 0; i < 5; i++) {
  tmp.push(i + 1);
}
const HEIGHT = 60;
function RNWheelNumberPicker() {
  const [data, setData] = useState([...tmp.slice(tmp.length / 2), ...tmp]);
  const flatListRef: React.MutableRefObject<FlatList | null> = useRef(null);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log(nativeEvent.contentOffset.y);

    if (false) setData([...data, ...data.slice(data.length / 2)]);
  };

  useEffect(() => {
    if (!flatListRef.current) return;

    // scrollViewRef.current.scrollTo({
    //   y: (HEIGHT * data.length) / 2,
    //   animated: false,
    // });
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
        initialScrollIndex={tmp.length / 2}
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

export default RNWheelNumberPicker;

const styles = StyleSheet.create({
  mainContainer: {
    width: 100,
    height: 210,
    backgroundColor: "white",
  },
});
