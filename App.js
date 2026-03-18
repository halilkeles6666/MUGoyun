import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar
} from 'react-native';

// 1. Alt Bileşen (Component) - Daha temiz kod için kartı ayırdık
const DeveloperCard = ({ ad, uzmanlik, seviye }) => {
    const [musaitMi, setMusaitMi] = useState(true);

    const handleHirePress = () => {
        if (musaitMi) {
            setMusaitMi(false);
        }
    };

    return (
        // Dinamik Arka Plan: Müsaitlik durumuna göre renk değişir
        <View style={[styles.card, !musaitMi && styles.cardBusy]}>

            <View style={styles.badgeContainer}>
                <Text style={styles.levelBadge}>{seviye}</Text>
            </View>

            <Text style={styles.nameText}>{ad}</Text>
            <Text style={styles.specialtyText}>{uzmanlik}</Text>

            <View style={styles.divider} />

            <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: musaitMi ? '#4CAF50' : '#F44336' }]} />
                <Text style={styles.statusText}>
                    {musaitMi ? "Yeni Projelere Açık" : "Şu An Bir Projede"}
                </Text>
            </View>

            {/* Modern Buton tasarımı */}
            <TouchableOpacity
                style={[styles.button, !musaitMi && styles.buttonDisabled]}
                onPress={handleHirePress}
                disabled={!musaitMi}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>
                    {musaitMi ? "İşe Al" : "Projelerde Çalışıyor"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <DeveloperCard
                ad="Halil Keleş"
                uzmanlik="Mobile & Frontend Developer"
                seviye="Senior"
            />
        </SafeAreaView>
    );
}

// 2. Modern Tasarım (StyleSheet)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5', // Soft arka plan
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        // iOS için gölge
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        // Android için gölge
        elevation: 8,
    },
    cardBusy: {
        backgroundColor: '#F9F9F9', // Çalışırken hafif soluklaşır
    },
    badgeContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10,
    },
    levelBadge: {
        color: '#1E88E5',
        fontWeight: 'bold',
        fontSize: 12,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    specialtyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 20,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        color: '#444',
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#007AFF', // iOS Mavi
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#BDBDBD',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});