import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAssessmentStore } from '../store/assessmentStore';
import { TEST_PROTOCOLS } from '../constants/protocols';
import { TestId } from '../types/assessment';

export default function BatteryHubScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { activeAthlete, getResultsForAthlete, syncQueue } = useAssessmentStore();

  if (!activeAthlete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Active Athlete Selected</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/athlete-setup')}>
            <Text style={styles.actionBtnText}>Register Athlete ➔</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const athleteResults = getResultsForAthlete(activeAthlete.id);
  const completedCount = athleteResults.length;
  const totalCount = Object.keys(TEST_PROTOCOLS).length;
  const pendingSyncCount = syncQueue.filter(s => s.status === 'PENDING').length;

  const handleLaunchTest = (testId: TestId, isAiSupported: boolean) => {
    if (isAiSupported) {
      router.push({ pathname: '/test-ai-camera', params: { testId } });
    } else {
      router.push({ pathname: '/test-manual-entry', params: { testId } });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Athlete Banner */}
        <View style={styles.athleteBanner}>
          <View style={styles.athleteInfo}>
            <Text style={styles.athleteName}>{activeAthlete.name}</Text>
            <Text style={styles.athleteMeta}>
              {activeAthlete.age} yrs • Category {activeAthlete.category} • ID: {activeAthlete.apaarId}
            </Text>
          </View>
          <TouchableOpacity style={styles.switchBtn} onPress={() => router.push('/athlete-setup')}>
            <Text style={styles.switchBtnText}>Switch 🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Progress & Sync Bar */}
        <View style={styles.statusRow}>
          <View style={styles.statusCard}>
            <Text style={styles.statusNum}>{completedCount} / {totalCount}</Text>
            <Text style={styles.statusLabel}>Tests Completed</Text>
          </View>
          
          <TouchableOpacity style={[styles.statusCard, styles.syncCard]} onPress={() => router.push('/sync-center')}>
            <Text style={styles.syncNum}>📡 {pendingSyncCount}</Text>
            <Text style={styles.statusLabel}>Pending Sync</Text>
          </TouchableOpacity>
        </View>

        {/* Report Card Banner */}
        <TouchableOpacity style={styles.reportCardBanner} onPress={() => router.push('/report-card')}>
          <View>
            <Text style={styles.reportBannerTitle}>📄 Generate On-Device Report Card</Text>
            <Text style={styles.reportBannerSubtitle}>Bilingual (English / Hindi) PDF with confidence metrics</Text>
          </View>
          <Text style={styles.reportArrow}>➔</Text>
        </TouchableOpacity>

        {/* Test List */}
        <Text style={styles.sectionHeader}>{t('testHub')}</Text>

        {Object.values(TEST_PROTOCOLS).map((protocol) => {
          const res = athleteResults.find(r => r.testId === protocol.id);
          const isDone = !!res;
          const name = i18n.language === 'hi' ? protocol.nameHindi : protocol.name;

          return (
            <TouchableOpacity
              key={protocol.id}
              style={[styles.testCard, isDone && styles.testCardDone]}
              onPress={() => handleLaunchTest(protocol.id, protocol.isAiSupported)}
            >
              <View style={styles.testHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.testName}>{name}</Text>
                    {protocol.isAiSupported ? (
                      <Text style={styles.aiBadge}>✨ AI Automated</Text>
                    ) : (
                      <Text style={styles.manualBadge}>✏️ Manual</Text>
                    )}
                  </View>
                  <Text style={styles.categoryText}>{protocol.category}</Text>
                </View>

                {isDone && (
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreValue}>{res.score} {res.unit}</Text>
                    {res.isAiMeasured && (
                      <Text style={styles.confText}>{res.confidence}% Conf.</Text>
                    )}
                  </View>
                )}
              </View>

              <Text style={styles.descText}>{protocol.description}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.cardActionText}>
                  {isDone ? 'Retake Test 🔄' : 'Start Assessment ➔'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16' },
  container: { padding: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginBottom: 12 },
  actionBtn: { backgroundColor: '#0284c7', padding: 12, borderRadius: 8 },
  actionBtnText: { color: '#ffffff', fontWeight: '700' },
  athleteBanner: { backgroundColor: '#1e293b', padding: 16, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  athleteInfo: { flex: 1 },
  athleteName: { color: '#f8fafc', fontSize: 18, fontWeight: '800' },
  athleteMeta: { color: '#38bdf8', fontSize: 12, marginTop: 2, fontWeight: '600' },
  switchBtn: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  switchBtnText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 14 },
  statusCard: { flex: 1, backgroundColor: '#1e293b', padding: 14, borderRadius: 12, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  syncCard: { marginRight: 0, borderColor: '#0284c7' },
  statusNum: { color: '#f8fafc', fontSize: 20, fontWeight: '800' },
  syncNum: { color: '#38bdf8', fontSize: 20, fontWeight: '800' },
  statusLabel: { color: '#94a3b8', fontSize: 11, marginTop: 4 },
  reportCardBanner: { backgroundColor: '#172554', borderColor: '#3b82f6', borderWidth: 1, padding: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reportBannerTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  reportBannerSubtitle: { color: '#93c5fd', fontSize: 11, marginTop: 2 },
  reportArrow: { color: '#60a5fa', fontSize: 18, fontWeight: '800' },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#f8fafc', marginBottom: 12 },
  testCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  testCardDone: { borderColor: '#10b981', backgroundColor: '#064e3b' },
  testHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  testName: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  aiBadge: { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  manualBadge: { backgroundColor: 'rgba(148, 163, 184, 0.2)', color: '#cbd5e1', fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  categoryText: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  scoreBox: { backgroundColor: '#022c22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: 'flex-end', borderWidth: 1, borderColor: '#059669' },
  scoreValue: { color: '#34d399', fontSize: 14, fontWeight: '800' },
  confText: { color: '#a7f3d0', fontSize: 9, fontWeight: '600' },
  descText: { color: '#cbd5e1', fontSize: 12, marginVertical: 8, lineHeight: 16 },
  cardFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 8, alignItems: 'flex-end' },
  cardActionText: { color: '#38bdf8', fontSize: 12, fontWeight: '700' }
});
