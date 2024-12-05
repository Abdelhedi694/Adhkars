import { StyleSheet, View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const Divider = () => <View style={styles.divider} />;
export default function TabTwoScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.centerContainer}>
        <Text style={styles.mainTitle}>{t('pourquoiFaireCeci')}</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
          nestedScrollEnabled={true}
        >
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Text style={{ color: 'white', fontStyle: "italic", marginBottom: 10 }}>{t('sourate76V25')}</Text>
            <Text style={{ letterSpacing: 1, color: 'white', fontWeight: "bold", fontFamily: "Roboto-regularSpaceMono" }}>
              {t('etInvoque')}
            </Text>

          </View>
          <Divider />
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Text style={{ color: 'white', fontStyle: "italic", marginBottom: 10 }}>{t('anasRapporte')}</Text>
            <Text style={{ letterSpacing: 1, color: 'white', fontWeight: "bold", fontFamily: "Roboto-regularSpaceMono" }}>
              {t('meJoindre')}
            </Text>
            <Text style={{ marginTop: 5, color: 'white', fontStyle: "italic", marginBottom: 10 }}>{t('rapporteAbouDaoud698')}</Text>

          </View>
          <Divider />
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Text style={{ color: 'white', fontStyle: "italic", marginBottom: 10 }}>{t('nabiADit')}</Text>
            <Text style={{ letterSpacing: 1, color: 'white', fontWeight: "bold", fontFamily: "Roboto-regularSpaceMono" }}>
              {t('aimeriezVous')}
            </Text>
            <Text style={{ marginTop: 5, color: 'white', fontStyle: "italic", marginBottom: 10 }}>At-Tirmidhi.</Text>

          </View>
          <Divider />
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Text style={{ color: 'white', fontStyle: "italic", marginBottom: 10 }}>{t('ibnQayimMisericorde')}</Text>
            <Text style={{ letterSpacing: 1, color: 'white', fontWeight: "bold", fontFamily: "Roboto-regularSpaceMono" }}>
              {t('bouclier')}
            </Text>
            <Text style={{ marginTop: 5, color: 'white', fontStyle: "italic", marginBottom: 10 }}>Al wabil essayb p71.</Text>
          </View>
          <Divider />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1f2125",
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center', // Centre verticalement
    alignItems: 'center', // Centre horizontalement
  },
  scrollContentContainer: {
    justifyContent: 'center', // Centre le contenu verticalement dans le ScrollView
    alignItems: 'center', // Centre le contenu horizontalement
    padding: 20, // Ajout d'un espace intérieur optionnel
  },
  mainTitle: {
    fontFamily: 'Arabolic',
    marginBottom: 20,
    fontSize: 25,
    textTransform: "uppercase",
    color: "#ffe45e",
    textAlign: "center",
    textShadowColor: 'rgba(255, 255, 255, 0.7)',  // Couleur de l'ombre (blanc avec transparence)
    textShadowOffset: { width: 0.5, height: 0.5 },    // Décalage de l'ombre
    textShadowRadius: 5,
  },
  divider: {
    height: 1, // Épaisseur du diviseur
    backgroundColor: '#ffe45e', // Couleur du diviseur
    opacity: 0.5, // Légère transparence
    width: '100%', // S'étend sur toute la largeur
    marginVertical: 10, // Espacement autour du diviseur
  },
});
