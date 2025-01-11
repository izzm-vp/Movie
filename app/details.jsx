import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';

export default function DetailsScreen() {
    const params = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
                <Image style={[StyleSheet.absoluteFillObject]} source={{ uri: params.poster }} />
           
            <LinearGradient
                colors={['transparent', 'black']}
                style={{
                    height: "100%",
                    width: "100%",
                    position: 'absolute',
                    bottom: 0,
                }}
            />
        </View>
    );
}

