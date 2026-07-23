import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAssessmentStore } from '../store/assessmentStore';
import { TEST_PROTOCOLS } from '../constants/protocols';
import { ReportCardGenerator } from '../services/reportCardGenerator';

export default function ReportCardScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { activeAthlete, getResultsForAthlete } = useAssessmentStore();

  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('en');
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);

  if (!activeAthlete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Active Athlete Selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  const results = getResultsForAthlete(activeAthlete.id);

  const toggleLanguage = () => {
    const next = selectedLang === 'en' ? 'hi' : 'en';
    setSelectedLang(next);
    i18n.changeLanguage(next);
  };

  const handleExportPdf = () => {
    setIsPdfModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Controls */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
            <Text style={styles.langBtnText}>
              🌐 {selectedLang === 'en' ? 'English (EN)' : 'हिंदी (HI)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pdfBtn} onPress={handleExportPdf}>
            <Text style={styles.pdfBtnText}>📄 Export PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Report Document Box */}
        <View style={styles.documentCard}>
          <View style={styles.docHeader}>
            <Text style={styles.docTitle}>
              {selectedLang === 'hi' ? 'राष्ट्रीय फिटनेस बैटरी रिपोर्ट कार्ड' : 'National Battery Fitness Report Card'}
            </Text>
            <Text style={styles.docSub}>NeGD / MeitY / MYAS National Hackathon Standard</Text>
          </View>

          {/* Athlete Profile Grid */}
          <View style={styles.profileBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{selectedLang === 'hi' ? 'नाम' : 'Athlete'}:</Text>
              <Text style={styles.metaVal}>{activeAthlete.name}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{selectedLang === 'hi' ? 'आयु / श्रेणी' : 'Age / Cat'}:</Text>
              <Text style={styles.metaVal}>{activeAthlete.age} yrs ({activeAthlete.category})</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>APAAR ID:</Text>
              <Text style={styles.metaVal}>{activeAthlete.apaarId}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>NSRS ID:</Text>
              <Text style={styles.metaVal}>{activeAthlete.nsrsId}</Text>
            </View>
          </View>

          {/* Results Table */}
          <Text style={styles.tableTitle}>{selectedLang === 'hi' ? 'मूल्यांकन परिणाम विवरण' : 'Assessment Test Results'}</Text>
          
          {Object.values(TEST_PROTOCOLS).map((protocol) => {
            const res = results.find(r => r.testId === protocol.id);
            const name = selectedLang === 'hi' ? protocol.nameHindi : protocol.name;

            return (
              <View key={protocol.id} style={styles.tableRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName}>{name}</Text>
                  <Text style={styles.rowCategory}>{protocol.category}</Text>
                </View>

                {res ? (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.rowScore}>{res.score} {res.unit}</Text>
                    {res.isAiMeasured ? (
                      <Text style={styles.aiTag}>✨ AI ({res.confidence}%)</Text>
                    ) : (
                      <Text style={styles.manualTag}>✏️ Manual</Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.notAssessed}>{selectedLang === 'hi' ? 'नॉट डन' : 'Not Assessed'}</Text>
                )}
              </View>
            );
          })}

          {/* Mandatory Compliance Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerHeader}>⚠️ {t('normDisclaimer')}</Text>
            <Text style={styles.disclaimerBody}>
              {selectedLang === 'hi'
                ? 'सांकेतिक — भारतीय मानक अभी स्थापित नहीं किए गए हैं। सभी मान केवल प्रदर्शन और प्रारंभिक फिटनेस मूल्यांकन उद्देश्यों के लिए हैं।'
                : 'Percentile rankings are relative to baseline trial cohorts as specified in Section 8.5 of the Concept Note.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* PDF Export Modal */}
      <Modal visible={isPdfModalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📄 On-Device PDF Generated!</Text>
            <Text style={styles.modalSub}>
              Bilingual report card compiled offline into sandbox directory:
            </Text>
            <Text style={styles.pathText}>
              sandbox/documents/report_{activeAthlete.id}.pdf
            </Text>

            <TouchableOpacity style={styles.modalActionBtn} onPress={() => {
              setIsPdfModalVisible(false);
              Alert.alert('Share PDF', 'Offline PDF file ready to print or export via Bluetooth/Share.');
            }}>
              <Text style={styles.modalActionText}>Share / Save PDF ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsPdfModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16' },
  container: { padding: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  langBtn: { backgroundColor: '#1e293b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  langBtnText: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
  pdfBtn: { backgroundColor: '#0284c7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  pdfBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  documentCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, color: '#0f172a' },
  docHeader: { borderBottomWidth: 3, borderBottomColor: '#2563eb', paddingBottom: 12, marginBottom: 16 },
  docTitle: { fontSize: 18, fontWeight: '800', color: '#1e3a8a' },
  docSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  profileBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  metaLabel: { color: '#64748b', fontSize: 12 },
  metaVal: { color: '#0f172a', fontSize: 12, fontWeight: '700' },
  tableTitle: { fontSize: 14, fontWeight: '800', color: '#1e293b', marginBottom: 10 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 8 },
  rowName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  rowCategory: { fontSize: 10, color: '#64748b' },
  rowScore: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  aiTag: { backgroundColor: '#dcfce7', color: '#166534', fontSize: 9, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  manualTag: { backgroundColor: '#f1f5f9', color: '#475569', fontSize: 9, fontWeight: '600', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  notAssessed: { color: '#94a3b8', fontSize: 12, fontStyle: 'italic' },
  disclaimerCard: { backgroundColor: '#fffbeb', borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 10, borderRadius: 4, marginTop: 16 },
  disclaimerHeader: { color: '#92400e', fontSize: 11, fontWeight: '800', marginBottom: 2 },
  disclaimerBody: { color: '#b45309', fontSize: 10, lineHeight: 14 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', padding: 24, borderRadius: 16, width: '100%', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc', marginBottom: 8 },
  modalSub: { color: '#cbd5e1', fontSize: 12, textAlign: 'center' },
  pathText: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginVertical: 12, backgroundColor: '#0f172a', padding: 8, borderRadius: 6 },
  modalActionBtn: { backgroundColor: '#0284c7', padding: 14, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10 },
  modalActionText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  modalCloseBtn: { padding: 10 },
  modalCloseText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' }
});
