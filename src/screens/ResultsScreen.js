// src/screens/ResultsScreen.js
// Écran des résultats - Version compacte et optimisée

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

const ResultsScreen = ({ navigation, route }) => {
  const { score, errors } = route.params;

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
        emoji: '📚',
      };
    }
  };

  const result = getMessage();

  const handleBackToMain = () => {
    navigation.navigate('Main');
  };

  const handleRestartTest = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      {/* Header - COMPACT */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>نتائج الاختبار</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Emoji & Result - COMPACT */}
        <View style={styles.resultHeader}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{result.emoji}</Text>
          </View>
          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
        </View>

        {/* Percentage Circle - REDUCED */}
        <View style={styles.percentageCircle}>
          <Text style={styles.percentageValue}>{percentage}%</Text>
        </View>

        {/* Stats Cards - COMPACT */}
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

        {/* Quote - COMPACT */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            ﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ ﴾
          </Text>
          <Text style={styles.quoteReference}>القمر - 17</Text>
        </View>

        {/* Buttons - COMPACT */}
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
  
  // HEADER - COMPACT
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  
  // RESULT HEADER - COMPACT
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emojiCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.bgWhite,
    borderWidth: 3,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  emoji: {
    fontSize: 36,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  resultMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // PERCENTAGE - REDUCED
  percentageCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.bgWhite,
    borderWidth: 6,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  percentageValue: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.secondary,
  },
  
  // STATS - COMPACT
  statsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
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
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
  },
  statContent: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
  },
  
  // QUOTE - COMPACT
  quoteCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderTopWidth: 3,
    borderTopColor: colors.secondary,
  },
  quoteText: {
    fontSize: 17,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
    fontWeight: '600',
  },
  quoteReference: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // BUTTONS - COMPACT
  buttonsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.bgWhite,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
});

export default ResultsScreen;