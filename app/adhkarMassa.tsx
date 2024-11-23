import { SafeAreaView, Text, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av'; // Importation d'Expo Audio
import Slider  from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons';


const adhkarMassa = () => {
    const adhkars = [
        {
            number: 1,
            adkharArab: "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَ مَا خَلْفَهُمْ وَ لاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَ الأَرْضَ وَ لاَ يَئُودُهُ حِفْظُهُمَا وَ هُوَ العَلَيُّ العَظِيمُ",
            frenchTraduction: "« Allah ! Point de divinité à part Lui, le Vivant, Celui qui n’a besoin de rien et dont toute chose dépend « al-Qayyûm ». Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la Terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et, de Sa science, ils n’embrassent que ce qu’Il veut. Son Kursî (Piédestal) déborde les cieux et la Terre et leur garde ne Lui coûte aucune peine. Et Il est le Très Haut, l’Immense. »",
            reward: `* Quiconque prononce ces mots en se réveillant se verra protégé des djinns jusqu’au soir. Et quiconque prononce ces mots en allant se coucher se verra protégé des djinns jusqu’au matin.
            
            Rapporté par Al Hakim 665.`,
            phonetique: `« Allahou la ilaha illa houwa alhayyou alqayyoum la ta/khoudhouhou sinatoun wala nawm lahou ma fi ssamawati wama fi l-ard man dha alladhi yachfa'ou 'indahou illa bi-idhnih ya'lamou ma bayna aydihim wama khalfahoum wala youhitouna bichay-in min 'ilmihi illa bima cha-a wasi'a koursiyyouhou ssamawati waal-arda wala yaoudouhou hifdhouhouma wahouwa al'aliyyou al'adhim. »`,
            audio: require('../assets/audios/ayatKursi.mp3')
        },
        {
            number: 2,
            adkharArab: `بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ

قُلْ هُوَ اللهُ أَحَدٌ❀ اللهُ الصَّمَدُ❀ لَمْ يَلِدْ وَلَمْ يُولَدْ❀ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ
            
سُورَةُ الإِخْلاَصِ`,
            frenchTraduction: `Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux

            « Dis :  Il est Allah, Unique ❀ Allah Le Seul à être imploré pour ce que nous désirons ❀ Il n’a jamais engendré et n’a pas été engendré non plus ❀ Et nul n’est égal à Lui. »`,
            reward: `* Quiconque les récite trois fois en se réveillant et en se couchant y trouvera une protection suffisante contre toute chose.
            
            Rapporté par Abu Dawud 1523 et An Nasâ’i
            3/68.`,
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
            frenchTraduction: `Au Nom d’Allah le Tout Miséricordieux le Très Miséricordieux 
            
            « Dis : Je cherche protection auprès du Seigneur de l’aube naissante ❀ contre le mal des êtres qu’Il a créés ❀ contre le mal de l’obscurité quand elle s’approfondit ❀ contre le mal de celles qui soufflent sur les nœuds ❀ et contre le mal de l’envieux quand il envie. »
            `,
            reward: `* Quiconque les récite trois fois en se réveillant et en se couchant y trouvera une protection suffisante contre toute chose.
            
            Rapporté par Abu Dawud 1523 et An Nasâ’i
            3/68.`,
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
            frenchTraduction: `Au Nom d’Allah le Tout Miséricordieux le Très Miséricordieux 
            
            « Dis : Je cherche protection auprès du Seigneur des hommes ❀ le Souverain des hommes ❀ Dieu des hommes ❀ contre le mal du mauvais conseiller furtif ❀ qui souffle le mal dans les poitrines des hommes ❀ qu’il soit djinn ou être humain. »
            `,
            reward: `* Quiconque les récite trois fois en se réveillant et en se couchant y trouvera une protection suffisante contre toute chose.
            
            Rapporté par Abu Dawud 1523 et An Nasâ’i
            3/68.`,
            phonetique: "Qul 'A`ūdhu Birabbi An-Nāsi ❀ Maliki An-Nāsi ❀ 'Ilahi An-Nāsi ❀ Min Sharri Al-Waswāsi Al-Khannāsi ❀ Al-Ladhī Yuwaswisu Fī Şudūri An-Nāsi ❀ Mina Al-Jinnati Wa An-Nāsi",
            howMuchTime: 3,
            audio: require('../assets/audios/sourateNas.mp3')
        },
        {
            number: 5,
            adkharArab: `أَمْسَيْنَا وَ أَمْسَى المُلْكُ للهِ وَ الحَمْدُ للهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيلَةِ وَ خَيرَ مَا بَعْدَهَا، وَ أَعُوذُ بِكَ مِنْ شَرِّ مَا هَذِهِ اللَّيلَةِ وَ شَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الكَسَلِ وَ سُوءِ الكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَ عَذَابٍ فِي القَبْرِ`,
            frenchTraduction: `Nous voilà au soir et le règne appartient à Allah. Louange à Allah, Il n’y a aucune divinité [digne d’être adorée] en dehors d’Allah, Seul, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose. Seigneur ! Je Te demande le bien que contient cette nuit et le bien qui vient après. Et je cherche refuge auprès de Toi contre le mal que contient cette nuit et le mal qui vient après. Seigneur ! Je cherche refuge auprès de Toi contre la paresse et les maux de la vieillesse. Je cherche refuge auprès de Toi contre le châtiment de l’Enfer et contre les tourments de la tombe.`,
            source: `Rapporté par Muslim 2723.`,
            phonetique: "Amsaynâ wa amsa-l-mulku li-llâhi wa-l-hamduli-llâh. Lâ ilâha illâ llâhu wahdahu lâ sharîka lah, lahu-l-mulku wa lahu-l-hamd, wa huwa ‘alâ kulli shayin Qadîr. Rabbi, asaluka khayra mâ fî hâdhihi-l-laylah, wa khayra mâ ba’dahâ. Wa a’ûdhu bika min sharri mâ fî hâdihia-l-laylah wa sharri mâ ba’dahâ. Rabbi a’ûdhu bika min al-kasali wa sûi-l-kibar. Rabbi a’ûdhu bika min ‘adhâbin fi-n-nâri wa ‘adhâbin fi-l-qabr.",
            audio: require('../assets/audios/vieillessPauvrete.mp3')
            
        },
        {
            number: 6,
            adkharArab: `اللّهُـمَّ بِكَ أَمْسَـينا، وَبِكَ أَصْـبَحْنا، وَبِكَ نَحْـيا، وَبِكَ نَمـوتُ وَإِلَـيْكَ المَصـير`,
            frenchTraduction: `Ô Seigneur ! C’est de Toi que dépendent notre sommeil et notre réveil, notre vie et notre mort. Et c’est vers Toi que nous serons ressuscités.`,
            source: "Rapporté par At Tirmidhi 3391.",
            phonetique: "Allâhumma bika amsaynâ, wa bika, asbahnâ, wa bika nahyâ, wa bika namût, wa ilayka-l-masîr.",
            audio: require('../assets/audios/bykaNaMout.mp3')
            
        },
        {
            number: 7,
            adkharArab: `اللّهـمَّ أَنْتَ رَبِّـي لا إلهَ إلاّ أَنْتَ ، خَلَقْتَنـي وَأَنا عَبْـدُك ، وَأَنا عَلـى عَهْـدِكَ وَوَعْـدِكَ ما اسْتَـطَعْـت ، أَعـوذُبِكَ مِنْ شَـرِّ ما صَنَـعْت ، أَبـوءُ لَـكَ بِنِعْـمَتِـكَ عَلَـيَّ وَأَبـوءُ بِذَنْـبي فَاغْفـِرْ لي فَإِنَّـهُ لا يَغْـفِرُ الذُّنـوبَ إِلاّ أَنْتَ`,
            frenchTraduction: `Ô Seigneur ! Tu es, Toi, mon Maître et Toi Seul mérites l’adoration ! C’est Toi qui m’as créé et je suis Ton serviteur. Je me soumets à l’engagement que j’ai pris envers Toi et à Ta promesse dans la mesure de mes capacités. Je me réfugié auprès de Toi contre le mal de mes actes. Je reconnais pleinement le bienfait dont Tu m’as comblé et je reconnais mon péché. Accorde-moi donc Ton pardon car Il n’est personne qui pardonne les fautes en dehors de Toi. `,
            reward: `* Quiconque prononce ces mots avec certitude en se couchant et meurt lors de cette nuit, entrera au Paradis. Et il en est de même pour celui qui les prononce en se réveillant.
            
            Rapporté par Al Bukhari 6306.`,
            phonetique: "Allâhumma anta Rabbî, lâ ilâha illâ ant. Khalaqtanî wa ana ‘abduk, wa ana ‘alâ ‘ahdika wa wa’dika mâ stata’t. A’ûdhu bika min sharri mâ sana’t. Abûu laka bi-ni’matika ‘alayya wa abûu bi-dhanbî fa-ghfir lî, fa-innahu lâ yaghfiru-dh-dhunûba illâ ant.",
            audio: require('../assets/audios/persPardonnePecherSaufToi.mp3')
            
        },
        {
            number: 8,
            adkharArab: `اللّهُـمَّ إِنِّـي أَمْسَيْتُ أَُشْـهِدُك ، وَأُشْـهِدُ حَمَلَـةَ عَـرْشِـك ، وَمَلائِكَتِك ، وَجَمـيعَ خَلْـقِك ، أَنَّـكَ أَنْـتَ اللهُ لا إلهَ إلاّ أَنْـتَ وَحْـدَكَ لا شَريكَ لَـك ، وَأَنَّ مُحَمّـداً عَبْـدُكَ وَرَسـولُـك`,
            frenchTraduction: ` Ô Seigneur ! Me voici au soir, je Te prends à témoin et je prends à témoins les porteurs de Ton Trône ainsi que Tes anges et toutes tes créatures, que c’est Toi Allah, il n’y a de divinité que Toi, Tu es Seul et sans associé, et que Muhammad est Ton esclave et Ton messager.`,
            reward: `* Quiconque prononce cette formule à quatre reprises en se réveillant ou en allant se coucher verra Allah l’affranchir de l’enfer.
            
            Rapporté par Abu Dawud 5069 – Al Bukhari 1201 – An Nasâ’i 9  et Ibn As Sunni 70.`,
            howMuchTime: 4,
            week: true,
            phonetique: "Allâhoumma innî amsaytou oush-hidouka, wa oush-hidou hamalata ‘arshika, wa malâ ikataka, wa jamî’a khalqika, annaka anta l-lâhou, lâ ilâha illâ anta, wahdaka lâ sharîka laka, wa anna mouhammadan ‘abdouka wa rasoûlouk.",
            audio: require('../assets/audios/4reprises.mp3')
        },
        {
            number: 9,
            adkharArab: `اللّهُـمَّ ما أمْسَى بِي مِنْ نِعْمَةٍ، أوْ بِأحَدٍ مِنْ خَلقِكَ، فَمِنْكَ وَحْدَكَ لا
شَرِيْكَ لَكَ، فَلَكَ الحَمْدُ ولَكَ الشُّكْرُ`,
            frenchTraduction: `Ô Seigneur ! Tout ce qui m’arrive comme bienfaits en cette soirée, à moi ou à l’une de Tes créatures, provient de Toi Seul, sans associé. A Toi la louange ainsi que la gratitude.`,
            
            source: `Rapporté par Dawud 5073 – An Nasâ’i 7 – Ibn As Sunni 41 – Ibn Hiban 2361.`,
            phonetique: "Allâhoumma mâ amsa bî min ni’matin aw bi-ahadin min khalqika, fa-minka wahdaka lâ sharîka laka. Fa-laka-l-hamdou wa laka sh-shoukr.",
            audio: require('../assets/audios/toutBienfaitsParvient.mp3')
        },
        {
            number: 10,
            adkharArab: `اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إلَهَ إلاَّ أنْتَ، اللَّهُمَّ إنِّي أَعُوذُ بِكَ مِنَ الكُفْرِ وَالفَقْرِ، وأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لا إلَهَ إلاَّ
أنْتَ`,
            frenchTraduction: `Ô Seigneur ! Maintiens-moi en bonne santé. Ô Seigneur ! Préserve la santé de mon ouïe. Ô Seigneur ! Préserve la santé de ma vue. Ô Seigneur ! Je me réfugie auprès de Toi contre la mécréance et la pauvreté, et je me réfugie auprès de Toi contre les supplices de la tombe. Nulle divinité n’est digne d’être adorée en dehors de Toi.`,
            
            source: `Rapporté par Abu Dawud 5090 – Ahmad 20430 – An Nasâ’i 22.`,
            week: true,
            howMuchTime: 3,
            phonetique: "Allâhoumma ‘âfinî fî badanî. Allâhoumma ‘âfinî fî sam’î. Allâhoumma ‘âfinî fî basarî. Lâ ilâha illâ anta. Allâhoumma innî a’oûdhou bika mina-l-koufri, wa-l-faqri. Wa a’oûdhou bika min ‘adhâbi-l-qabri. Lâ ilâha illâ ant.",
            audio: require('../assets/audios/3reprisesafini.mp3')
        },
        {
            number: 10,
            adkharArab: `حَسْبِيَ اللهُ لاَ إلَهَ إلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ العَرْشِ العَظِيمِ`,
            frenchTraduction: `Allah me suffit, il n’y a de divinité que Lui, c’est en Lui que je place ma confiance et Il est le Seigneur du Trône immense.`,
            
            reward: `* Quiconque prononce ces paroles à sept reprises le matin et le soir verra Allah l’épargner de tous les soucis qui le préoccuperont, tant sur cette terre que dans l’au-delà.
            
            Rapporté par Abou Daoud dans ses Sounan n°5081 et authentifié par Cheikh Ibn Baz dans Majou' Al Fatawa vol 26 p 65, par Cheikh Al 'Abad dans Charh Sounan Abi Daoud cours n°577 ainsi que par Cheikh Salim Al Hilali dans Sahih Al Adhkar Nawawiya p 83.`,
            week: true,
            howMuchTime: 7,
            phonetique: "Hasbiya Allahou La Ilaha Illa Houwa 'Alayhi Tawakaltou Wa Houwa Raboul 'Archil 'Adhim.",
            audio: require('../assets/audios/7fois.mp3')
        },
        {
            number: 11,
            adkharArab: `اللهُمَّ إنِّي أسْألُكَ العَفْوَ والعَافيةَ في الدُّنْيَا والآخِرَةِ، اللهُمَّ إنِّي أسْألُكَ العَفْوَ والعَافيةَ في دِيْني ودُنْيَاي، وأهْلِي، ومَالي، اللهُمَّ اسْتُرْ عَوْرَاتي، وآمِنْ رَوْعَاتي، اللهُمَّ احْفَظْني مِنْ بيْنِ يَدَيَّ، ومِنْ خَلْفِي، وعَنْ يَميني، وعَنْ شِمَالي، ومِنْ فَوْقِي، وأعُوذُ بِعَظَمَتكَ أنْ أُغْتالَ مِنْ تَحْتي`,
            frenchTraduction: `Ô Seigneur ! Je T’implore de m’accorder Ton pardon et Ta protection dans cette vie et dans l’au-delà. Ô Seigneur ! Je T’implore de m’accorder Ton pardon et Ta protection dans ma religion, ma vie, ma famille et mes biens. Ô Seigneur ! Couvre mes défauts et rassure-moi quant aux peurs qui me tiraillent. Ô Seigneur ! Préserve-moi de tout ce qui pourrait survenir de devant ou derrière moi, à ma droite, à ma gauche ou au-dessus de moi, et je me réfugie auprès de Ta toute grandeur contre une mort qui surgirait d’en-dessous de moi.`,
            
            reward: `* Le Messager d'Allah (ﷺ) n'omettait jamais de faire ces invocations le matin et le soir.
            
            Rapporté par Abu Dawud 5074 – Ibn Maja 3871.`,
            phonetique: "Allahumma Inni As'aluka l-'Afwa wal-'Âfiyata Fî-d-Dunyâ wa-l-Âkhira, Allahumma Inni As'aluka l-'Afwa wa-l-'Âfiyata Fî Dînî wa Dunyâya wa Ahlî wa Mâlî, Allahumma Ustur 'Awrâtî wa Âmin Raw'âtî, Allahumma Ihfadhnî Min Bayni Yadayya wa Min Khalfî wa 'An Yamînî, wa 'An Chimâlî, wa Min Fawqî, wa A'ûdhu Bi'Adhamatika An Ughtala Min Tahtî.",
            audio: require('../assets/audios/èfwaWa3afiyata.mp3')
        },
        {
            number: 12,
            adkharArab: `اللَّهُمَّ عَالِمَ الغَيْبِ والشَّهَادَةِ، فَاطِرَ السَّموَاتِ والأرْضِ، رَبَّ كُلِّ شَيءٍ ومَلِيْكَهُ، أشْهَدُ أنْ لا إلَهَ إلاَّ أنْتَ، أعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وأنْ أقْتَرِفَ عَلَى نَفْسِي سُوءاً، أوْ أجُرَّهُ إلَى مُسْلِمٍ`,
            frenchTraduction: `Ô Seigneur ! Toi qui connais parfaitement l’invisible et le visible ! Créateur des cieux et de la terre ! Maître et Possesseur de toute chose ! J’atteste qu’il n’est d’autre divinité méritant l’adoration en dehors de Toi. Je me réfugie auprès de Toi contre le mal de mon âme, contre celui du diable et de son incitation à T’attribuer un associé. (Et je me réfugié auprès de Toi) contre tout méfait que je pourrais perpétrer envers moi-même ou envers autrui.`,
            
            source: `At Tirmidhi 3392 – Abu Dawud 5067.`,
            phonetique: "Allâhoumma 'âlim-alghaybi wa sh-shahâdati, fâtira s-samâwâti wa-l ardi, rabba koulli shay in wa malîkahou. Ash-hadou anlâ ilâha illâ anta. A'oûdhou bika min sharrin nafsî, wa min sharri sh-shaytâni wa 'hirkihi, wa an aqtarifa 'alâ nafsî soû an ajourrahou ilâ Mouslim.",
            audio: require('../assets/audios/visibleInvisible.mp3')
        },
        {
            number: 13,
            adkharArab: `بِسْمِ اللهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيءٌ في الأرْضِ وَلَا فِي السَّمَاءِ وهُوَ السَّمِيعُ العَلِيْمُ`,
            frenchTraduction: `Au Nom d’Allah dont la mention empêche toute chose de nuire, tant sur la terre que dans le ciel, et Il est l’Audient et l’Omniscient.`,
            
            reward: `D'après 'Othman Ibn 'Affan (qu'Allah l'agrée), le Prophète (que la prière d'Allah et Son salut soient sur lui) a dit: « Il n'y a pas un serviteur qui dit trois fois au début de chaque journée et au début de chaque nuit : - Au nom d'Allah, Celui avec le Nom duquel rien n'est nuisible que ce soit sur la Terre ou dans les cieux et Il est Celui qui entend, Le Connaisseur - qui sera touché par une chose qui lui soit nuisible. »
            
            Rapporté par Tirmidhi et authentifié par Cheikh Albani dans Sahih Al Jami n°3388`,
            howMuchTime: 3,
            phonetique: "Bismilllah Alladhi La Yadourrou Ma'a Smihi Chay oun Fil Ardi Wa La Fis Sama Wa Houwas Sami'oul 'Alim.",
            audio: require('../assets/audios/lèYaDurru3fois.mp3')
        },
        {
            number: 14,
            adkharArab: `رَضِيْتُ بِاللهِ رَبًّا، وبالإسْلامِ دِيْناً، وبِمُحَمَّدٍ نَبيًّا`,
            frenchTraduction: `Je reconnais Allah en tant que Seigneur, l’Islam en tant que religion et Muhammad en tant que Prophète.`,
            
            reward: `D'après Mounaydhir (qu'Allah l'agrée), le Prophète (que la prière d'Allah et Son salut soient sur lui) a dit « Celui qui dit le matin (*): Je suis satisfait d'Allah comme Seigneur, de l'islam comme religion et de Mouhammad comme prophète (**), je lui garantis que je le prendrais par la main jusqu'à le faire entrer au paradis »
            
            Rapporté par Tabarani et authentifié par Cheikh Albani dans Silsila Sahiha n°2686`,
            phonetique: "Raditou Billahi Raban Wa Bil Islami Dinan Wa Bi Mohamedin Nabiyan.",
            audio: require('../assets/audios/attestation3fois.mp3')
        },
        {
            number: 15,
            adkharArab: `يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ`,
            frenchTraduction: `Ô Vivant ! Ô Toi qui es le Seul à être imploré pour ce que nous désirons ! C’est à Ta Miséricorde que j’en appelle. Améliore ma situation et ne me livre pas à moi-même, ne serait-ce qu’un seul instant.`,
            
            source: `Rapporté par Al Hakim 654.`,
            phonetique: "Yâ hayyû, yâ qayyûmou bi rahmatika astaghîth. Aslih lî sha nî koullahou wa lâ takilnî ilâ nafsî tarfata 'ayn.",
            audio: require('../assets/audios/yèHayyou.mp3')
        },
        {
            number: 16,
            adkharArab: `أَمْسَيْنَا وَ أَمْسَى المُلْكُ للهِ رَبِّ العَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيلَةِ، فَتْحَهَا، وَ نَصْرَهَا، وَ نُورَهَا وَ بَرَكَتَهَا، وَ هُدَاهَا، وَ أَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَ شَرِّ مَا بَعْدَهَا.` ,
            frenchTraduction: `Nous voilà au soir et le règne appartient à Allah, le Seigneur de l’univers. Ô Seigneur ! Je Te demande le bien de cette nuit : conquêtes, victoires, lumière, bénédiction et guidée. Je me mets sous Ta protection contre le mal de cette nuit et le mal qui vient après.`,
            
            source: `Rapporté par Abu Dawud 5084.`,
            week: true,
            phonetique: "Amsaynâ wa amsâ-l-mulku li-llâhi Rabbi-l-‘âlamîn. Allâhumma innî asaluka khayra hâdhihi-l-laylah : fathahâ, wa nasrahâ, wa nûrahâ, wa barakatahâ, wa hudâhâ. Wa a’ûdhu bika min sharri mâ fîhâ wa sharri mâ ba’dahâ.",
            
        },
        {
            number: 17,
            adkharArab: `أَمْسَيْنَا عَلَى فِطْرَةِ الإسْلامِ، وعَلَى كَلِمَةِ الإخْلاصِ، وعَلَى دِيْنِ نَبيِّنَا مُحَمَّدٍ – صلى الله عليه وسلم -، وعَلَى مِلَّةِ أبِينَا إبْرَاهيمَ، حَنيفاً مُسْلِماً ومَا كَانَ مِنَ المُشْرِكِينَ.`,
            frenchTraduction: `Nous voici au soir, et en nous se trouve la nature première qui est l’Islam, en nous, la parole du monothéisme ; nous sommes dans la religion de notre Prophète Muhammad (que la prière d'Allah et Son salut soient sur lui) et sur la voie de notre père Abraham qui vouait son culte exclusivement à Allah, soumis à Lui, et n’était point du nombre des associateurs.`,
            
            source: `Rapporté par Ahmad 15360 – Ibn Sunni 34.`,
            phonetique: "Amsayna 'ala fitrati-l-islami, wa 'ala kalimati-l-ikhlasi, wa 'ala dini nabiyyina Muhammadin, wa 'ala millati abina Ibrahima, hanifan, musliman, wa ma kana mina-l-mushrikin.",
            
        },
        {
            number: 19,
            adkharArab: `لا إلَهَ إلاَّ اللهُ وَحْدَهُ لا شَرِيْكَ لَهُ، لَهُ المُلْكُ، ولَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيءٍ قَديرٌ`,
            frenchTraduction: `Nulle divinité n’est digne d’être adorée en dehors d’Allah, Seul et sans associé. À lui appartiennent la Souveraineté absolue et la louange, et Il est Omnipotent.`,
            
            source: `Rapporté par An Nasâ’i 24.`,
            howMuchManyTime: "dix fois, ou une fois au moins lorsque l’on éprouve de la paresse",
            phonetique: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamdu, wa huwa ‘alâ kulli shayin Qadîr.",
            audio: require('../assets/audios/100foisattestationComplete.mp3')
        },
        {
            number: 24,
            adkharArab: `اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبيِّنَا مُحَمَّدٍ`,
            frenchTraduction: `Ô Seigneur ! Accorde Tes bénédictions et la paix à notre Prophète Muhammad.`,
            
            reward: `* Quiconque implore les bénédictions d’Allah en ma faveur dix fois au lever et dix fois en se couchant, verra mon intercession l’atteindre au Jour de la Résurrection
            
            Rapporté par At Tabarani 656.`,
            howMuchTime: 10,
            phonetique: "Allāhumma ṣalli wa sallim 'alā nabiyyinā Muḥammad.",
            
        },
        {
            number: 24,
            adkharArab: `أَعُوْذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ`,
            frenchTraduction: `Je me réfugie auprès des paroles parfaites d’Allah contre le mal de ce qu’Il a créé.`,
            
            reward: `*  Quiconque prononce ces mots à trois reprises ne se verra pas atteint par la fièvre cette nuit.
            
            Rapporté par Ahmad 7898 – An-Nassâ’i 590 – Ibn As Sunni 68.`,
            howMuchTime: 3,
            phonetique: "A’ûdhu bi-kalimati-llâhi-t-tâmmâti min sharri mâ khalaq.",
            audio: require('../assets/audios/kalimatilLah3fois.mp3')
        },
        {
            number: 25,
            adkharArab: `سُبْحَانَ اللَّهِ وَبِحَمْدِهِ`,
            frenchTraduction: `Je me réfugie auprès des paroles parfaites d’Allah contre le mal de ce qu’Il a créé.`,
            
            reward: `*  Nul ne pourrait présenter le Jour de la Résurrection une œuvre plus méritoire que le fait de prononcer ces mots cent fois le matin et le soir, si ce n’est celui qui les répéterait autant de fois ou davantage.
            
            Rapporté par Muslim 2723.`,
            howMuchTime: 100,
            phonetique: "Sobhanallah wa bihamdihi.",
            audio: require('../assets/audios/subhanAllahiWaBihamdih.mp3')
            
        },
    ]
    const [showRewards, setShowRewards] = useState([]);
    const [counters, setCounters] = useState([]);
    const [isPlayingList, setIsPlayingList] = useState([]);
const [playbackPositionList, setPlaybackPositionList] = useState([]); // Pour stocker la position de lecture
const soundRefList = useRef([]);
const [audioDurationList, setAudioDurationList] = useState([]);

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
                colors={['#1A1A2E', '#16213E', '#0F3460']}
                style={styles.background}
            >
                <View>
                    <Text style={styles.title}>Invocations du soir</Text>
                    <Text style={styles.subTitle}>أَذْكَارُ ٱلصَّبَاحِ</Text>
                </View>
    
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                    {adhkars.map((adhkar, index) => (
                        <View key={index} style={styles.adhkarContainer}>
                            {(adhkar.howMuchTime || adhkar.howMuchManyTime) && (
                                <Text style={styles.howMuchTimeText}>
                                    ({adhkar.howMuchTime || adhkar.howMuchManyTime}
                                    {adhkar.howMuchTime ? " fois" : ""})
                                </Text>
                            )}
                            {adhkar.week && (
                                <Text style={styles.howMuchTimeText}>Il existe une divergence concernant l’authenticité de ce hadith.</Text>
                            )}
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.cardContent} nestedScrollEnabled={true}>
                                {!showRewards[index] ? (
                                    <>
                                        <Text style={styles.adhkarArab}>{adhkar.adkharArab}</Text>
                                        <View style={styles.divider} />
                                        <Text style={styles.texteInsideCardTitle}>Traduction du sens</Text>
                                        <Text style={styles.frenchTraduction}>{adhkar.frenchTraduction}</Text>
                                        <View style={styles.divider} />
                                        <Text style={styles.texteInsideCardTitle}>Phonétique</Text>
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
                                        {showRewards[index] ? "Revenir -" : adhkar.reward ? "Pourquoi +" : "Source +"}
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
                                            <Text style={styles.resetButtonText}>Reset</Text>
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
                                                maximumTrackTintColor="#D3D3D3"
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
            </LinearGradient>
        </SafeAreaView>
    );
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
        color: "#fff",
        textAlign: "center",
      },
      subTitle: {
        fontFamily: 'Arabolic',
        marginTop: 5,
        fontSize: 23,
        color: "#fff",
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
        color: '#9FDFFB',
        fontFamily: 'Arabolic', // Assurez-vous d'avoir cette police installée
        textAlign: 'right',
        marginVertical: 15,

      },
      frenchTraduction: {
        fontSize: 16,
        color: '#fff',
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
        color: "#9FDFFB",
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
        marginBottom: 10,
        color: "#FBFCFA"
      },
      howMuchTimeText: {
        textAlign: "center",
        marginTop: 5,
        fontStyle: 'italic',
        color: '#fff',
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
        backgroundColor: "#FF6F61",
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
        color: "#FFF",
    },
    resetButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#FFA07A",
        borderRadius: 5,
        marginLeft: 10,
    },
    resetButtonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 14,
    },playPauseButton: {
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
        color: 'white',
        fontSize: 14,
        fontWeight : "bold",
        width: 50,  // Fixe la largeur du texte pour qu'il ne change pas de taille
        textAlign: 'right',  // Vous pouvez ajuster l'alignement selon vos préférences
    }
    });

export default adhkarMassa;
