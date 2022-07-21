import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function App() {
  const [benziny, setBenziny] = useState(null);

  // After loading the app, we want to download the dataset (and store it in `benziny`).
  useEffect(() => {
    fetch('https://api.apify.com/v2/datasets/KLHGYP6iynI82JxhC/items?clean=true&format=json')
      .then((dataset) => dataset.json())
      .then(setBenziny);
  });

  return (
    <View style={styles.container}>
      {
        (benziny ?? [])
          .slice(0,10)        // we take first 10
          .map((benzina) => ( // and render them like this...
            <div>
              <span>{benzina.company}</span>
            </div>
          ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
