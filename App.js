import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, Animated, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { DOMParser } from '@xmldom/xmldom';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

const BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api'
  : 'https://nextgameup-backend.onrender.com/api';

// Curated list of popular modern board game IDs
const POPULAR_GAME_IDS = [
  // Modern Classics (2015+)
  174430, // Gloomhaven
  291457, // Gloomhaven: Jaws of the Lion
  224517, // Brass: Birmingham
  266192, // Wingspan
  342942, // Ark Nova
  233078, // Pandemic Legacy: Season 1
  167791, // Terraforming Mars
  220308, // Spirit Island
  316554, // Dune: Imperium
  284083, // Nemesis
  237182, // Root
  205637, // Scythe
  
  // Classic Games with High Ratings
  822,    // Carcassonne
  13,     // Catan
  68448,  // 7 Wonders
  2651,   // Power Grid
  31260,  // Agricola
  70323,  // King of Tokyo
  84876,  // The Resistance: Avalon
  178900, // Codenames
  230802, // Azul
  173346, // 7 Wonders Duel
  182028, // Through the Ages: A New Story of Civilization
  148228, // Splendor
  185343, // Viticulture Essential Edition
  120677, // Terra Mystica
  146021, // Eldritch Horror
  209010, // Dead of Winter: A Crossroads Game
  9209,   // Ticket to Ride
  175914, // Food Chain Magnate
  192291, // Too Many Bones
  266507, // Paladins of the West Kingdom
  180263, // The Quacks of Quedlinburg
  285967, // Marvel Champions: The Card Game
  312484, // Lost Ruins of Arnak
  295486, // Paleo
  276025, // Maracaibo
  295947, // Bonfire
  284435, // The Search for Planet X
  295770, // Hallertau
  317985, // Beyond the Sun
  
  // Additional Modern Hits
  356779, // Frosthaven
  342857, // Sleeping Gods
  324856, // Cascadia
  285774, // Barrage
  291453, // Pax Pamir: Second Edition
  251247, // Barrage
  286096, // Tapestry
  292859, // Ankh: Gods of Egypt
  300531, // Dune: Imperium
  285967, // Marvel Champions: The Card Game
  286751, // Cartographers
  284108, // The Crew: The Quest for Planet Nine
  
  // Well-Rated Classics (Pre-2000)
  483,    // Diplomacy (1959)
  188,    // Go (2000+ years old)
  171,    // Chess (1475)
  463,    // Risk (1959)
  1406,   // Monopoly (1933)
  1219,   // Clue (1949)
  4324,   // Axis & Allies (1981)
  1111,   // Stratego (1947)
  10630,  // Twilight Struggle (2005)
  521,    // Acquire (1964)
  5,      // Scrabble (1948)
  
  // Euro Games & Worker Placement
  31627,  // Lords of Waterdeep
  36218,  // Dominion (2008)
  28720,  // Brass (2007)
  102794, // Caverna: The Cave Farmers
  150376, // Dead of Winter
  124361, // Concordia
  146508, // Legendary: A Marvel Deck Building Game
  126163, // Tzolk'in: The Mayan Calendar
  
  // Party & Social Games
  178900, // Codenames
  128882, // Coup
  155426, // Sheriff of Nottingham
  181304, // Secret Hitler
  198773, // Mysterium
  205059, // Deception: Murder in Hong Kong
  
  // Cooperative Games
  161936, // Pandemic Legacy: Season 0
  205637, // Scythe
  174430, // Gloomhaven
  291457, // Gloomhaven: Jaws of the Lion
  205059, // Deception: Murder in Hong Kong
  
  // Strategy Card Games
  129437, // Legendary Encounters: An Alien Deck Building Game
  163412, // Patchwork
  184267, // PARKS
  266192, // Wingspan
  169786, // Star Realms
  
  // Area Control & War Games
  187645, // Star Wars: Rebellion
  164153, // War of the Ring: Second Edition
  12333,  // Twilight Imperium: Third Edition
  167791, // Terraforming Mars
  3076,   // Puerto Rico
  
  // Dice Games
  40692,  // Small World
  147020, // Roll for the Galaxy
  154203, // Dice Forge
  244521, // The Castles of Burgundy
  
  // Adventure & Dungeon Crawl
  205059, // Deception: Murder in Hong Kong
  237182, // Root
  174430, // Gloomhaven
  291457  // Gloomhaven: Jaws of the Lion
];

// Add HTML entity decoder function
const decodeHTMLEntities = (text) => {
  if (!text) return '';
  
  // Create a temporary DOM element
  const doc = new DOMParser().parseFromString(`<!DOCTYPE html><body>${text}</body>`, 'text/html');
  return doc.documentElement.textContent || '';
};

