import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import colors from '../styles/colors';
import quranData from '../data/quranData';

const HizbSelectionScreen = ({ navigation }) => {
  const [selectedHizb, setSelectedHizb] = useState('');

  const handleStartTest = () => {
    if (!selectedHizb) {
      Alert.alert('تنبيه', 'الرجاء اختيار حزب');
      return;
    }

    navigation.navigate('Duaa', {
      testType: 'Hizb',
      hizbNumber: parseInt(selectedHizb),
    });
  };

  const hizbsList = Array.from({ length: 60 }, (_, i) => ({
    number: i + 1,
    label: `الحزب ${i + 1}`
  }));

  const selectedHizbData = selectedHizb
    ? hizbsList.find(h => h.number === parseInt(selectedHizb))
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>اختبار حسب الحزب</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              اختر الحزب الذي تريد اختبار حفظه
            </Text>
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
                <Picker.Item 
                  label="-- حزب --" 
                  value="" 
                  style={styles.pickerItem}
                />
                {hizbsList.map((hizb) => (
                  <Picker.Item
                    key={hizb.number}
                    label={hizb.label}
                    value={hizb.number.toString()}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
              <View style={styles.pickerUnderline} />
            </View>
          </View>

          {selectedHizbData && (
            <View style={styles.hizbInfoCard}>
              <View style={styles.hizbInfoHeader}>
                <View style={styles.hizbNumberBadge}>
                  <Text style={styles.hizbNumberText}>{selectedHizbData.number}</Text>
                </View>
                <View style={styles.hizbNameContainer}>
                  <Text style={styles.hizbName}>{selectedHizbData.label}</Text>
                  <Text style={styles.hizbType}>
                    من أحزاب القرآن الكريم
                  </Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.startButton,
              !selectedHizb && styles.startButtonDisabled
            ]}
            onPress={handleStartTest}
            activeOpacity={0.85}
            disabled={!selectedHizb}>
            <Text style={styles.startButtonText}>
              {selectedHizb ? 'بدء الاختبار' : 'اختر الحزب أولاً'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 30,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  backButtonText: {
    fontSize: 25,
    color: colors.textLight,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 4,
    marginTop: 35,
    marginRight: 15
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  instructionBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    fontWeight: '500',
  },
  pickerCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'right',
  },
  pickerWrapper: {
    position: 'relative',
  },
  picker: {
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    color: colors.textPrimary,
    writingDirection: 'rtl',
  },
  pickerItem: {
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  pickerUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.secondary,
    borderRadius: 1,
  },
  hizbInfoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  hizbInfoHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  hizbNumberBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  hizbNumberText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
  },
  hizbNameContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  hizbName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  hizbType: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  startButtonDisabled: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
  },
});

export default HizbSelectionScreen;