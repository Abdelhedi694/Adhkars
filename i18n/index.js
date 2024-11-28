
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en.json";
import translationFr from "./locales/fr.json";

const resources = {
  "en-US": { translation: translationEn },
  "fr-FR": { translation: translationFr },
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem("language");
    console.log('Saved language:', savedLanguage); // Ajoutez ceci pour voir la langue récupérée
  
    if (!savedLanguage) {
      savedLanguage = Localization.locale;
    }
  
    console.log('Using language:', savedLanguage); // Affiche la langue utilisée
  
    i18n.use(initReactI18next).init({
      compatibilityJSON: "v3",
      resources,
      lng: savedLanguage,
      fallbackLng: "en-US",  // fallback si la langue sauvegardée est incorrecte
      interpolation: {
        escapeValue: false,
      },
    });
  };
  

initI18n();

export default i18n;