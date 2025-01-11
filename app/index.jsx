
const movies = [
  {
    title: "The Shawshank Redemption",
    poster: "https://assets-prd.ignimgs.com/2024/06/11/artwork-1718103614515.jpeg",
    backdrop: "https://m.media-amazon.com/images/I/81nC6G5EeyL._AC_SL1500_.jpg"
  },
  {
    title: "The Godfather",
    poster: "https://cdn.posteritati.com/posters/000/000/069/893/everything-everywhere-all-at-once-md-web.jpg",
    backdrop: "https://m.media-amazon.com/images/I/71xBLRBYOiL._AC_SL1500_.jpg"
  },
  {
    title: "Pulp Fiction",
    poster: "https://mir-s3-cdn-cf.behance.net/project_modules/hd/8d8f28105415493.619ded067937d.jpg",
    backdrop: "https://m.media-amazon.com/images/I/81AJdOIEI2L._AC_SL1500_.jpg"
  },
  {
    title: "Forrest Gump",
    poster: "https://image.tmdb.org/t/p/original/9HmrSXXZTHnRt46poimF0mMe7rS.jpg",
    backdrop: "https://m.media-amazon.com/images/I/81xTx-LyY-L._AC_SL1500_.jpg"
  }
];
import { View, Image, StyleSheet, Dimensions, Animated, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Rect } from "react-native-svg"
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';


const AnimatedSVG = Animated.createAnimatedComponent(Svg);


const { width, height } = Dimensions.get('window');
const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.6

const Backdrop = ({ movies, scrollX }) => {
  const colorScheme = useColorScheme();
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.key}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 1) * ITEM_SIZE, (index) * ITEM_SIZE],
            outputRange: [width, 0],
          });
          return (
            <MaskedView
              style={{ position: "absolute", width, height: BACKDROP_HEIGHT }}
              maskElement={
                <AnimatedSVG
                  style={{ transform: [{ translateX }] }}
                  width={width}
                  height={BACKDROP_HEIGHT}
                  viewBox={`0 0 ${width} ${BACKDROP_HEIGHT}`}
                >
                  <Rect
                    width={width}
                    height={BACKDROP_HEIGHT}
                    fill="white"
                  />
                </AnimatedSVG>
              }
            >
              <Image
                source={{ uri: item.poster }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  resizeMode: 'cover',
                }}
              />
            </MaskedView>
          );
        }}
      />
      <LinearGradient
        colors={['transparent', colorScheme === 'dark' ? 'black' : 'white']}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
};


export default function HomeScreen() {
  const router = useRouter();
  const moviesWspacers = [
    { key: 'left-spacer' },
    ...movies.map((movie, index) => ({ ...movie, key: `${index}` })),
    { key: 'right-spacer' },
  ];

  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Backdrop movies={moviesWspacers.filter(
        (movie) => movie.key !== 'left-spacer' && movie.key !== 'right-spacer'
      )} scrollX={scrollX} />
      <Animated.FlatList
        bounces={false}
        showsHorizontalScrollIndicator={false}
        data={moviesWspacers}
        keyExtractor={(item) => item.key}
        horizontal
        contentContainerStyle={{
          alignItems: 'center',

          backgroundColor: 'transparent',
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={{ width: SPACER_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/details",
                  params: { key: item.key, poster: item.poster },
                });
              }}
              activeOpacity={.7}
              style={{ width: ITEM_SIZE }}
            >
              <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
                  <Image
                    source={{ uri: item.poster }}
                    style={styles.posterImage}
                  />
              </Animated.View>
            </TouchableOpacity>

          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: SPACING,
    backgroundColor: 'white',
    padding: SPACING,
    borderRadius: 34,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
  },
});
