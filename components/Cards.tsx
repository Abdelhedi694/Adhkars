import { View, Text, ActivityIndicator, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, StatusBar, Modal, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { SharedValue } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper';
import { useTranslation } from 'react-i18next';
import CountryFlag from "react-native-country-flag";
import { Picker } from '@react-native-picker/picker';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
const getShortLanguageCode = (fullLanguageCode: string) => {
    const language = fullLanguageCode.split('-')[0];
    return language;
};
const Cards = () => {
    const [images, setImages] = useState<Photo[]>([]);
    const apiKey = 'SZBEtVVy5qezPxReVn8cbABYCgnWSvMytVKOFT9KBrjvvyTBQzD8TSzV';
    const imageIds = ['12796622', '16733037'];
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const [language, setLanguage] = useState(getShortLanguageCode(i18next.language));
    const [modalVisible, setModalVisible] = useState(false);

    const isAndroid = Platform.OS === "android";

    const languages = [
        { label: "Français", value: "fr" },
        { label: "English", value: "en" },
        { label: "Español", value: "es" }, // Ajout de l'espagnol
    ];
    const languageLabels = {
        fr: {
            fr: "Français",
            en: "Anglais",
            es: "Espagnol",
        },
        en: {
            fr: "French",
            en: "English",
            es: "Spanish",
        },
        es: {
            fr: "Francés",
            en: "Inglés",
            es: "Español",
        },
    };


    const languageToFlag = {
        fr: "FR",
        en: "GB",
        es: "ES", // Drapeau espagnol
    };

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem('appLanguage');
                if (storedLanguage) {
                    setLanguage(storedLanguage);
                    i18next.changeLanguage(
                        storedLanguage === 'fr' ? 'fr-FR' :
                            storedLanguage === 'es' ? 'es-ES' : 'en-US'
                    );
                }
            } catch (error) {
                console.error("Error loading language from storage:", error);
            }
        };

        loadLanguage();
    }, []);

    const changeLanguage = (selectedLanguage: string) => {
        try {
            setLanguage(selectedLanguage);
            AsyncStorage.setItem('appLanguage', selectedLanguage);
            i18next.changeLanguage(
                selectedLanguage === 'fr' ? 'fr-FR' :
                    selectedLanguage === 'es' ? 'es-ES' : 'en-US'
            );
        } catch (error) {
            console.error("Error saving language to storage:", error);
        }
    };

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
    }, []); // Recharger les images uniquement si elles ne sont pas encore chargées


    const { width } = Dimensions.get('screen');
    const _imageWidth = width * 0.7;
    const _imageHeight = _imageWidth * 1.76;
    const _spacing = 12;


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
        { text: t('invocationsMatin'), arabicText: 'أَذْكَارُ ٱلصَّبَاحِ', style: { color: '#F2F7F2', fontWeight: 'bold', fontSize: 25, textTransform: 'uppercase', fontFamily: 'Arabolic', textAlign: 'center', textShadowColor: '#000' }, arabicStyle: { color: '#F2F7F2', fontSize: 20, textAlign: 'center', fontFamily: 'Arabolic', textShadowColor: '#000' } },
        { text: t('invocationSsoir'), arabicText: 'أَذْكَارُ الْمَسَاءِ', style: { color: '#F2F7F2', fontWeight: 'bold', fontSize: 25, textTransform: 'uppercase', fontFamily: 'Arabolic', textAlign: 'center', textShadowColor: '#fff' }, arabicStyle: { color: '#F2F7F2', fontSize: 20, textAlign: 'center', fontFamily: 'Arabolic', textShadowColor: '#fff' } },
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

        const destination = index === 0 ? '/adhkarSabah' : '/adhkarMassa';
        const { text, arabicText, style, arabicStyle } = imageTexts[index] || { text: 'Default Text', arabicText: '', style: { color: 'white' }, arabicStyle: {} };

        return (
            <Link href={destination}>
                <View style={{ width: _imageWidth, height: _imageHeight, overflow: 'hidden', borderRadius: 16 }}>
                    <Animated.View style={[{ flex: 1 }, stylez]}>
                        <ImageBackground
                            source={{ uri: item.src.large }}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            imageStyle={{ borderRadius: 16 }}
                        >
                            {text && <Text style={{ fontFamily: 'Arabolic', marginBottom: 5, color: "white", fontSize: 19, textTransform: "uppercase", flexWrap: "wrap" }}>{text}</Text>}

                            {arabicText && <Text style={arabicStyle}>{arabicText}</Text>}
                        </ImageBackground>
                    </Animated.View>
                </View>
            </Link>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <View style={[styles.pickerContainer]}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <CountryFlag isoCode={languageToFlag[language]} size={25} style={{ borderRadius: 5 }} />
                </TouchableOpacity>
                <Modal
                    visible={modalVisible}
                    transparent={Platform.OS === "ios"} // Semi-transparent pour iOS uniquement
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={[styles.modalContainer, Platform.OS === "android" && styles.androidBackground]}>
                        {Platform.OS === "android" ? (
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={language}
                                    onValueChange={(value) => {
                                        changeLanguage(value);
                                        setModalVisible(false);
                                    }}
                                    style={styles.picker}
                                >
                                    {Object.keys(languageLabels[language]).map((key) => (
                                        <Picker.Item key={key} label={languageLabels[language][key]} value={key} />
                                    ))}
                                </Picker>
                            </View>
                        ) : (
                            <Picker
                                selectedValue={language}
                                onValueChange={(value) => {
                                    changeLanguage(value);
                                    setModalVisible(false);
                                }}
                                style={styles.iosPicker}
                            >
                                {Object.keys(languageLabels[language]).map((key) => (
                                    <Picker.Item
                                        key={key}
                                        label={languageLabels[language][key]}
                                        value={key}
                                        color="white" // Couleur blanche pour iOS
                                    />
                                ))}
                            </Picker>
                        )}
                    </View>
                </Modal>

            </View>
            {/* Contenu principal */}
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                <View style={StyleSheet.absoluteFillObject}>
                    {images.map((photo, index) => (
                        <BackdropPhoto key={photo.id} photo={photo} index={index} scrollX={scrollX} />
                    ))}
                </View>

                <Animated.FlatList
                    data={images}
                    keyExtractor={(item) => String(item.id)}
                    horizontal
                    contentContainerStyle={{
                        gap: _spacing,
                        paddingHorizontal: (width - _imageWidth) / 2
                    }}
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
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    pickerContainer: {
        alignSelf: "flex-end",
        marginVertical: 5,
        paddingHorizontal: 20, // Marges gauche/droite
        zIndex: 10, // Assurez-vous que le picker reste visible au-dessus des autres vues
    },
    androidBackground: {
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fond semi-transparent sur Android
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fond semi-transparent
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "white", // Texte blanc pour le titre
    },
    pickerWrapper: {
        backgroundColor: "white", // Fond blanc pour Android
        padding: 20,
        borderRadius: 10,
    },
    picker: {
        width: 250, // Ajustez la taille du Picker si nécessaire
        height: 50,
        borderRadius: 5,
    },
    iosPicker: {
        backgroundColor: "transparent", // Pas de conteneur blanc sur iOS
        width: "100%",
    },
});


export default Cards;
