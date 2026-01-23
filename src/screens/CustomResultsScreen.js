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

const CustomResultsScreen = ({ navigation, route }) => {
  const {
    score,
    errors,
    totalQuestions,
    duration,
    sourceType,
    selectedSurahs,
    pageRanges,
    selectedHizbs,
    mode,
    versesToRead,
  } = route.params;

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}س ${mins}د ${secs}ث`;
    } else if (mins > 0) {
      return `${mins}د ${secs}ث`;
    } else {
      return `${secs}ث`;
    }
  };

  const getSourceDescription = () => {
    if (sourceType === 'surahs') {
      if (selectedSurahs.length === 1) {
        return `سورة واحدة`;
      }
      return `${selectedSurahs.length} سور`;
    } else if (sourceType === 'pages') {
      const totalPages = pageRanges.reduce((sum, range) => {
        return sum + (parseInt(range.to) - parseInt(range.from) + 1);
      }, 0);
      return `${totalPages} صفحة في ${pageRanges.length} نطاق`;
    } else if (sourceType === 'hizbs') {
      if (selectedHizbs.length === 1) {
        return `حزب واحد`;
      }
      return `${selectedHizbs.length} أحزاب`;
    }
    return '';
  };

  const getModeDescription = () => {
    return mode === 'sequential' ? 'متسلسل' : 'عشوائي';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) {
      return {
        emoji: '🌟',
        title: 'ممتاز!',
        message: 'أداء رائع! حفظك متقن بإذن الله',
        color: colors.success,
      };
    } else if (percentage >= 70) {
      return {
        emoji: '👍',
        title: 'جيد جداً!',
        message: 'أداء جيد، استمر في المراجعة',
        color: colors.primary,
      };
    } else if (percentage >= 50) {
      return {
        emoji: '📖',
        title: 'جيد',
        message: 'تحتاج المزيد من المراجعة',
        color: colors.secondary,
      };
    } else {
      return {
        emoji: '💪',
        title: 'استمر!',
        message: 'راجع حفظك وحاول مرة أخرى',
        color: colors.error,
      };
    }
  };

  const performance = getPerformanceMessage();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>نتيجة الاختبار المخصص</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Performance Card */}
        <View style={[styles.performanceCard, { borderTopColor: performance.color }]}>
          <Text style={styles.performanceEmoji}>{performance.emoji}</Text>
          <Text style={[styles.performanceTitle, { color: performance.color }]}>
            {performance.title}
          </Text>
          <Text style={styles.performanceMessage}>{performance.message}</Text>
          
          <View style={styles.percentageCircle}>
            <Text style={[styles.percentageText, { color: performance.color }]}>
              {percentage}%
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.successLight }]}>
              <Text style={styles.statIconText}>✓</Text>
            </View>
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>إجابات صحيحة</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.errorLight }]}>
              <Text style={styles.statIconText}>✗</Text>
            </View>
            <Text style={styles.statValue}>{errors}</Text>
            <Text style={styles.statLabel}>أخطاء</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.secondaryLight }]}>
              <Text style={styles.statIconText}>📝</Text>
            </View>
            <Text style={styles.statValue}>{totalQuestions}</Text>
            <Text style={styles.statLabel}>مجموع الأسئلة</Text>
          </View>
        </View>

        {/* Time Card */}
        <View style={styles.timeCard}>
          <View style={styles.timeIcon}>
            <Text style={styles.timeIconText}>⏱</Text>
          </View>
          <View style={styles.timeContent}>
            <Text style={styles.timeLabel}>مدة الاختبار</Text>
            <Text style={styles.timeValue}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Test Parameters */}
        <View style={styles.parametersCard}>
          <Text style={styles.parametersTitle}>معلومات الاختبار</Text>
          
          <View style={styles.parameterRow}>
            <Text style={styles.parameterValue}>{getSourceDescription()}</Text>
            <Text style={styles.parameterLabel}>المصدر:</Text>
          </View>

          <View style={styles.parameterDivider} />

          <View style={styles.parameterRow}>
            <Text style={styles.parameterValue}>{getModeDescription()}</Text>
            <Text style={styles.parameterLabel}>النمط:</Text>
          </View>

          <View style={styles.parameterDivider} />

          <View style={styles.parameterRow}>
            <Text style={styles.parameterValue}>{versesToRead} آيات</Text>
            <Text style={styles.parameterLabel}>عدد الآيات للقراءة:</Text>
          </View>

          {sourceType === 'surahs' && selectedSurahs.length <= 5 && (
            <>
              <View style={styles.parameterDivider} />
              <View style={styles.parameterDetails}>
                <Text style={styles.parameterLabel}>السور المختارة:</Text>
                <View style={styles.detailsList}>
                  {selectedSurahs.map((surahNum, index) => (
                    <Text key={surahNum} style={styles.detailItem}>
                      • سورة رقم {surahNum}
                    </Text>
                  ))}
                </View>
              </View>
            </>
          )}

          {sourceType === 'pages' && (
            <>
              <View style={styles.parameterDivider} />
              <View style={styles.parameterDetails}>
                <Text style={styles.parameterLabel}>نطاقات الصفحات:</Text>
                <View style={styles.detailsList}>
                  {pageRanges.map((range, index) => (
                    <Text key={index} style={styles.detailItem}>
                      • من {range.from} إلى {range.to}
                    </Text>
                  ))}
                </View>
              </View>
            </>
          )}

          {sourceType === 'hizbs' && selectedHizbs.length <= 5 && (
            <>
              <View style={styles.parameterDivider} />
              <View style={styles.parameterDetails}>
                <Text style={styles.parameterLabel}>الأحزاب المختارة:</Text>
                <View style={styles.detailsList}>
                  {selectedHizbs.map((hizbNum, index) => (
                    <Text key={hizbNum} style={styles.detailItem}>
                      • حزب {hizbNum}
                    </Text>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.navigate('CustomTestSetup')}
            activeOpacity={0.85}>
            <Text style={styles.retryButtonText}>اختبار مخصص جديد</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.85}>
            <Text style={styles.homeButtonText}>العودة للرئيسية</Text>
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
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 35,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },

  performanceCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderTopWidth: 6,
  },
  performanceEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  performanceTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  performanceMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  percentageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
  },
  percentageText: {
    fontSize: 36,
    fontWeight: '700',
  },

  statsContainer: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  timeCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  timeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeIconText: {
    fontSize: 28,
  },
  timeContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },

  parametersCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  parametersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'right',
  },
  parameterRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  parameterLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  parameterValue: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  parameterDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },
  parameterDetails: {
    paddingTop: 8,
  },
  detailsList: {
    marginTop: 8,
    gap: 6,
  },
  detailItem: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    paddingRight: 8,
  },

  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: colors.bgLight,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
});

export default CustomResultsScreen;