import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import colors from '../styles/colors';

const PageSelectionScreen = ({ navigation }) => {
  const [pageFrom, setPageFrom] = useState('');
  const [pageTo, setPageTo] = useState('');

  const handleStartTest = () => {
    const from = parseInt(pageFrom);
    const to = parseInt(pageTo);

    if (!pageFrom || !pageTo) {
      Alert.alert('تنبيه', 'الرجاء إدخال نطاق الصفحات');
      return;
    }

    if (from < 1 || from > 604 || to < 1 || to > 604) {
      Alert.alert('خطأ', 'يجب أن تكون الصفحات بين 1 و 604');
      return;
    }

    if (from > to) {
      Alert.alert('خطأ', 'رقم الصفحة الأولى يجب أن يكون أقل من أو يساوي رقم الصفحة الأخيرة');
      return;
    }

    navigation.navigate('Duaa', {
      testType: 'pages',
      pageFrom: from,
      pageTo: to,
    });
  };

  const isValid = pageFrom && pageTo && 
    parseInt(pageFrom) >= 1 && parseInt(pageFrom) <= 604 &&
    parseInt(pageTo) >= 1 && parseInt(pageTo) <= 604 &&
    parseInt(pageFrom) <= parseInt(pageTo);

  const pageCount = isValid ? parseInt(pageTo) - parseInt(pageFrom) + 1 : 0;

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
          <Text style={styles.headerTitle}>مواضع في صفحات معينة</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        <View style={styles.content}>
          {/* Instruction */}
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              أدخل نطاق الصفحات التي تريد اختبار حفظها
            </Text>
          </View>

          <View style={styles.inputCard}>
            
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}> من الصفحة</Text>
              <View style={styles.separatorLine} />
            </View>
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={pageFrom}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    setPageFrom(cleaned);
                  }}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={3}
                  returnKeyType="next"
                />
                <View style={styles.inputUnderline} />
              </View>
            </View>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}> إلى الصفحة</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={pageTo}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    setPageTo(cleaned);
                  }}
                  keyboardType="number-pad"
                  placeholder="--"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={3}
                  returnKeyType="done"
                  onSubmitEditing={handleStartTest}
                />
                <View style={styles.inputUnderline} />
              </View>
            </View>
          </View>

          {isValid && (
            <View style={styles.rangeInfoCard}>  
              <View style={styles.pageCountBox}>
                <Text style={styles.pageCountLabel}>عدد الصفحات:</Text>
                <Text style={styles.pageCountValue}>{pageCount}</Text>
              </View>
            </View>
          )}

          <View style={styles.helpBox}>
            <Text style={styles.helpIcon}>ℹ️</Text>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>معلومة</Text>
              <Text style={styles.helpText}>
                القرآن الكريم يحتوي على 604 صفحات في مصحف المدينة النبوية
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.startButton,
              !isValid && styles.startButtonDisabled
            ]}
            onPress={handleStartTest}
            activeOpacity={0.85}
            disabled={!isValid}>
            <Text style={styles.startButtonText}>
              {isValid ? 'بدء الاختبار' : 'أدخل نطاق الصفحات'}
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 30
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
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
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
  instructionIcon: {
    fontSize: 24,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    fontWeight: '500',
  },
  inputCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',

  },
  inputGroup: {
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.bgLight,
    borderRadius: 14,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '700',
  },
  inputUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rangeInfoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  rangeInfoHeader: {
    marginBottom: 16,
  },
  rangeInfoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  rangeStats: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgWhite,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  rangeStat: {
    alignItems: 'center',
    flex: 1,
  },
  rangeStatLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  rangeStatValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  rangeStatArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeStatArrowText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  pageCountBox: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pageCountLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pageCountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary,
  },
  helpBox: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.bgWhite,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  helpIcon: {
    fontSize: 20,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'right',
  },
  helpText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 20,
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
  startButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonIconText: {
    fontSize: 18,
    color: colors.textLight,
    fontWeight: 'bold',
  },
});

export default PageSelectionScreen;