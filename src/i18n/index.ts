import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'AI Battery Fitness Assessment',
      subTitle: 'MeitY / MYAS National Hackathon',
      individualMode: 'Individual Mode',
      assessorMode: 'Assessor / Coach Mode',
      selectMode: 'Select Operational Mode',
      startAssessment: 'Start Assessment',
      athleteProfile: 'Athlete Profile',
      registerAthlete: 'Register Athlete',
      name: 'Full Name',
      age: 'Age',
      gender: 'Gender',
      apaarId: 'APAAR ID (Optional)',
      nsrsId: 'NSRS ID (Optional)',
      saveAthlete: 'Save & Continue',
      testHub: 'Fitness Battery Tests',
      aiSupported: 'AI Automated',
      manualEntry: 'Manual Fallback',
      startTest: 'Start Test',
      calibrationLocked: 'Calibration Locked',
      anthropometricFallback: 'Anthropometric Fallback',
      confidence: 'Confidence',
      recordVideo: 'Record & Analyze',
      stopRecording: 'Stop Recording',
      analyzing: 'Processing AI Inference...',
      result: 'Assessment Result',
      saveResult: 'Save Score',
      reportCard: 'Athlete Fitness Report Card',
      exportPdf: 'Export Offline PDF',
      syncCenter: 'Sync & Privacy Center',
      pendingSync: 'Pending Uploads',
      airplaneModeReady: 'Offline / Airplane Mode Active',
      privacyNotice: 'Strict Data Protection: Videos never leave local device sandbox.',
      normDisclaimer: 'Illustrative — Indian norms not yet established'
    }
  },
  hi: {
    translation: {
      appName: 'एआई संचालित फिटनेस मूल्यांकन',
      subTitle: 'MeitY / MYAS राष्ट्रीय हैकाथॉन',
      individualMode: 'व्यक्तिगत मोड',
      assessorMode: 'परीक्षक / कोच मोड',
      selectMode: 'संचालन मोड चुनें',
      startAssessment: 'मूल्यांकन शुरू करें',
      athleteProfile: 'एथलीट प्रोफाइल',
      registerAthlete: 'एथलीट पंजीकृत करें',
      name: 'पूरा नाम',
      age: 'आयु',
      gender: 'लिंग',
      apaarId: 'अपार आईडी (वैकल्पिक)',
      nsrsId: 'एनएसआरएस आईडी (वैकल्पिक)',
      saveAthlete: 'सहेजें और आगे बढ़ें',
      testHub: 'फिटनेस टेस्ट बैटरी',
      aiSupported: 'एआई स्वचालित',
      manualEntry: 'मैन्युअल प्रविष्टि',
      startTest: 'परीक्षण शुरू करें',
      calibrationLocked: 'कैलिब्रेशन लॉक',
      anthropometricFallback: 'मानवमितीय फॉलबैक',
      confidence: 'विश्वसनीयता',
      recordVideo: 'रिकॉर्ड और विश्लेषण',
      stopRecording: 'रिकॉर्डिंग रोकें',
      analyzing: 'एआई प्रक्रमण जारी है...',
      result: 'मूल्यांकन परिणाम',
      saveResult: 'अंक सहेजें',
      reportCard: 'एथलीट फिटनेस रिपोर्ट कार्ड',
      exportPdf: 'ऑफ़लाइन पीडीएफ निर्यात करें',
      syncCenter: 'सिंक और गोपनीयता केंद्र',
      pendingSync: 'लंबित अपलोड',
      airplaneModeReady: 'ऑफ़लाइन / एयरप्लेन मोड सक्रिय',
      privacyNotice: 'कठोर डेटा सुरक्षा: वीडियो कभी स्थानीय डिवाइस से बाहर नहीं जाता है।',
      normDisclaimer: 'सांकेतिक — भारतीय मानक अभी स्थापित नहीं किए गए हैं'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
