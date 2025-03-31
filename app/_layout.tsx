import { Tabs } from 'expo-router';
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons'; // Ou toute autre bibliothèque d'icônes que vous utilisez

// Définir le composant TabBarIcon
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.card, // Texte blanc pour contraster avec primary
        tabBarStyle: {
          backgroundColor: Colors.card,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <TabBarIcon name="question-circle" color={color} />,
        }}
      />
      {/* Autres onglets existants */}
    </Tabs>
  );
}