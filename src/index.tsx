import React, { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

let tmp: number[] = [];
for (var i = 0; i < 5; i++) {
  tmp.push(i + 1);
}
const HEIGHT = 60;
function RNWheelNumberPicker() {
  const [data, setData] = useState([...tmp.slice(tmp.length / 2), ...tmp]);
  const scrollViewRef: React.MutableRefObject<FlatList | null> = useRef(null);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log(nativeEvent.contentOffset.y);
  };

  useEffect(() => {
    if (!scrollViewRef.current) return;

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
        ref={scrollViewRef}
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
