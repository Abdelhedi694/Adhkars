import { SafeAreaView, Text, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av'; // Importation d'Expo Audio
import Slider from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import ColorWheel from 'react-native-wheel-color-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';


const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
const AdhkarSabah = () => {

    const [showRewards, setShowRewards] = useState([]);
    const [counters, setCounters] = useState([]);
    const [isPlayingList, setIsPlayingList] = useState([])
    const [playbackPositionList, setPlaybackPositionList] = useState([]); // Pour stocker la position de lecture
    const soundRefList = useRef([]);
    const [audioDurationList, setAudioDurationList] = useState([]);
    const [customColors, setCustomColors] = useState(['#E0EAF4', '#A6CBE3', '#FDE2E4']); // Couleurs du dégradé par défaut
    const [selectedColorIndex, setSelectedColorIndex] = useState(null);
    const [hasClicked, setHasClicked] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const { t } = useTranslation();

    const adhkars = [
        {
            number: 1,
            adkharArab: "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَ مَا خَلْفَهُمْ وَ لاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَ الأَرْضَ وَ لاَ يَئُودُهُ حِفْظُهُمَا وَ هُوَ العَلَيُّ العَظِيمُ",
            frenchTraduction: t('adhkarSabah.ayatKursi.traduction'),
            reward: t('adhkarSabah.ayatKursi.recompense'),
            phonetique: `« Allahou la ilaha illa houwa alhayyou alqayyoum la ta/khoudhouhou sinatoun wala nawm lahou ma fi ssamawati wama fi l-ard man dha alladhi yachfa'ou 'indahou illa bi-idhnih ya'lamou ma bayna aydihim wama khalfahoum wala youhitouna bichay-in min 'ilmihi illa bima cha-a wasi'a koursiyyouhou ssamawati waal-arda wala yaoudouhou hifdhouhouma wahouwa al'aliyyou al'adhim. »`
            , audio: require('../assets/audios/ayatKursi.mp3')
        },
        {
            number: 2,
            adkharArab: `بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ

قُلْ هُوَ اللهُ أَحَدٌ❀ اللهُ الصَّمَدُ❀ لَمْ يَلِدْ وَلَمْ يُولَدْ❀ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ
            
سُورَةُ الإِخْلاَصِ`,
            frenchTraduction: t('adhkarSabah.ikhlass.traduction'),
            reward: t('adhkarSabah.ikhlass.recompense'),
            phonetique: "Qul Huwa Allāhu 'Aĥadun ❀ Allāhu Aş-Şamadu ❀ Lam Yalid Wa Lam Yūlad ❀ Walam Yakun Lahu Kufūan 'Aĥadun",
            howMuchTime: 3,
            audio: require('../assets/audios/sourateIkhlass.mp3')
        },
        {
            number: 3,
            adkharArab: `بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ

قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ❀ مِن شَرِّ مَا خَلَقَ ❀ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ❀
وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ❀ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ
            
سُورَةُ الفَلَق`,
            frenchTraduction: t('adhkarSabah.falaq.traduction'),
            reward: t('adhkarSabah.falaq.recompense'),
            phonetique: "Qul 'A`ūdhu Birabbi Al-Falaqi ❀ Min Sharri Mā Khalaqa ❀ Wa Min Sharri Ghāsiqin 'Idhā Waqaba ❀ Wa Min Sharri An-Naffāthāti Fī Al-`Uqadi ❀ Wa Min Sharri Ĥāsidin 'Idhā Ĥasada",
            howMuchTime: 3,
            audio: require('../assets/audios/sourateAlFalaq.mp3')
        },
        {
            number: 4,
            adkharArab: `بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ

قُلْ أَعُوذُ بِرَبِّ النَّاسِ ❀ مَلِكِ النَّاسِ ❀ إِلَهِ النَّاسِ ❀ مِن شَرِّ الْوَسْوَاسِ
الْخَنَّاسِ ❀ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ❀ مِنَ الْجِنَّةِ وَالنَّاسِ
            
سُورَةُ النَّاس`,
            frenchTraduction: t('adhkarSabah.nas.traduction'),
            reward: t('adhkarSabah.nas.recompense'),
            phonetique: "Qul 'A`ūdhu Birabbi An-Nāsi ❀ Maliki An-Nāsi ❀ 'Ilahi An-Nāsi ❀ Min Sharri Al-Waswāsi Al-Khannāsi ❀ Al-Ladhī Yuwaswisu Fī Şudūri An-Nāsi ❀ Mina Al-Jinnati Wa An-Nāsi",
            howMuchTime: 3,
            audio: require('../assets/audios/sourateNas.mp3')
        },
        {
            number: 5,
            adkharArab: `أصْبَحْنَا وَأصْبَحَ المُلْكُ للهِ، وَالحَمْدُ لِلَّهِ، لا إلهَ إلاَّ اللهُ وَحْدَهُ لا شَرِيْكَ لَهُ، لَهُ المُلْكُ، ولَهُ الحَمْدُ، وهُوَ عَلَى كُلِّ شَيءٍ قَدِيرٌ، رَبِّ أسْألُكَ خَيْرَ مَا في هَذَا اليَوْمِ وَخَيْرَ مَا بَعْدَهُ، وأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا اليَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أعُوذُ بِكَ مِنَ الكَسَلِ، وسُوءِ الكِبَرِ، رَبِّ أعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وعَذَابٍ فِي القَبْرِ`,
            frenchTraduction: t('adhkarSabah.asbahnaWaLqabr.traduction'),
            reward: t('adhkarSabah.asbahnaWaLqabr.recompense'),
            phonetique: "Asbahnâ wa asbaha-l-mulku li-llâhi wa-l-hamduli-llâh. Lâ ilâha illâ llâhu wahdahu lâ sharîka lah, lahu-l-mulku wa lahu-l-hamdu wa huwa ‘alâ kulli shayin Qadîr. Rabbi, asaluka khayra mâ fî hâdha-l-yawmi wa khayra mâ ba’dah. Wa a’ûdhu bika min sharri mâ fî hâdha-l-yawmi wa sharri mâ ba’dah. Rabbi a’ûdhu bika min al-kasali wa sûi-l-kibar. Rabbi a’ûdhu bika min ‘adhâbin fi-n-nâri wa ‘adhâbin fi-l-qabr.",
            audio: require('../assets/audios/asbahnaWaLqabr.mp3')
        },
        {
            number: 6,
            adkharArab: `اللّهُـمَّ بِكَ أَصْـبَحْنا وَبِكَ أَمْسَـينا ، وَبِكَ نَحْـيا وَبِكَ نَمـوتُ وَإِلَـيْكَ النُّـشور`,
            frenchTraduction: t('adhkarSabah.ilaykaNushur.traduction'),
            source: t('adhkarSabah.ilaykaNushur.source'),
            phonetique: "Allâhumma bika asbahnâ, wa bika amsaynâ, wa bika nahyâ, wa bika namût, wa ilayka-n-nushûr.",
            audio: require('../assets/audios/ilaykaNushur.mp3')
        },
        {
            number: 7,
            adkharArab: `اللّهـمَّ أَنْتَ رَبِّـي لا إلهَ إلاّ أَنْتَ ، خَلَقْتَنـي وَأَنا عَبْـدُك ، وَأَنا عَلـى عَهْـدِكَ وَوَعْـدِكَ ما اسْتَـطَعْـت ، أَعـوذُبِكَ مِنْ شَـرِّ ما صَنَـعْت ، أَبـوءُ لَـكَ بِنِعْـمَتِـكَ عَلَـيَّ وَأَبـوءُ بِذَنْـبي فَاغْفـِرْ لي فَإِنَّـهُ لا يَغْـفِرُ الذُّنـوبَ إِلاّ أَنْتَ`,
            frenchTraduction: t('adhkarSabah.persPardonnePecherSaufToi.traduction'),
            reward: t('adhkarSabah.persPardonnePecherSaufToi.recompense'),
            phonetique: "Allâhumma anta Rabbî, lâ ilâha illâ ant. Khalaqtanî wa ana ‘abduk, wa ana ‘alâ ‘ahdika wa wa’dika mâ stata’t. A’ûdhu bika min sharri mâ sana’t. Abûu laka bi-ni’matika ‘alayya wa abûu bi-dhanbî fa-ghfir lî, fa-innahu lâ yaghfiru-dh-dhunûba illâ ant.",
            audio: require('../assets/audios/persPardonnePecherSaufToi.mp3')
        },
        {
            number: 8,
            adkharArab: `اللّهُـمَّ إِنِّـي أَصْبَـحْتُ أَُشْـهِدُك ، وَأُشْـهِدُ حَمَلَـةَ عَـرْشِـك ، وَمَلائِكَتِك ،         
وَجَمـيعَ خَلْـقِك ، أَنَّـكَ أَنْـتَ اللهُ لا إلهَ إلاّ أَنْـتَ وَحْـدَكَ لا شَريكَ لَـك ، وَأَنَّ مُحَمّـداًعَبْـدُكَ وَرَسـولُـك`,
            frenchTraduction: t('adhkarSabah.4reprises.traduction'),
            reward: t('adhkarSabah.4reprises.recompense'),
            howMuchTime: 4,
            week: true,
            phonetique: "Allâhoumma innî asbahtou oush-hidouka, wa oush-hidou hamalata ‘arshika, wa malâ ikataka, wa jamî’a khalqika, annaka anta l-lâhou, lâ ilâha illâ anta, wahdaka lâ sharîka laka, wa anna mouhammadan ‘abdouka wa rasoûlouk.",
            audio: require('../assets/audios/4reprises.mp3')
        },
        {
            number: 9,
            adkharArab: `اللّهُـمَّ ما أَصْبَـَحَ بِي مِنْ نِعْمَةٍ، أوْ بِأحَدٍ مِنْ خَلقِكَ، فَمِنْكَ وَحْدَكَ لا
شَرِيْكَ لَكَ، فَلَكَ الحَمْدُ ولَكَ الشُّكْرُ`,
            frenchTraduction: t('adhkarSabah.toutBienfaitsParvient.traduction'),
            source: t('adhkarSabah.toutBienfaitsParvient.source'),
            phonetique: "Allâhoumma mâ asbaha bî min ni’matin aw bi-ahadin min khalqika, fa-minka wahdaka lâ sharîka laka. Fa-laka-l-hamdou wa laka sh-shoukr.",
            audio: require('../assets/audios/toutBienfaitsParvient.mp3')
        },
        {
            number: 10,
            adkharArab: `اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إلَهَ إلاَّ أنْتَ، اللَّهُمَّ إنِّي أَعُوذُ بِكَ مِنَ الكُفْرِ وَالفَقْرِ، وأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لا إلَهَ إلاَّ
أنْتَ`,
            frenchTraduction: t('adhkarSabah.3reprisesafini.traduction'),
            source: t('adhkarSabah.3reprisesafini.source'),
            week: true,
            howMuchTime: 3,
            phonetique: "Allâhoumma ‘âfinî fî badanî. Allâhoumma ‘âfinî fî sam’î. Allâhoumma ‘âfinî fî basarî. Lâ ilâha illâ anta. Allâhoumma innî a’oûdhou bika mina-l-koufri, wa-l-faqri. Wa a’oûdhou bika min ‘adhâbi-l-qabri. Lâ ilâha illâ ant.",
            audio: require('../assets/audios/3reprisesafini.mp3')
        },
        {
            number: 10,
            adkharArab: `حَسْبِيَ اللهُ لاَ إلَهَ إلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ العَرْشِ العَظِيمِ`,
            frenchTraduction: t('adhkarSabah.7fois.traduction'),
            reward: t('adhkarSabah.7fois.recompense'),
            week: true,
            howMuchTime: 7,
            phonetique: "Hasbiya Allahou La Ilaha Illa Houwa 'Alayhi Tawakaltou Wa Houwa Raboul 'Archil 'Adhim.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 11,
            adkharArab: `اللهُمَّ إنِّي أسْألُكَ العَفْوَ والعَافيةَ في الدُّنْيَا والآخِرَةِ، اللهُمَّ إنِّي أسْألُكَ العَفْوَ والعَافيةَ في دِيْني ودُنْيَاي، وأهْلِي، ومَالي، اللهُمَّ اسْتُرْ عَوْرَاتي، وآمِنْ رَوْعَاتي، اللهُمَّ احْفَظْني مِنْ بيْنِ يَدَيَّ، ومِنْ خَلْفِي، وعَنْ يَميني، وعَنْ شِمَالي، ومِنْ فَوْقِي، وأعُوذُ بِعَظَمَتكَ أنْ أُغْتالَ مِنْ تَحْتي`,
            frenchTraduction: t('adhkarSabah.èfwaWa3afiyata.traduction'),
            reward: t('adhkarSabah.èfwaWa3afiyata.recompense'),
            phonetique: "Allahumma Inni As'aluka l-'Afwa wal-'Âfiyata Fî-d-Dunyâ wa-l-Âkhira, Allahumma Inni As'aluka l-'Afwa wa-l-'Âfiyata Fî Dînî wa Dunyâya wa Ahlî wa Mâlî, Allahumma Ustur 'Awrâtî wa Âmin Raw'âtî, Allahumma Ihfadhnî Min Bayni Yadayya wa Min Khalfî wa 'An Yamînî, wa 'An Chimâlî, wa Min Fawqî, wa A'ûdhu Bi'Adhamatika An Ughtala Min Tahtî.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 12,
            adkharArab: `اللَّهُمَّ عَالِمَ الغَيْبِ والشَّهَادَةِ، فَاطِرَ السَّموَاتِ والأرْضِ، رَبَّ كُلِّ شَيءٍ ومَلِيْكَهُ، أشْهَدُ أنْ لا إلَهَ إلاَّ أنْتَ، أعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وأنْ أقْتَرِفَ عَلَى نَفْسِي سُوءاً، أوْ أجُرَّهُ إلَى مُسْلِمٍ`,
            frenchTraduction: t('adhkarSabah.visibleInvisible.traduction'),
            reward: t('adhkarSabah.visibleInvisible.recompense'),
            phonetique: "Allâhoumma 'âlim-alghaybi wa sh-shahâdati, fâtira s-samâwâti wa-l ardi, rabba koulli shay in wa malîkahou. Ash-hadou anlâ ilâha illâ anta. A'oûdhou bika min sharrin nafsî, wa min sharri sh-shaytâni wa 'hirkihi, wa an aqtarifa 'alâ nafsî soû an ajourrahou ilâ Mouslim.",
            audio: require('../assets/audios/visibleInvisible.mp3')
        },
        {
            number: 13,
            adkharArab: `بِسْمِ اللهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيءٌ في الأرْضِ وَلَا فِي السَّمَاءِ وهُوَ السَّمِيعُ العَلِيْمُ`,
            frenchTraduction: t('adhkarSabah.lèYaDurru3fois.traduction'),
            reward: t('adhkarSabah.lèYaDurru3fois.recompense'),
            howMuchTime: 3,
            phonetique: "Bismilllah Alladhi La Yadourrou Ma'a Smihi Chay oun Fil Ardi Wa La Fis Sama Wa Houwas Sami'oul 'Alim.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 14,
            adkharArab: `رَضِيْتُ بِاللهِ رَبًّا، وبالإسْلامِ دِيْناً، وبِمُحَمَّدٍ نَبيًّا`,
            frenchTraduction: t('adhkarSabah.attestation3fois.traduction'),
            reward: t('adhkarSabah.attestation3fois.recompense'),
            phonetique: "Raditou Billahi Raban Wa Bil Islami Dinan Wa Bi Mohamedin Nabiyan.",
            audio: require('../assets/audios/attestation3fois.mp3')
        },
        {
            number: 15,
            adkharArab: `يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ`,
            frenchTraduction: t('adhkarSabah.yèHayyou.traduction'),
            source: t('adhkarSabah.yèHayyou.source'),
            phonetique: "Yâ hayyû, yâ qayyûmou bi rahmatika astaghîth. Aslih lî sha nî koullahou wa lâ takilnî ilâ nafsî tarfata 'ayn.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 16,
            adkharArab: `أصْبَحْنَا وأصْبَحَ المُلْكُ للَّهِ رَبِّ العَالَمِيْنَ، اللَّهُمَّ إنِّي أسْألُكَ خَيْرَ هَذَا اليَوْمِ: فَتْحَهُ، ونَصْرَهُ، وَنُورَهُ، وبَرَكَتَهُ، وهُدَاهُ، وأعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْهِ وَشَرِّ مَا بَعْدَهُ`,
            frenchTraduction: t('adhkarSabah.moulkoulillâhirabbilalamin.traduction'),
            source: t('adhkarSabah.moulkoulillâhirabbilalamin.source'),
            week: true,
            phonetique: "Asbahnâ wa asbaha-l-moulkou li-l-lâhi rabbi-l-‘âlamîn. Allahoumma innî as alouka khayra hâdhâ-l-yawmi : fathahou, wa nousrahou, wa noûrahou, wa barakatahou, wa houdâhou. Wa a’oûdhou bika min sharri mâ fîhi wa sharri mâ ba’dah.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 17,
            adkharArab: `أصْبَحْنَا عَلَى فِطْرَةِ الإسْلامِ، وعَلَى كَلِمَةِ الإخْلاصِ، وعَلَى دِيْنِ نَبيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وعَلَى مِلَّةِ أبِينَا إبْرَاهيمَ، حَنيفاً مُسْلِماً ومَا كَانَ مِنَ المُشْرِكِينَ`,
            frenchTraduction: t('adhkarSabah.fitratilislami.traduction'),
            source: t('adhkarSabah.fitratilislami.source'),
            phonetique: "Asbahna 'ala fitrati-l-islami, wa 'ala kalimati-l-ikhlasi, wa 'ala dini nabiyyina Muhammadin, wa 'ala millati abina Ibrahima, hanifan, musliman, wa ma kana mina-l-mushrikin.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 18,
            adkharArab: `سُبْحَانَ اللَّهِ وَبِحَمْدِهِ`,
            frenchTraduction: t('adhkarSabah.subhanAllahiWaBihamdih.traduction'),
            reward: t('adhkarSabah.subhanAllahiWaBihamdih.recompense'),
            howMuchTime: 100,
            phonetique: "Sobhanalah Wa Bihamdih.",
            audio: require('../assets/audios/subhanAllahiWaBihamdih.mp3')
        },
        {
            number: 19,
            adkharArab: `لا إلَهَ إلاَّ اللهُ وَحْدَهُ لا شَرِيْكَ لَهُ، لَهُ المُلْكُ، ولَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيءٍ قَديرٌ`,
            frenchTraduction: t('adhkarSabah.100foisattestationComplete.traduction'),
            reward: t('adhkarSabah.100foisattestationComplete.recompense'),
            howMuchTime: 100,
            phonetique: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamdu, wa huwa ‘alâ kulli shayin Qadîr.",
            audio: require('../assets/audios/100foisattestationComplete.mp3')
        },
        {
            number: 20,
            adkharArab: `لَا إلَهَ إلاَّ اللهُ، وَحْدَهُ لا شريكَ لهُ، لَهُ المُلْكُ ولَهُ الحَمْدُ، وهُوَ علَى كُلِّ شَيءٍ قَديرٌ`,
            frenchTraduction: t('adhkarSabah.1foisattestationComplete.traduction'),
            reward: t('adhkarSabah.1foisattestationComplete.recompense'),

            phonetique: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamdu, wa huwa ‘alâ kulli shayin Qadîr.",
            audio: require('../assets/audios/100foisattestationComplete.mp3')
        },
        {
            number: 21,
            adkharArab: `سُبْحَانَ اللهِ وَ بِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَ مِدَادَ كَلِمَاتِهِ`,
            frenchTraduction: t('adhkarSabah.3èdèdè.traduction'),
            reward: t('adhkarSabah.3èdèdè.recompense'),
            howMuchTime: 3,
            phonetique: "Subhâna-llâhi wa bi-hamdih, ‘adada khalqih, wa ridâ nafsih, wa zinata ‘arshih, wa midâda kalimâtih.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 22,
            adkharArab: `اللهُمَّ إنِّي أَسْألُكَ عِلْماً نافِعاً، ورِزْقاً طَيِّباً، وعَملاً مُتقَبَّلاً`,
            frenchTraduction: t('adhkarSabah.3ilmNéfi3en.traduction'),
            source: t('adhkarSabah.3ilmNéfi3en.source'),
            phonetique: "Allâhumma innî asaluka ‘ilman nâfi’â, wa rizqan tayyibâ, wa ‘amalan mutaqabbalâ.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 23,
            adkharArab: `أستَغْفِرُ اللهَ وأتُوبُ إليهِ`,
            frenchTraduction: t('adhkarSabah.toubouIlayh.traduction'),
            source: t('adhkarSabah.toubouIlayh.source'),
            howMuchManyTime: t('dixfoisjours'),
            phonetique: "Astaghfiru-llāha wa atūbu ilayh.",
            audio: require('../assets/audios/toubouIlayh.mp3')
        },
        {
            number: 24,
            adkharArab: `اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبيِّنَا مُحَمَّدٍ`,
            frenchTraduction: t('adhkarSabah.saliWaSelim10fois.traduction'),
            reward: t('adhkarSabah.saliWaSelim10fois.recompense'),
            howMuchTime: 10,
            phonetique: "Allāhumma ṣalli wa sallim 'alā nabiyyinā Muḥammad.",
            audio: require('../assets/audios/saliWaSelim10fois.mp3'),

        },
    ]

    useEffect(() => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
        });

        const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
            if (Platform.OS === 'ios') {
                // Prevent the close button from being unreachable by hiding the status bar on iOS
                StatusBar.setHidden(true)
            }
        });

        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            if (Platform.OS === 'ios') {
                StatusBar.setHidden(false)
            }
        });

        // Start loading the interstitial straight away
        interstitial.load();

        // Unsubscribe from events on unmount
        return () => {
            unsubscribeLoaded();
            unsubscribeOpened();
            unsubscribeClosed();
        };
    }, []);

    const handleColorChange = (color, index) => {
        const updatedColors = [...customColors];
        updatedColors[index] = color;
        setCustomColors(updatedColors);
        saveColorsToStorage(updatedColors);

        if (!hasClicked) {
            setHasClicked(true);  // Marque que l'utilisateur a cliqué pour la première fois
            // Afficher la publicité plein écran ici
            // Vous pouvez utiliser une bibliothèque d'ads pour afficher un interstitiel (par exemple, AdMob)
            showFullScreenAd();
        }
    };

    const showFullScreenAd = () => {
        // Exemple avec une publicité interstitielle
        // Vérifiez si la publicité est prête avant de la montrer
        interstitial.show()
    };

    const saveColorsToStorage = async (colors) => {
        try {
            await AsyncStorage.setItem('customColors', JSON.stringify(colors));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des couleurs :', error);
        }
    };

    useEffect(() => {
        const fetchColors = async () => {
            const storedColors = await loadColorsFromStorage();
            if (storedColors && JSON.stringify(storedColors) !== JSON.stringify(customColors)) {
                setCustomColors(storedColors); // Met à jour si les couleurs sont différentes
            }
        };
        fetchColors();
    }, []);


    const loadColorsFromStorage = async () => {
        try {
            const storedColors = await AsyncStorage.getItem('customColors');
            if (storedColors) {
                const parsedColors = JSON.parse(storedColors);
                return parsedColors;
            }
        } catch (error) {
            console.error('Erreur lors du chargement des couleurs :', error);
        }
        return null; // Renvoie null si aucune donnée n'est trouvée
    };

    const triggerHapticFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleToggleReward = (index) => {
        // Met à jour l'état de la récompense de la card cliquée seulement
        const updatedRewards = [...showRewards];
        updatedRewards[index] = !updatedRewards[index];
        setShowRewards(updatedRewards);

    };
    const handleIncrement = (index) => {
        const updatedCounters = [...counters];
        updatedCounters[index] = (updatedCounters[index] || 0) + 1;
        setCounters(updatedCounters);
        triggerHapticFeedback();
    };

    const handleDecrement = (index) => {
        const updatedCounters = [...counters];
        updatedCounters[index] = Math.max((updatedCounters[index] || 0) - 1, 0);
        setCounters(updatedCounters);
        triggerHapticFeedback();
    };
    const handleReset = (index) => {
        const updatedCounters = [...counters];
        updatedCounters[index] = 0; // Réinitialise le compteur à 0
        setCounters(updatedCounters);
    };
    // Fonction pour jouer l'audio
    const toggleAudio = async (audioFile, index) => {
        if (!soundRefList.current[index]) {
            soundRefList.current[index] = new Audio.Sound();
            await soundRefList.current[index].loadAsync(audioFile);
        }

        const newIsPlayingList = [...isPlayingList];
        const newPlaybackPositionList = [...playbackPositionList];

        if (newIsPlayingList[index]) {
            // En pause : enregistre la position actuelle et met en pause
            const status = await soundRefList.current[index].getStatusAsync();
            newPlaybackPositionList[index] = status.positionMillis;
            await soundRefList.current[index].stopAsync();
            newIsPlayingList[index] = false;
        } else {
            // Lecture : reprend à partir de la position sauvegardée ou de 0
            if (newPlaybackPositionList[index] !== undefined) {
                await soundRefList.current[index].playFromPositionAsync(newPlaybackPositionList[index]);
            } else {
                await soundRefList.current[index].playAsync();
            }
            newIsPlayingList[index] = true;
        }

        setIsPlayingList(newIsPlayingList);
        setPlaybackPositionList(newPlaybackPositionList);
    };

    const updateAudioProgress = async (index) => {
        const status = await soundRefList.current[index].getStatusAsync();
        if (status.isLoaded) {
            setIsPlayingList(prev => {
                const newIsPlayingList = [...prev];
                newIsPlayingList[index] = status.isPlaying;
                return newIsPlayingList;
            });

            setPlaybackPositionList(prev => {
                const newPositionList = [...prev];
                newPositionList[index] = status.positionMillis; // Mise à jour de la position sans "rattraper" le temps perdu
                return newPositionList;
            });

            setAudioDurationList(prev => {
                const newDurationList = [...prev];
                newDurationList[index] = status.durationMillis;
                return newDurationList;
            });
        }
    };

    const resetColors = () => {
        const defaultColors = ['#E0EAF4', '#A6CBE3', '#FDE2E4'];
        setCustomColors(defaultColors);
        saveColorsToStorage(defaultColors); // Sauvegarde les couleurs par défaut dans le storage
        setSelectedColorIndex(null); // Réinitialise la sélection
    };



    // Met à jour la position de l'audio lorsque l'utilisateur déplace le slider
    const handleSliderValueChange = async (value, index) => {
        const newPosition = value;
        await soundRefList.current[index].setPositionAsync(newPosition);
        setPlaybackPositionList(prev => {
            const newPositionList = [...prev];
            newPositionList[index] = newPosition;
            return newPositionList;
        });
    };
    const formatTime = (timeMillis) => {
        if (typeof timeMillis !== 'number' || isNaN(timeMillis)) {
            return '00:00'; // Retourne un format valide si le temps est invalide
        }
        const minutes = Math.floor(timeMillis / 60000);
        const seconds = Math.floor((timeMillis % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            isPlayingList.forEach((isPlaying, index) => {
                if (isPlaying) {
                    updateAudioProgress(index); // Met à jour la progression sans "rattraper" le temps perdu
                }
            });
        }, 100); // Mettez à jour toutes les 100ms pour un défilement fluide.

        return () => clearInterval(interval); // Nettoyage de l'intervalle
    }, [isPlayingList]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={customColors}
                style={styles.background}
            >
                <View>
                    <Text style={styles.title}>{t('invocationsMatin')}</Text>
                    <Text style={styles.subTitle}>أَذْكَارُ ٱلصَّبَاحِ</Text>
                </View>

                {/* Ronds de sélection de couleurs */}
                <View style={styles.colorSelectorContainer}>
                    {customColors.map((color, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.colorCircle, { backgroundColor: color }]}
                            onPress={() => setSelectedColorIndex(index)}
                        />
                    ))}
                </View>

                {/* Palette de couleurs */}
                {selectedColorIndex !== null && (
                    <View style={styles.colorPickerContainer}>
                        <TouchableOpacity onPress={resetColors}>
                            <Text style={styles.resetColorsText}>{t('réinitialiserLesCouleurs')}</Text>
                        </TouchableOpacity>

                        <ColorWheel
                            color={customColors[selectedColorIndex]} // Couleur actuelle sélectionnée
                            onColorChange={(color) => handleColorChange(color, selectedColorIndex)} // Lorsque la couleur change
                            style={styles.colorWheel}
                        />
                        <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 10 }} onPress={() => setSelectedColorIndex(null)}>
                            <Text style={styles.closePickerText}>{t('valider')}</Text>
                        </TouchableOpacity>

                    </View>
                )}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                    {adhkars.map((adhkar, index) => (
                        <View key={index} style={styles.adhkarContainer}>
                            {(adhkar.howMuchTime || adhkar.howMuchManyTime) && (
                                <Text style={styles.howMuchTimeText}>
                                    ({adhkar.howMuchTime || adhkar.howMuchManyTime}
                                    {adhkar.howMuchTime ? " " + t('fois') : ""})
                                </Text>
                            )}
                            {adhkar.week && (
                                <Text style={styles.howMuchTimeText}>{t('divergenceExiste')}</Text>
                            )}
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.cardContent} nestedScrollEnabled={true}>
                                {!showRewards[index] ? (
                                    <>
                                        <Text style={styles.adhkarArab}>{adhkar.adkharArab}</Text>
                                        <View style={styles.divider} />
                                        <Text style={styles.texteInsideCardTitle}>{t('traductionSens')}</Text>
                                        <Text style={styles.frenchTraduction}>{adhkar.frenchTraduction}</Text>
                                        <View style={styles.divider} />
                                        <Text style={styles.texteInsideCardTitle}>{t('phonétique')}</Text>
                                        <Text style={styles.frenchTraduction}>{adhkar.phonetique}</Text>
                                    </>
                                ) : (
                                    <>
                                        {adhkar.reward ? (
                                            <Text style={styles.rewardText}>{adhkar.reward}</Text>
                                        ) : (
                                            <Text style={styles.rewardText}>{adhkar.source}</Text>
                                        )}
                                    </>
                                )}
                            </ScrollView>

                            {/* Section inférieure */}
                            <View style={styles.bottomContainer}>
                                {/* Bouton "Pourquoi/Source" */}
                                <TouchableOpacity style={styles.RewardBtn} onPress={() => handleToggleReward(index)}>
                                    <Text style={styles.RewardBtnText}>
                                        {showRewards[index] ? t('revenir') + " -" : adhkar.reward ? t('pourquoi') + " +" : t('source') + " +"}
                                    </Text>
                                </TouchableOpacity>

                                {/* Compteur */}
                                {(adhkar.howMuchTime || adhkar.howMuchManyTime) && (
                                    <View style={styles.counter}>
                                        <TouchableOpacity onPress={() => handleDecrement(index)} style={styles.counterButton}>
                                            <Text style={styles.counterButtonText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={[styles.counterValue, { width: 40, textAlign: 'center' }]}>
                                            {counters[index] || 0}
                                        </Text>
                                        <TouchableOpacity onPress={() => handleIncrement(index)} style={styles.counterButton}>
                                            <Text style={styles.counterButtonText}>+</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleReset(index)} style={styles.resetButton}>
                                            <Text style={styles.resetButtonText}>{t('Réinitialiser')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {/* Section audio */}
                            {adhkar.audio && (
                                <View style={styles.audioContainer}>
                                    <View style={styles.audioControls}>
                                        {/* Play/Pause Button */}
                                        <TouchableOpacity
                                            style={styles.playPauseButton}
                                            onPress={() => toggleAudio(adhkar.audio, index)}
                                        >
                                            <Ionicons
                                                name={isPlayingList[index] ? 'pause-circle' : 'play-circle'}
                                                size={40}  // Vous pouvez ajuster la taille selon vos préférences
                                                color="white"  // Vous pouvez définir la couleur en fonction de votre design
                                            />
                                        </TouchableOpacity>


                                        {/* Slider & Time Remaining */}
                                        <View style={styles.sliderWrapper}>
                                            <Slider
                                                style={styles.audioSlider}
                                                minimumValue={0}
                                                maximumValue={audioDurationList[index] || 1}
                                                value={playbackPositionList[index] || 0}
                                                onValueChange={(value) => handleSliderValueChange(value, index)}
                                                onSlidingComplete={(value) => handleSliderValueChange(value, index)}
                                                thumbTintColor="#FFFFFF"
                                                minimumTrackTintColor="#007bff"
                                                maximumTrackTintColor="white"
                                            />
                                            <Text style={styles.audioTimeRemaining}>
                                                {formatTime(audioDurationList[index] - (playbackPositionList[index] || 0))}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}

                </ScrollView>
                <BannerAd
                    unitId={TestIds.BANNER}
                    size={BannerAdSize.BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                    style={styles.banner}
                />
            </LinearGradient>
        </SafeAreaView>
    )
};




// Obtenez la hauteur de l'écran
const screenHeight = Dimensions.get('window').height;

// Modifiez la hauteur de chaque carte à la moitié de l'écran
const cardHeight = screenHeight / 1.7;
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "black"
    },
    banner: {
        position: 'absolute', // Bannière en position absolue
        bottom: 20,  // Fixée en bas de l'écran
        left: 0,
        right: 0,
        zIndex: 1, // La bannière doit être au-dessus du contenu
        backgroundColor: 'transparent', // Aucune couleur de fond pour la bannière, elle doit être transparente
    },
    colorWheel: {
        width: 300,
        height: 300,
    },
    rewardText: {
        marginTop: 20,
        fontFamily: "SpaceMono"
    },
    colorSelectorContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: 'white',
    },
    colorPickerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 320, // Largeur fixe pour le conteneur
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        zIndex: 1000,
        transform: [
            { translateX: -130 }, // Déplace horizontalement de la moitié de la largeur
            { translateY: -130 }, // Déplace verticalement de la moitié de la hauteur
        ],
        shadowColor: '#000', // Optionnel, pour un effet de profondeur
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Pour Android,
        justifyContent: "center",
        alignItems: "center"
    },
    resetColorsText: {
        fontSize: 16,
        color: '#007bff',  // Couleur bleue pour le bouton "Réinitialiser"
        marginTop: 10,
        fontWeight: 'bold',  // Pour rendre le texte plus visible
        textAlign: 'center',
        textTransform: "uppercase"
    },
    closePickerText: { textTransform: "uppercase", textAlign: "right", marginTop: 10, fontSize: 16, color: '#008000', fontWeight: "bold" },
    background: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: 'Arabolic',
        marginTop: 20,
        fontSize: 25,
        textTransform: "uppercase",
        color: "#627A92",
        textAlign: "center",
    },
    subTitle: {
        fontFamily: 'Arabolic',
        marginTop: 5,
        fontSize: 23,
        color: "#627A92",
        textAlign: "center",
    },
    scrollContainer: {
        paddingVertical: 20,
    },
    adhkarContainer: {
        backgroundColor: '#ffffff40', // Couleur de fond translucide
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        width: '100%',
        height: cardHeight,
        overflow: 'hidden', // Masquer le débordement du contenu
        elevation: 5, // Android
        shadowColor: '#000', // iOS
        shadowOffset: { width: 0, height: 4 }, // iOS
        shadowOpacity: 0.1, // iOS
        shadowRadius: 4, // iOS
    },
    adhkarNumber: {
        fontSize: 20,
        color: '#627A92',
        fontWeight: 'bold',
    },
    adhkarArab: {
        fontSize: 25,
        color: '#0F7AAF',
        fontFamily: 'Arabolic', // Assurez-vous d'avoir cette police installée
        textAlign: 'right',
        marginVertical: 15,

    },
    frenchTraduction: {
        fontSize: 16,
        color: '#627A92',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        paddingHorizontal: 10,
    },
    RewardBtn: {
        flex: 1, // Prend la place disponible à gauche
        alignItems: "flex-start",
    },

    RewardBtnText: {
        color: "#627A92",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 14,
    },
    divider: {
        height: 0.5,             // Hauteur du diviseur
        backgroundColor: '#0F7AAF', // Couleur du diviseur (gris clair)
        marginVertical: 15,    // Espacement avant et après le diviseur
    },
    texteInsideCardTitle: {
        textAlign: "center",
        fontFamily: "SpaceMono",
        textTransform: "uppercase",
        marginBottom: 10
    },
    howMuchTimeText: {
        textAlign: "center",
        marginTop: 5,
        fontStyle: 'italic',
        color: '#627A92',
        fontWeight: 'bold',
    },
    counterContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    counter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    counterButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#007bff",
        borderRadius: 5,
        marginHorizontal: 5,
    },
    counterButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    counterValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    resetButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#676767",
        borderRadius: 5,
        marginLeft: 10,
    },
    resetButtonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 14,
    }, playPauseButton: {
        padding: 0,
        backgroundColor: '#007bff',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPauseText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    audioControls: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    sliderWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        justifyContent: 'center',
    },
    audioSlider: {
        flex: 1,
        height: 40,
    },
    audioTimeRemaining: {
        color: 'black',
        fontSize: 14,
        fontWeight: "bold",
        width: 50,  // Fixe la largeur du texte pour qu'il ne change pas de taille
        textAlign: 'right',  // Vous pouvez ajuster l'alignement selon vos préférences
    }
});

export default AdhkarSabah;
