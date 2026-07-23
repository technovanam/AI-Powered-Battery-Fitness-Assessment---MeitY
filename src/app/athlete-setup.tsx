import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAssessmentStore } from '../store/assessmentStore';

export default function AthleteSetupScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { registerAthlete, athletes, setActiveAthlete } = useAssessmentStore();

  const [name, setName] = useState('');
  const [age, setAge] = useState('14');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [apaarId, setApaarId] = useState('');
  const [nsrsId, setNsrsId] = useState('');

  const handleRegister = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter athlete full name.');
      return;
    }

    const numericAge = parseInt(age, 10) || 12;
    const category = numericAge < 12 ? 'U-12' : '12+';

    const athlete = registerAthlete({
      name: name.trim(),
      age: numericAge,
      gender,
      category,
      apaarId: apaarId.trim() || `APAAR-${Math.floor(100000 + Math.random() * 900000)}`,
      nsrsId: nsrsId.trim() || `NSRS-IND-${Math.floor(1000 + Math.random() * 9000)}`,
      schoolId: 'KV-DEMO-01'
    });

    router.push('/battery-hub');
  };

  const handleSelectExisting = (ath: any) => {
    setActiveAthlete(ath);
    router.push('/battery-hub');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('registerAthlete')}</Text>
        <Text style={styles.subtitle}>Enter athlete demographics for standardized battery scoring.</Text>

        {/* Existing Athletes Dropdown Quick Switch */}
        {athletes.length > 0 && (
          <View style={styles.existingBox}>
            <Text style={styles.existingTitle}>Quick Switch Active Profile:</Text>
            {athletes.map((ath) => (
              <TouchableOpacity
                key={ath.id}
                style={styles.athleteItem}
                onPress={() => handleSelectExisting(ath)}
              >
                <Text style={styles.athName}>{ath.name}</Text>
                <Text style={styles.athMeta}>{ath.age} yrs • {ath.category} • {ath.apaarId || 'No APAAR'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('name')} *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Aarav Sharma"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>{t('age')} *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 14"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>{t('gender')}</Text>
            <View style={styles.genderRow}>
              {(['M', 'F', 'Other'] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('apaarId')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. APAAR-9821-4410-7712"
            placeholderTextColor="#64748b"
            value={apaarId}
            onChangeText={setApaarId}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('nsrsId')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. NSRS-IND-2026-089"
            placeholderTextColor="#64748b"
            value={nsrsId}
            onChangeText={setNsrsId}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
          <Text style={styles.submitBtnText}>{t('saveAthlete')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16' },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginVertical: 6 },
  existingBox: { backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginVertical: 12, borderWidth: 1, borderColor: '#334155' },
  existingTitle: { color: '#38bdf8', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  athleteItem: { backgroundColor: '#0f172a', padding: 10, borderRadius: 8, marginBottom: 6 },
  athName: { color: '#f8fafc', fontWeight: '700', fontSize: 14 },
  athMeta: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  formGroup: { marginBottom: 16 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155', fontSize: 14 },
  row: { flexDirection: 'row' },
  genderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  genderBtn: { flex: 1, backgroundColor: '#1e293b', padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 2, borderWidth: 1, borderColor: '#334155' },
  genderBtnActive: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
  genderText: { color: '#94a3b8', fontWeight: '600', fontSize: 13 },
  genderTextActive: { color: '#ffffff' },
  submitBtn: { backgroundColor: '#0284c7', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 16 }
});
