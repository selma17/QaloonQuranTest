import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import colors from '../styles/colors';
import { wp, hp, fp, SPACING, FONT_SIZES, RADIUS } from '../utils/responsive';

const ResultsScreen = ({ navigation, route }) => {
  const { 
    score, 
    errors,
    testType, 
    surahNumber, 
    pageFrom, 
    pageTo,
    hizbNumber,
    questionCount,
    selectionMode,
  } = route.params;

  const total = score + errors;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getMessage = () => {
    if (percentage >= 90) {
      return {
        title: 'ممتاز',
        message: 'بارك الله فيك',
        emoji: '🌟',
      };
    } else if (percentage >= 75) {
      return {
        title: 'جيد جداً',
        message: 'واصل بإذن الله',
        emoji: '⭐',
      };
    } else if (percentage >= 60) {
      return {
        title: 'جيد',
        message: 'استمر في المراجعة',
        emoji: '✨',
      };
    } else {
      return {
        title: 'راجع حفظك',
        message: 'بالمثابرة ستصل للإتقان',
        emoji: '❤️',
      };
    }
  };

  const result = getMessage();

  const handleBackToMain = () => {
    navigation.navigate('Main');
  };

  const handleRestartTest = () => {
    // Retourner à DuaaScreen avec tous les paramètres pour relancer le même test
    navigation.navigate('Duaa', {
      testType,
      surahNumber,
      pageFrom,
      pageTo,
      hizbNumber,
      questionCount,
      selectionMode,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>نتائج الاختبار</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.resultHeader}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{result.emoji}</Text>
          </View>
          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
        </View>

        <View style={styles.percentageCircle}>
          <Text style={styles.percentageValue}>{percentage}%</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardSuccess]}>
            <Text style={styles.statIcon}>✓</Text>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>صحيحة</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.statCardError]}>
            <Text style={styles.statIcon}>✗</Text>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>أخطاء</Text>
              <Text style={styles.statValue}>{errors}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>#</Text>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>المجموع</Text>
              <Text style={styles.statValue}>{total}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            ﴿ وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ﴾
          </Text>
          <Text style={styles.quoteReference}>الإسراء - 82</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleBackToMain}
            activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>العودة للقائمة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRestartTest}
            activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>إعادة الاختبار</Text>
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
    paddingTop: hp(20),
    paddingBottom: hp(20),
    paddingHorizontal: wp(20),
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(4) },
    shadowOpacity: 0.12,
    shadowRadius: wp(8),
    elevation: 6,
  },
  headerTitle: {
    fontSize: fp(22),
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
    marginTop: hp(20)
  },
  
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: hp(20),
  },
  
  resultHeader: {
    alignItems: 'center',
    marginBottom: hp(20),
  },
  emojiCircle: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(35),
    backgroundColor: colors.bgWhite,
    borderWidth: 3,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(12),
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: wp(6),
    elevation: 4,
  },
  emoji: {
    fontSize: fp(30),
  },
  resultTitle: {
    fontSize: fp(36),
    fontWeight: '700',
    color: colors.primary,
    marginBottom: hp(6),
  },
  resultMessage: {
    fontSize: fp(15),
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  percentageCircle: {
    width: wp(120),
    height: wp(120),
    borderRadius: wp(70),
    backgroundColor: colors.bgWhite,
    borderWidth: 6,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: hp(20),
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: hp(4) },
    shadowOpacity: 0.25,
    shadowRadius: wp(8),
    elevation: 5,
  },
  percentageValue: {
    fontSize: fp(35),
    fontWeight: '800',
    color: colors.secondary,
  },
  
  statsContainer: {
    gap: hp(12),
    marginBottom: hp(20),
  },
  statCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: wp(16),
    padding: wp(16),
    flexDirection: 'row-reverse',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.06,
    shadowRadius: wp(4),
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 14,
  },
  statCardSuccess: {
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  statCardError: {
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  statIcon: {
    fontSize: fp(20),
    color: colors.primary,
    fontWeight: 'bold',
    width: wp(32),
    textAlign: 'center',
  },
  statContent: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: fp(15),
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fp(26),
    fontWeight: '700',
    color: colors.primary,
  },
  
  quoteCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: wp(16),
    padding: 18,
    marginBottom: hp(20),
    borderTopWidth: 3,
    borderTopColor: colors.secondary,
  },
  quoteText: {
    fontSize: fp(17),
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: hp(8),
    fontWeight: '600',
  },
  quoteReference: {
    fontSize: fp(12),
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  buttonsContainer: {
    gap: hp(12),
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(16),
    borderRadius: wp(16),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(3) },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: fp(18),
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.bgWhite,
    paddingVertical: hp(14),
    borderRadius: wp(14),
    borderWidth: wp(2),
    borderColor: colors.primary,
    marginBottom: hp(20)
  },
  secondaryButtonText: {
    fontSize: fp(16),
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
});

export default ResultsScreen;