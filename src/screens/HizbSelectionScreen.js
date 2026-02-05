import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, Alert, TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import colors from '../styles/colors';

const HizbSelectionScreen = ({ navigation }) => {
  const [selectedHizb, setSelectedHizb] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [mode, setMode] = useState('sequential');

  const handleStartTest = () => {
    if (!selectedHizb) {
      Alert.alert('تنبيه', 'الرجاء اختيار حزب');
      return;
    }
    if (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0)) {
      Alert.alert('تنبيه', 'يجب تحديد عدد الأسئلة عند اختيار الوضع المتسلسل');
      return;
    }
    navigation.navigate('Duaa', {
      testType: 'Hizb',
      hizbNumber: parseInt(selectedHizb),
      selectionMode: mode,
      questionCount: questionCount ? parseInt(questionCount) : null,
    });
  };

  const hizbsList = Array.from({ length: 60 }, (_, i) => ({
    number: i + 1,
    label: `الحزب ${i + 1}`
  }));

  const selectedHizbData = selectedHizb
    ? hizbsList.find(h => h.number === parseInt(selectedHizb))
    : null;

  const isButtonDisabled = !selectedHizb || (mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>اختبار حسب الحزب</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>اختر الحزب الذي تريد اختبار حفظه</Text>
          </View>

          <View style={styles.pickerCard}>
            <Text style={styles.label}>اختر الحزب:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedHizb}
                onValueChange={(itemValue) => setSelectedHizb(itemValue)}
                style={styles.picker}
                dropdownIconColor={colors.primary}
                mode="dropdown">
                <Picker.Item label="-- حزب --" value="" style={styles.pickerItem} />
                {hizbsList.map((hizb) => (
                  <Picker.Item
                    key={hizb.number}
                    label={hizb.label}
                    value={hizb.number.toString()}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ترتيب الأسئلة</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, mode === 'sequential' && styles.radioButtonActive]}
                onPress={() => setMode('sequential')}>
                <Text style={[styles.radioText, mode === 'sequential' && styles.radioTextActive]}>
                  متسلسل (حسب ترتيب المصحف)
                </Text>
                <View style={[styles.radio, mode === 'sequential' && styles.radioActive]}>
                  {mode === 'sequential' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.radioButton, mode === 'random' && styles.radioButtonActive]}
                onPress={() => setMode('random')}>
                <Text style={[styles.radioText, mode === 'random' && styles.radioTextActive]}>
                  عشوائي (بدون ترتيب)
                </Text>
                <View style={[styles.radio, mode === 'random' && styles.radioActive]}>
                  {mode === 'random' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pickerCard}>
            <Text style={styles.label}>
              عدد الأسئلة {mode === 'sequential' ? '(إجباري)' : '(اختياري)'}
            </Text>
            <TextInput
              style={styles.numberInput}
              keyboardType="numeric"
              value={questionCount}
              onChangeText={setQuestionCount}
              placeholder="أدخل عدد الأسئلة"
              placeholderTextColor={colors.textSecondary}
              textAlign="right"
            />
          </View>

          {mode === 'sequential' && (!questionCount || parseInt(questionCount) <= 0) && (
            <View style={styles.warningBox}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                يجب تحديد عدد الأسئلة عند اختيار الوضع المتسلسل
              </Text>
            </View>
          )}

          {selectedHizbData && (
            <View style={styles.hizbInfoCard}>
              <View style={styles.hizbInfoHeader}>
                <View style={styles.hizbNumberBadge}>
                  <Text style={styles.hizbNumberText}>{selectedHizbData.number}</Text>
                </View>
                <View style={styles.hizbNameContainer}>
                  <Text style={styles.hizbName}>{selectedHizbData.label}</Text>
                  <Text style={styles.hizbType}>من أحزاب القرآن الكريم</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.startButton, isButtonDisabled && styles.startButtonDisabled]}
            onPress={handleStartTest}
            activeOpacity={0.85}
            disabled={isButtonDisabled}>
            <Text style={styles.startButtonText}>
              {isButtonDisabled 
                ? (mode === 'sequential' && !questionCount ? 'حدد عدد الأسئلة أولاً' : 'اختر الحزب أولاً')
                : 'بدء الاختبار'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight },
  header: {
    backgroundColor: colors.primary, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30, shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 10,
    elevation: 8, flexDirection: 'row', alignItems: 'center',
  },
  backButton: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center', alignItems: 'center', marginLeft: 12,
  },
  backButtonText: { fontSize: 24, color: colors.textLight, fontWeight: 'bold' },
  headerContent: { flex: 1, alignItems: 'flex-end' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textLight, marginRight: 15 },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: 30 },
  content: { padding: 20 },
  instructionBox: {
    flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: colors.secondaryLight,
    padding: 16, borderRadius: 16, marginBottom: 24,
  },
  instructionText: {
    flex: 1, fontSize: 15, color: colors.textPrimary, textAlign: 'right', fontWeight: '500',
  },
  pickerCard: {
    backgroundColor: colors.bgWhite, borderRadius: 20, padding: 24, marginBottom: 20,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08,
    shadowRadius: 8, elevation: 4, borderWidth: 1, borderColor: colors.borderLight,
  },
  label: {
    fontSize: 17, fontWeight: '600', color: colors.primary, marginBottom: 16, textAlign: 'right',
  },
  pickerWrapper: { position: 'relative' },
  picker: { backgroundColor: colors.bgLight, borderRadius: 12, color: colors.textPrimary },
  pickerItem: { fontSize: 16, textAlign: 'right' },
  numberInput: {
    backgroundColor: colors.bgLight, borderRadius: 12, padding: 16, fontSize: 16,
    color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderLight,
  },
  section: {
    backgroundColor: colors.bgWhite, borderRadius: 20, padding: 24, marginBottom: 20,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08,
    shadowRadius: 8, elevation: 4, borderWidth: 1, borderColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 17, fontWeight: '600', color: colors.primary, marginBottom: 16, textAlign: 'right',
  },
  radioGroup: { gap: 12 },
  radioButton: {
    flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: colors.bgLight,
    borderRadius: 14, padding: 16, borderWidth: 2, borderColor: 'transparent',
  },
  radioButtonActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  radio: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.textSecondary,
    justifyContent: 'center', alignItems: 'center', marginLeft: 12,
  },
  radioActive: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  radioText: {
    flex: 1, fontSize: 16, color: colors.textPrimary, textAlign: 'right', fontWeight: '500',
  },
  radioTextActive: { color: colors.primary, fontWeight: '600' },
  warningBox: {
    flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#FFF3CD',
    padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1,
    borderColor: '#FFE69C', gap: 12,
  },
  warningIcon: { fontSize: 20 },
  warningText: {
    flex: 1, fontSize: 14, color: '#856404', textAlign: 'right', fontWeight: '600',
  },
  hizbInfoCard: {
    backgroundColor: colors.primaryLight, borderRadius: 20, padding: 20, marginBottom: 24,
    borderWidth: 2, borderColor: colors.secondary,
  },
  hizbInfoHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16 },
  hizbNumberBadge: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },
  hizbNumberText: { fontSize: 22, fontWeight: '700', color: colors.textLight },
  hizbNameContainer: { flex: 1, alignItems: 'flex-end' },
  hizbName: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  hizbType: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  startButton: {
    backgroundColor: colors.primary, paddingVertical: 18, paddingHorizontal: 32,
    borderRadius: 18, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6, alignItems: 'center', justifyContent: 'center',
  },
  startButtonDisabled: { backgroundColor: colors.textSecondary, shadowOpacity: 0, elevation: 0 },
  startButtonText: { fontSize: 20, fontWeight: '700', color: colors.textLight },
});

export default HizbSelectionScreen;