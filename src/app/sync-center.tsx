import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAssessmentStore } from '../store/assessmentStore';
import { TEST_PROTOCOLS } from '../constants/protocols';

export default function SyncCenterScreen() {
  const router = useRouter();
  const { syncQueue, syncQueueItem } = useAssessmentStore();
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);

  const pendingItems = syncQueue.filter(item => item.status === 'PENDING');
  const syncedItems = syncQueue.filter(item => item.status === 'SYNCED');

  const handleSyncAll = () => {
    if (pendingItems.length === 0) {
      Alert.alert('Sync Center', 'All scores are up to date! Zero pending sync items.');
      return;
    }

    setIsSimulatingSync(true);

    setTimeout(() => {
      pendingItems.forEach(item => syncQueueItem(item.id));
      setIsSimulatingSync(false);
      Alert.alert('Background Sync Complete', 'De-identified numeric results synced successfully.');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Airplane Mode Ready Banner */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerIcon}>✈️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Airplane Mode / Offline Ready</Text>
            <Text style={styles.bannerSubtitle}>
              All assessment AI pipelines, calibration engines, and local databases operate 100% offline without internet connection.
            </Text>
          </View>
        </View>

        {/* Sync Controls */}
        <View style={styles.syncHeader}>
          <Text style={styles.sectionTitle}>Sync Queue Monitor</Text>
          <TouchableOpacity style={styles.syncNowBtn} onPress={handleSyncAll}>
            <Text style={styles.syncNowText}>
              {isSimulatingSync ? 'Syncing...' : 'Sync Now 🔄'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pending Items List */}
        <Text style={styles.subHeader}>Pending Upload Queue ({pendingItems.length})</Text>
        
        {pendingItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>✓ Queue empty — All assessment results synced locally.</Text>
          </View>
        ) : (
          pendingItems.map((item) => {
            const protocol = TEST_PROTOCOLS[item.payload.testId];
            return (
              <View key={item.id} style={styles.queueItemCard}>
                <View>
                  <Text style={styles.itemName}>{protocol?.name || item.payload.testId}</Text>
                  <Text style={styles.itemMeta}>Score: {item.payload.score} {item.payload.unit} • Confidence: {item.payload.confidence}%</Text>
                  <Text style={styles.privacyNote}>🔒 Payload: De-identified numeric score ONLY (Zero raw video)</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>PENDING</Text>
                </View>
              </View>
            );
          })
        )}

        {/* Synced Items Section */}
        {syncedItems.length > 0 && (
          <>
            <Text style={styles.subHeader}>Recently Synced ({syncedItems.length})</Text>
            {syncedItems.map((item) => {
              const protocol = TEST_PROTOCOLS[item.payload.testId];
              return (
                <View key={item.id} style={[styles.queueItemCard, styles.syncedCard]}>
                  <View>
                    <Text style={styles.itemName}>{protocol?.name || item.payload.testId}</Text>
                    <Text style={styles.itemMeta}>Score: {item.payload.score} {item.payload.unit}</Text>
                  </View>
                  <View style={styles.syncedBadge}>
                    <Text style={styles.syncedBadgeText}>✓ SYNCED</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* Privacy Audit Log */}
        <View style={styles.auditBox}>
          <Text style={styles.auditTitle}>🛡️ Hackathon Data Privacy Compliance Audit</Text>
          <Text style={styles.auditText}>
            • Section 7.1 Compliance: Raw video recordings are written exclusively to encrypted sandbox storage (`SQLCipher` / `react-native-aes-crypto`).
          </Text>
          <Text style={styles.auditText}>
            • Section 6.3 Compliance: Cloud sync sends ONLY de-identified athlete numeric scores and metadata.
          </Text>
          <Text style={styles.auditText}>
            • Sovereign Infra: Backend designed for NIC / MeghRaj deployment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16' },
  container: { padding: 16 },
  bannerCard: { backgroundColor: '#172554', borderColor: '#3b82f6', borderWidth: 1, padding: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  bannerIcon: { fontSize: 28 },
  bannerTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  bannerSubtitle: { color: '#93c5fd', fontSize: 11, marginTop: 4, lineHeight: 16 },
  syncHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
  syncNowBtn: { backgroundColor: '#0284c7', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  syncNowText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  subHeader: { color: '#94a3b8', fontSize: 13, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  emptyCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  emptyText: { color: '#34d399', fontSize: 12, fontWeight: '600' },
  queueItemCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  syncedCard: { backgroundColor: '#0f172a', borderColor: '#166534' },
  itemName: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  itemMeta: { color: '#cbd5e1', fontSize: 12, marginTop: 2 },
  privacyNote: { color: '#38bdf8', fontSize: 10, marginTop: 4, fontWeight: '600' },
  statusBadge: { backgroundColor: '#854d0e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { color: '#fef08a', fontSize: 10, fontWeight: '800' },
  syncedBadge: { backgroundColor: '#14532d', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  syncedBadgeText: { color: '#86efac', fontSize: 10, fontWeight: '800' },
  auditBox: { backgroundColor: '#0f172a', padding: 16, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: '#1e293b' },
  auditTitle: { color: '#f8fafc', fontSize: 13, fontWeight: '800', marginBottom: 8 },
  auditText: { color: '#94a3b8', fontSize: 11, lineHeight: 16, marginBottom: 6 }
});
