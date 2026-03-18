import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, Animated, Easing, Dimensions, StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Project {
  id: number;
  name: string;
  xpReward: number;
  goldReward: number;
  energyCost: number;
  timeCost: number;
  bugRisk: number;
}

const AVAILABLE_PROJECTS: Project[] = [
  { id: 1, name: "Fix CSS Bug 🐛", xpReward: 10, goldReward: 5, energyCost: 10, timeCost: 2, bugRisk: 5 },
  { id: 2, name: "Build Auth Flow 🔐", xpReward: 50, goldReward: 25, energyCost: 30, timeCost: 5, bugRisk: 20 },
  { id: 3, name: "Setup Microservices ☁️", xpReward: 200, goldReward: 100, energyCost: 60, timeCost: 10, bugRisk: 40 },
  { id: 4, name: "Legacy Code Refactor 🤢", xpReward: 120, goldReward: 60, energyCost: 50, timeCost: 8, bugRisk: 50 },
];

const SHOP_ITEMS = [
  { id: 'coffee', name: 'Premium Coffee ☕', cost: 30, desc: 'Restore 100% Energy' },
  { id: 'book', name: 'Clean Code Book 📚', cost: 150, desc: '+10% XP Permanently' },
];

export default function DevQuestPro() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [gold, setGold] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [xpMultiplier, setXpMultiplier] = useState(1.0);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [rank, setRank] = useState("Junior Intern");

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const nextLevelXp = level * 150;
    if (xp >= nextLevelXp) {
      setLevel(prev => prev + 1);
      updateRank(level + 1);
      Alert.alert("🎉 LEVEL UP!", `You are now Level ${level + 1}!`);
    }
  }, [xp]);

  const updateRank = (lvl: number) => {
    if (lvl >= 10) setRank("Dev Legend / CTO");
    else if (lvl >= 7) setRank("Principal Architect");
    else if (lvl >= 4) setRank("Senior Developer");
    else if (lvl >= 2) setRank("Mid-Level Developer");
  };

  const startWork = (project: Project) => {
    if (currentProject) return;
    if (energy < project.energyCost) {
      Alert.alert("❌ No Energy", "You are exhausted! Grab a coffee.");
      return;
    }

    setCurrentProject(project);
    setEnergy(prev => Math.max(0, prev - project.energyCost));

    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: project.timeCost * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        const bugHappened = Math.random() * 100 < project.bugRisk;
        if (bugHappened) {
          const lostGold = Math.floor(project.goldReward / 2);
          Alert.alert("🐛 BUG FOUND!", `You shipped a bug! Cost you ${lostGold} Gold.`);
          setGold(prev => Math.max(0, prev - lostGold));
        } else {
          setXp(prev => prev + Math.floor(project.xpReward * xpMultiplier));
          setGold(prev => prev + project.goldReward);
        }
        setCurrentProject(null);
      }
    });
  };

  const buyItem = (itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item || gold < item.cost) {
      Alert.alert("❌ Fail", "Not enough gold!");
      return;
    }
    setGold(prev => prev - item.cost);
    if (itemId === 'coffee') setEnergy(100);
    else if (itemId === 'book') setXpMultiplier(prev => prev + 0.1);
  };

  const renderProgressBar = (label: string, value: number, maxValue: number, color: string, icon: string) => (
    <View style={styles.barContainer}>
      <View style={styles.barHeader}>
        <View style={styles.iconLabel}>
          <MaterialCommunityIcons name={icon as any} size={16} color={color} />
          <Text style={[styles.barLabel, { color: color }]}>{label}</Text>
        </View>
        <Text style={styles.barValue}>{`${Math.floor(value)} / ${maxValue}`}</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${(value / maxValue) * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Text style={styles.playerName}>Halil Keleş</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>🏆 {rank}</Text>
          </View>
          <View style={styles.goldCounter}>
            <FontAwesome name="money" size={18} color="#FFD700" />
            <Text style={styles.goldText}> {gold} Gold</Text>
          </View>
        </View>

        <View style={styles.vitalsCard}>
          <Text style={styles.cardSectionTitle}>Vital Stats</Text>
          {renderProgressBar("Level", level, 20, "#38BDF8", "star")}
          {renderProgressBar("XP", xp, level * 150, "#4CAF50", "brain")}
          {renderProgressBar("Energy", energy, 100, "#FF5252", "lightning-bolt")}
        </View>

        {currentProject && (
          <View style={styles.workProgressCard}>
            <Text style={styles.workTitle}>Working on: {currentProject.name}</Text>
            <View style={styles.barBackground}>
              <Animated.View style={[styles.barFill, {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }),
                backgroundColor: '#FFD700'
              }]} />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Projects</Text>
          {AVAILABLE_PROJECTS.map(proj => (
            <TouchableOpacity
              key={proj.id}
              style={[styles.projectCard, !!currentProject && styles.projectCardDisabled]}
              onPress={() => startWork(proj)}
              disabled={!!currentProject}
            >
              <View style={styles.projectMain}>
                <Text style={styles.projectName}>{proj.name}</Text>
                <Text style={styles.projectStats}>{proj.energyCost}⚡ | {proj.timeCost}s</Text>
              </View>
              <View style={styles.projectRewards}>
                <Text style={styles.rewardXp}>+{proj.xpReward} XP</Text>
                <Text style={styles.rewardGold}>+{proj.goldReward}💰</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer Shop</Text>
          <View style={styles.shopGrid}>
            {SHOP_ITEMS.map(item => (
              <View key={item.id} style={styles.shopItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <TouchableOpacity style={styles.buyButton} onPress={() => buyItem(item.id)}>
                  <Text style={styles.buyButtonText}>{item.cost}💰</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  playerName: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  rankBadge: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginTop: 5 },
  rankText: { color: '#38BDF8', fontWeight: 'bold' },
  goldCounter: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  goldText: { color: '#FFD700', fontWeight: 'bold', fontSize: 16 },
  vitalsCard: { backgroundColor: '#111827', borderRadius: 20, padding: 15, marginBottom: 20 },
  cardSectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  barContainer: { marginBottom: 10 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  iconLabel: { flexDirection: 'row', alignItems: 'center' },
  barLabel: { fontSize: 12, fontWeight: '600', marginLeft: 5 },
  barValue: { color: '#94A3B8', fontSize: 10 },
  barBackground: { height: 6, backgroundColor: '#1F2937', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  workProgressCard: { backgroundColor: '#1E293B', borderRadius: 15, padding: 15, marginBottom: 20 },
  workTitle: { color: '#FFF', fontSize: 12, marginBottom: 8 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  projectCard: { backgroundColor: '#111827', flexDirection: 'row', borderRadius: 12, padding: 15, marginBottom: 10, justifyContent: 'space-between' },
  projectCardDisabled: { opacity: 0.5 },
  projectMain: { flex: 1 },
  projectName: { color: '#FFF', fontWeight: 'bold' },
  projectStats: { color: '#94A3B8', fontSize: 11 },
  projectRewards: { alignItems: 'flex-end' },
  rewardXp: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold' },
  rewardGold: { color: '#FFD700', fontSize: 12, fontWeight: 'bold' },
  shopGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  shopItem: { backgroundColor: '#111827', width: '48%', borderRadius: 12, padding: 10, alignItems: 'center' },
  itemName: { color: '#FFF', fontSize: 12, marginBottom: 8 },
  buyButton: { backgroundColor: '#38BDF8', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 },
  buyButtonText: { color: '#0A0E17', fontWeight: 'bold' },
});