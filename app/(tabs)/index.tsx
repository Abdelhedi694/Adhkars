import Cards from '@/components/Cards';
import { StyleSheet, Text,View} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
      <Cards/>
      </GestureHandlerRootView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center"
  }
});
