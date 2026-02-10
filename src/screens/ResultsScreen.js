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
        
        <View style={styles.resultCard}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{result.emoji}</Text>
          </View>
          
          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
          
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageValue}>{percentage}%</Text>
          </View>
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
    fontSize: fp(30),
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
  
  resultCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: wp(24),
    padding: wp(32),
    marginBottom: hp(24),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(8) },
    shadowOpacity: 0.2,
    shadowRadius: wp(16),
    elevation: 10,
    alignItems: 'center',
    borderTopWidth: 5,
    borderTopColor: colors.secondary,
  },
  emojiContainer: {
    width: wp(100),
    height: wp(100),
    borderRadius: wp(50),
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(20),
    borderWidth: 4,
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: hp(4) },
    shadowOpacity: 0.25,
    shadowRadius: wp(10),
    elevation: 6,
  },
  emoji: {
    fontSize: fp(48),
  },
  resultTitle: {
    fontSize: fp(44),
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: hp(10),
  },
  resultMessage: {
    fontSize: fp(20),
    color: colors.textSecondary,
    marginBottom: hp(24),
    textAlign: 'center',
    fontWeight: '600',
  },
  
  percentageBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: wp(48),
    paddingVertical: hp(18),
    borderRadius: wp(25),
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: hp(6) },
    shadowOpacity: 0.35,
    shadowRadius: wp(12),
    elevation: 8,
    minWidth: wp(160),
    alignItems: 'center',
  },
  percentageValue: {
    fontSize: fp(52),
    fontWeight: '900',
    color: colors.textLight,
    letterSpacing: -2,
  },
  
  statsContainer: {
    gap: hp(10),
    marginBottom: hp(20),
  },
  statCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: wp(16),
    padding: wp(10),
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