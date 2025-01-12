
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
import { View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Rect } from "react-native-svg"
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation, useRouter } from 'expo-router';
import Animated, {
  interpolate, useAnimatedStyle, useSharedValue,
  Extrapolation,
  withTiming,
  withSpring,
  ReduceMotion,
} from 'react-native-reanimated';


const AnimatedSVG = Animated.createAnimatedComponent(Svg);


const { width, height } = Dimensions.get('window');
const SPACING = 10;
const ITEM_SIZE = width * 0.75;
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
        renderItem={({ item, index }) => <BackdropItem item={item} index={index} scrollX={scrollX} />}
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


const BackdropItem = ({ item, index, scrollX }) => {
  if (!item.poster) {
    return null;
  }

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(scrollX.value, [(index - 1) * ITEM_SIZE, index * ITEM_SIZE],[width, 0],Extrapolation.CLAMP);

    return {
      transform: [{
        translateX: translateX,  
      }],
    };
  });

  return (
    <MaskedView
      style={{ position: "absolute", width, height: BACKDROP_HEIGHT }}
      maskElement={
        <AnimatedSVG
          style={animatedStyle}
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
};

const Card = ({ item, index, scrollX }) => {
  const navigation = useNavigation();

  if (!item.poster) {
    return <View style={{ width: SPACER_ITEM_SIZE }} />;
  }

  const inputRange = [
    (index - 2) * ITEM_SIZE,
    (index - 1) * ITEM_SIZE,
    index * ITEM_SIZE,
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value,
      inputRange, [0.7, 1, 0.7],Extrapolation.CLAMP
    ),
    transform: [{
      translateY: interpolate(scrollX.value,
        inputRange, [100, 50, 100],Extrapolation.CLAMP)
    }]
  }));


  return (
    <Pressable
      onPress={() => {
        navigation.navigate('details', { tag: item.key, poster: item.poster })
      }}
      activeOpacity={.7}
      style={{ width: ITEM_SIZE }}
    >

      <Animated.View style={[styles.card, animatedStyle]}>
        <Animated.Image
          sharedTransitionTag={`item ${item.key}`}
          source={{ uri: item.poster }}
          style={styles.posterImage}
        />
      </Animated.View>
    </Pressable>

  );
}

export default function HomeScreen() {


  const moviesWspacers = [
    { key: 'left-spacer' },
    ...movies.map((movie, index) => ({ ...movie, key: `${index}` })),
    { key: 'right-spacer' },
  ];

  const scrollX = useSharedValue(0);

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
        }}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          
          scrollX.value = withSpring(offsetX,  {
            duration: 251,
            dampingRatio: 1.02,
            stiffness: 500,
            overshootClamping: false,
            restDisplacementThreshold: 150,
            restSpeedThreshold: 150,
            reduceMotion: ReduceMotion.Never,
          });
        }}
        scrollEventThrottle={16}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        renderItem={({ item, index }) => <Card scrollX={scrollX} item={item} index={index} />}
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