export default function App() {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(spinValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          })
        ])
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const getRandomGameId = () => {
    return POPULAR_GAME_IDS[Math.floor(Math.random() * POPULAR_GAME_IDS.length)];
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const fetchRandomGame = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    fadeAnim.setValue(0);
    
    // Keep track of tried IDs to avoid duplicates in retry attempts
    const triedIds = new Set();
    
    try {
      let gameId;
      do {
        gameId = getRandomGameId();
      } while (triedIds.has(gameId) && triedIds.size < POPULAR_GAME_IDS.length);
      
      triedIds.add(gameId);

      const response = await fetch(`${BASE_URL}/boardgame/${gameId}`);
      const xmlText = await response.text();
      
      if (!xmlText.trim()) {
        throw new Error('Empty response from server');
      }

      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check if we got a valid game
      const items = xmlDoc.getElementsByTagName('item');
      if (!items || items.length === 0) {
        if (retryCount < 3) {
          await delay(1000);
          return fetchRandomGame(retryCount + 1);
        }
        throw new Error('Unable to find game');
      }

      // Get year
      const yearElements = xmlDoc.getElementsByTagName('yearpublished');
      const year = yearElements.length > 0 ? Number(yearElements[0].getAttribute('value')) : 0;
      
      // Get name (primary)
      const nameElements = xmlDoc.getElementsByTagName('name');
      let title = 'Unknown Title';
      for (let i = 0; i <nameElements.length; i++) {
        if (nameElements[i].getAttribute('type') === 'primary') {
          title = decodeHTMLEntities(nameElements[i].getAttribute('value'));
          break;
        }
      }

      // Get rating and number of ratings
      const statisticsElements = xmlDoc.getElementsByTagName('statistics');
      let rating = 'N/A';
      let numRatings = 0;
      if (statisticsElements.length > 0) {
        const ratingsElements = statisticsElements[0].getElementsByTagName('ratings');
        if (ratingsElements.length > 0) {
          const averageElements = ratingsElements[0].getElementsByTagName('average');
          const usersRatedElements = ratingsElements[0].getElementsByTagName('usersrated');
          
          if (usersRatedElements.length > 0) {
            numRatings = Number(usersRatedElements[0].getAttribute('value'));
          }
          
          if (averageElements.length > 0) {
            const ratingValue = averageElements[0].getAttribute('value');
            if (ratingValue && !isNaN(ratingValue)) {
              rating = Number(ratingValue).toFixed(1);
            }
          }
        }
      }

      // Get image
      const imageElements = xmlDoc.getElementsByTagName('image');
      const imageUrl = imageElements.length > 0 ? imageElements[0].textContent : null;

      // Get description
      const descriptionElements = xmlDoc.getElementsByTagName('description');
      const description = descriptionElements.length > 0 
        ? decodeHTMLEntities(descriptionElements[0].textContent)
        : 'No Description Available';

      setGameData({ title, description, rating, imageUrl, year, numRatings });
      fadeIn();
    } catch (err) {
      setError('Unable to find a game. Try again!');
      console.error('Error fetching game:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomGame();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Next Game Up</Text>
      <Text style={styles.subtitle}>Discover Your Next Favorite Board Game</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialCommunityIcons name="dice-multiple" size={80} color="#4A3780" />
          </Animated.View>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => fetchRandomGame()}
          >
            <Text style={styles.buttonText}>TRY AGAIN</Text>
          </Pressable>
        </View>
      ) : gameData ? (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <ScrollView style={styles.contentContainer}>
            {gameData.imageUrl && (
              <Image 
                source={{ uri: gameData.imageUrl }} 
                style={styles.image}
                resizeMode="contain"
              />
            )}
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{gameData.title}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Rating: </Text>
                <Text style={styles.ratingValue}>{gameData.rating}<Text style={styles.ratingMax}>/10</Text></Text>
                <Text style={styles.ratingLabel}> ({gameData.numRatings.toLocaleString()} ratings)</Text>
              </View>
              <Text style={styles.yearText}>Published: {gameData.year}</Text>
              <Text style={styles.description}>{gameData.description}</Text>
            </View>
          </ScrollView>
        </Animated.View>
      ) : null}

      {!loading && !error && (
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => fetchRandomGame()}
        >
          <Text style={styles.buttonText}>GET RANDOM GAME</Text>
        </Pressable>
      )}
      <Text style={styles.creditText}>Data provided by BoardGameGeek.com</Text>
      <StatusBar style="auto" />
    </View>
  );
}
