import { View, Text, ActivityIndicator, Image, Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useNavigation, useRouter } from 'expo-router';
import { SharedValue } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper';

interface Photo {
    id: number;
    url: string;
    src: {
      original: string;
      large2x: string;
      large: string;
      medium: string;
      small: string;
      portrait: string;
      landscape: string;
      tiny: string;
    };
    alt: string;
}

const Cards = () => {
    const [images, setImages] = useState<Photo[]>([]);
    const apiKey = 'SZBEtVVy5qezPxReVn8cbABYCgnWSvMytVKOFT9KBrjvvyTBQzD8TSzV';
    const imageIds = ['12796622', '16733037'];
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imageRequests = imageIds.map((id) =>
                    axios.get<Photo>(`https://api.pexels.com/v1/photos/${id}`, {
                        headers: {
                            Authorization: apiKey,
                        },
                    })
                );

                const responses = await Promise.all(imageRequests);
                const fetchedImages = responses.map((response) => response.data);
                setImages(fetchedImages);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching images from Pexels:', error);
            }
        };

        fetchImages();
    }, []);

    const { width } = Dimensions.get('screen');
    const _imageWidth = width * 0.7;
    const _imageHeight = _imageWidth * 1.76;
    const _spacing = 12;

    // Récupère le router
    const navigation = useNavigation();

    function handleCardPress(text: String) {
        if(text == "Invocations du matin"){
            navigation.navigate("adhkarSabah");
        }else if(text == "Invocations du soir"){
            navigation.navigate("adhkarMassa");
        }
        
    }

    function BackdropPhoto({ photo, index, scrollX }: { photo: Photo; index: number; scrollX: SharedValue<number> }) {
        const stylez = useAnimatedStyle(() => {
            return {
                opacity: interpolate(scrollX.value, [index - 1, index, index + 1], [0, 1, 0]),
            };
        });
        return (
            <Animated.Image
                source={{ uri: photo.src.large }}
                style={[StyleSheet.absoluteFillObject, stylez]}
                blurRadius={20}
            />
        );
    }

    const imageTexts = [
        { text: 'Invocations du matin', arabicText: 'أَذْكَارُ ٱلصَّبَاحِ', style: { color: '#F2F7F2', fontWeight: 'bold', fontSize: 25, textTransform: 'uppercase', fontFamily: 'Arabolic', textAlign: 'center', textShadowColor: '#000' }, arabicStyle: { color: '#F2F7F2', fontSize: 20, textAlign: 'center', fontFamily: 'Arabolic', textShadowColor: '#000' } },
        { text: 'Invocations du soir', arabicText: 'أَذْكَارُ الْمَسَاءِ', style: { color: '#F2F7F2', fontWeight: 'bold', fontSize: 25, textTransform: 'uppercase', fontFamily: 'Arabolic', textAlign: 'center', textShadowColor: '#fff' }, arabicStyle: { color: '#F2F7F2', fontSize: 20, textAlign: 'center', fontFamily: 'Arabolic', textShadowColor: '#fff' } },
    ];

    function Photo({ item, index, scrollX }: { item: Photo; index: number; scrollX: SharedValue<number> }) {
        const stylez = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        scale: interpolate(scrollX.value, [index - 1, index, index + 1], [1.6, 1, 1.6]),
                    },
                    {
                        rotate: `${interpolate(scrollX.value, [index - 1, index, index + 1], [15, 0, -15])}deg`,
                    },
                ],
            };
        });

        const { text, arabicText, style, arabicStyle } = imageTexts[index] || { text: 'Default Text', arabicText: '', style: { color: 'white' }, arabicStyle: {} };

        return (
            <TouchableOpacity onPress={() => handleCardPress(text)} style={{ width: _imageWidth, height: _imageHeight, overflow: 'hidden', borderRadius: 16 }}>
                <Animated.View style={[{ flex: 1 }, stylez]}>
                    <ImageBackground
                        source={{ uri: item.src.large }}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ borderRadius: 16 }}
                    >
                        {text && <Text style={style}>{text}</Text>}
                        {arabicText && <Text style={arabicStyle}>{arabicText}</Text>}
                    </ImageBackground>
                </Animated.View>
            </TouchableOpacity>
        );
    }

    const scrollX = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((e) => {
        scrollX.value = e.contentOffset.x / (_imageWidth + _spacing);
    });

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={StyleSheet.absoluteFillObject}>
    {images.map((photo, index) => (
        <BackdropPhoto key={photo.id} photo={photo} index={index} scrollX={scrollX} />
    ))}
</View>
            <Animated.FlatList
                data={images}
                keyExtractor={(item) => String(item.id)}
                horizontal
                contentContainerStyle={{ gap: _spacing, paddingHorizontal: (width - _imageWidth) / 2 }}
                snapToInterval={_imageWidth + _spacing}
                decelerationRate={'fast'}
                style={{ flexGrow: 0 }}
                renderItem={({ item, index }) => {
                    return <Photo item={item} index={index} scrollX={scrollX} />;
                }}
                onScroll={onScroll}
                scrollEventThrottle={1000 / 60}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default Cards;
