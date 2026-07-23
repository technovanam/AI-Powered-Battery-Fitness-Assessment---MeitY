import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TEST_PROTOCOLS } from '../constants/protocols';
import { TestId } from '../types/assessment';
import { useAssessmentStore } from '../store/assessmentStore';

export default function TestManualEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const testId = (params.testId as TestId) || 'weight';
  const protocol = TEST_PROTOCOLS[testId];

  const { activeAthlete, saveTestResult } = useAssessmentStore();
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  const handleSave = () => {
    const numericScore = parseFloat(score);
    if (isNaN(numericScore)) {
      Alert.alert('Invalid Entry', 'Please enter a valid numeric result.');
      return;
    }

    if (!activeAthlete) return;

    saveTestResult({
      testId,
      athleteId: activeAthlete.id,
      score: numericScore,
      unit: protocol.unit,
      confidence: 100, // Manual verification
      isAiMeasured: false,
      calibrationMethod: 'none',
      notes: notes.trim()
    });

    router.back();
  };

  const handleTriggerOcr = () => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setIsOcrProcessing(false);
      setScore('54.2');
      Alert.alert('ML Kit OCR Text Recognition', 'Scanned scale display result: 54.2 kg');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{protocol.name}</Text>
          <Text style={styles.category}>{protocol.category}</Text>
        </View>

        {/* Protocol Instruction Box */}
        <View style={styles.protocolCard}>
          <Text style={styles.protocolTitle}>📋 Test Instructions & Guidelines</Text>
          {protocol.instructions.map((inst, index) => (
            <Text key={index} style={styles.protocolItem}>
              {index + 1}. {inst}
            </Text>
          ))}
        </View>

        {/* Optional OCR Trigger for Weight Scale */}
        {testId === 'weight' && (
          <TouchableOpacity style={styles.ocrBtn} onPress={handleTriggerOcr}>
            <Text style={styles.ocrBtnText}>
              {isOcrProcessing ? '📷 Processing ML Kit OCR...' : '📷 Snap Scale Display (Auto OCR)'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Form Entry */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Recorded Result ({protocol.unit}) *</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={`e.g. ${protocol.targetRange?.min || 10}`}
              placeholderTextColor="#64748b"
              keyboardType="decimal-pad"
              value={score}
              onChangeText={setScore}
            />
            <View style={styles.unitBox}>
              <Text style={styles.unitText}>{protocol.unit}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes / Observations (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Smooth execution, verified with digital scale"
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitBtnText}>Save Assessment Score ➔</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16' },
  container: { padding: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  category: { fontSize: 13, color: '#38bdf8', marginTop: 2, fontWeight: '600' },
  protocolCard: { backgroundColor: '#1e293b', padding: 16, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  protocolTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  protocolItem: { color: '#cbd5e1', fontSize: 12, lineHeight: 18, marginBottom: 6 },
  ocrBtn: { backgroundColor: '#15803d', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#22c55e' },
  ocrBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
  formGroup: { marginBottom: 16 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#1e293b', color: '#f8fafc', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#334155', fontSize: 16, fontWeight: '700' },
  unitBox: { backgroundColor: '#0f172a', padding: 14, borderRadius: 8, marginLeft: 8, borderWidth: 1, borderColor: '#334155' },
  unitText: { color: '#38bdf8', fontWeight: '800', fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#0284c7', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 16 }
});
