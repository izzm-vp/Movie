import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import Animated from 'react-native-reanimated';

export default function DetailsScreen() {
  const { tag, poster } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <Animated.Image
        sharedTransitionTag={`item ${tag}`}
        style={[StyleSheet.absoluteFillObject]}
        source={{ uri: poster }}
      />
      <LinearGradient
        colors={['transparent', 'black']}
        style={{
          height: "100%",
          width: "100%",
          position: 'absolute',
          bottom: 0,
        }}
      />
      <Animated.View sharedTransitionTag={`modal ${tag}`} style={styles.modal}>

      </Animated.View>
    </View>
  );
}

const styles= StyleSheet.create({
  modal:{
    height:"60%",
    width:"100%",
    backgroundColor:"white",
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    position: 'absolute',
    bottom: 0,
  }


})
