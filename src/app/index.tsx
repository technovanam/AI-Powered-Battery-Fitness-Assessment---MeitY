import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAssessmentStore } from '../store/assessmentStore';
import { AssessmentMode } from '../types/assessment';

export default function OnboardingScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { setMode, activeAthlete } = useAssessmentStore();

  const handleSelectMode = (mode: AssessmentMode) => {
    setMode(mode);
    if (activeAthlete) {
      router.push('/battery-hub');
    } else {
      router.push('/athlete-setup');
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>NeGD / MeitY / MYAS National Hackathon</Text>
          </View>

          <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
            <Text style={styles.langButtonText}>
              🌐 {i18n.language === 'en' ? 'हिंदी (HI)' : 'English (EN)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>⚡</Text>
          <Text style={styles.appTitle}>{t('appName')}</Text>
          <Text style={styles.subtitle}>{t('subTitle')}</Text>
          
          <View style={styles.differentiatorPill}>
            <Text style={styles.differentiatorText}>
              ✨ Featuring Universal Calibration Marker & On-Device AI Pose Detection
            </Text>
          </View>
        </View>

        {/* Operational Mode Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('selectMode')}</Text>
          
          {/* Individual Mode */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleSelectMode('individual')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>👤</Text>
              <View>
                <Text style={styles.cardTitle}>{t('individualMode')}</Text>
                <Text style={styles.cardSubtitle}>Self-guided step-by-step test workflow</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>
              Ideal for single athletes testing performance independently with automatic AI pose guidance & instantaneous PDF report card.
            </Text>
          </TouchableOpacity>

          {/* Assessor / Coach Mode */}
          <TouchableOpacity
            style={[styles.modeCard, styles.assessorCard]}
            onPress={() => handleSelectMode('assessor')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📋</Text>
              <View>
                <Text style={styles.cardTitle}>{t('assessorMode')}</Text>
                <Text style={styles.cardSubtitle}>High-throughput testing for schools & academies</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>
              Allows coaches to toggle between Athlete-wise batch processing and Test-wise station setups (e.g. Height Station).
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Athlete Quick Resume */}
        {activeAthlete && (
          <View style={styles.resumeSection}>
            <Text style={styles.resumeLabel}>Active Session Detected:</Text>
            <Text style={styles.resumeName}>{activeAthlete.name} ({activeAthlete.age} yrs)</Text>
            <TouchableOpacity
              style={styles.resumeButton}
              onPress={() => router.push('/battery-hub')}
            >
              <Text style={styles.resumeButtonText}>Continue Session ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔒 100% Privacy Compliant: Zero raw video leaves your device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16' },
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  badgeContainer: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#38bdf8', fontSize: 11, fontWeight: '700' },
  langButton: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  langButtonText: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
  heroSection: { alignItems: 'center', marginVertical: 15 },
  heroIcon: { fontSize: 42, marginBottom: 8 },
  appTitle: { fontSize: 24, fontWeight: '800', color: '#f8fafc', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4, textAlign: 'center' },
  differentiatorPill: { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderColor: '#0284c7', borderWidth: 1, padding: 10, borderRadius: 12, marginTop: 14 },
  differentiatorText: { color: '#38bdf8', fontSize: 12, textAlign: 'center', fontWeight: '600' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#f8fafc', marginBottom: 12 },
  modeCard: { backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  assessorCard: { borderColor: '#3b82f6', backgroundColor: '#172554' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardIcon: { fontSize: 28, marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#f8fafc' },
  cardSubtitle: { fontSize: 12, color: '#94a3b8' },
  cardDesc: { fontSize: 12, color: '#cbd5e1', lineHeight: 18 },
  resumeSection: { backgroundColor: '#0f172a', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#38bdf8', marginTop: 10 },
  resumeLabel: { color: '#94a3b8', fontSize: 12 },
  resumeName: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginVertical: 4 },
  resumeButton: { backgroundColor: '#0284c7', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  resumeButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  footer: { marginTop: 25, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#1e293b', alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 11, textAlign: 'center' }
});
