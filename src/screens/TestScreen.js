import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import colors from '../styles/colors';
import quranData from '../data/quranData';
import { wp, hp, fp, SPACING, FONT_SIZES, RADIUS } from '../utils/responsive';

const TestScreen = ({ navigation, route }) => {
  const { testType, surahNumber, pageFrom, pageTo, hizbNumber } = route.params;

  const [currentVerse, setCurrentVerse] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usedVerses, setUsedVerses] = useState(new Set());

  const loadRandomVerse = React.useCallback(() => {
  setLoading(true);
  
  try {
    let verses = [];
    
    // Récupérer tous les versets disponibles
    if (testType === 'surah') {
      verses = quranData.versesDetailed[surahNumber] || [];
    } else if (testType === 'pages') {
      for (let page = pageFrom; page <= pageTo; page++) {
        const pageVerses = quranData.getVersesByPage(page) || [];
        verses.push(...pageVerses);
      }
    } else if (testType === 'Hizb') {
      verses = quranData.getVersesByHizb(hizbNumber) || [];
    }

    // Filtrer avec l'état actuel
    setUsedVerses(currentUsed => {
      const availableVerses = verses.filter(v => {
        const verseKey = `${v.surahNumber || surahNumber}-${v.number || v.verseNumber}`;
        return !currentUsed.has(verseKey);
      });

      // Si tous vus, réinitialiser
      let versesToChooseFrom = availableVerses.length > 0 ? availableVerses : verses;
      let shouldReset = availableVerses.length === 0;

      // Sélection aléatoire
      const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
        ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
        : Math.random();
      
      const randomIndex = Math.floor(randomValue * versesToChooseFrom.length);
      const selectedVerse = versesToChooseFrom[randomIndex];

      if (selectedVerse) {
        const verseKey = `${selectedVerse.surahNumber || surahNumber}-${selectedVerse.number || selectedVerse.verseNumber}`;
        
        setCurrentVerse({
          surahNumber: selectedVerse.surahNumber || surahNumber,
          surahName: selectedVerse.surahName || quranData.getSurahName(selectedVerse.surahNumber || surahNumber),
          verseNumber: selectedVerse.number || selectedVerse.verseNumber,
          text: selectedVerse.text,
          page: selectedVerse.page,
          juz: selectedVerse.juz,
        });

        // Retourner le nouveau Set
        if (shouldReset) {
          return new Set([verseKey]);
        } else {
          const newSet = new Set(currentUsed);
          newSet.add(verseKey);
          return newSet;
        }
      } else {
        Alert.alert('خطأ', 'لم يتم العثور على آيات');
        return currentUsed;
      }
    });
    
    setLoading(false);
  } catch (error) {
    console.error('Erreur:', error);
    Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الآية');
    setLoading(false);
  }
}, [testType, surahNumber, pageFrom, pageTo, hizbNumber]);

  useEffect(() => {
    loadRandomVerse();
  }, [loadRandomVerse]);

  const handlePreviousVerse = () => {
    if (!currentVerse) return;

    const verses = quranData.versesDetailed[currentVerse.surahNumber];
    if (!verses) return;

    const currentIndex = verses.findIndex(v => v.number === currentVerse.verseNumber);
    
    if (currentIndex > 0) {
      const prevVerse = verses[currentIndex - 1];
      setCurrentVerse({
        surahNumber: currentVerse.surahNumber,
        surahName: currentVerse.surahName,
        verseNumber: prevVerse.number,
        text: prevVerse.text,
        page: prevVerse.page,
        juz: prevVerse.juz,
      });
    } else {
      // Logique pour passer à la sourate précédente
      if (testType === 'pages') {
        const surahs = quranData.getSurahsByPageRange(pageFrom, pageTo);
        const currentSurahIndex = surahs.indexOf(currentVerse.surahNumber);
        
        if (currentSurahIndex > 0) {
          const prevSurahNumber = surahs[currentSurahIndex - 1];
          const prevSurahVerses = quranData.versesDetailed[prevSurahNumber];
          
          if (prevSurahVerses && prevSurahVerses.length > 0) {
            const lastVerse = prevSurahVerses[prevSurahVerses.length - 1];
            setCurrentVerse({
              surahNumber: prevSurahNumber,
              surahName: quranData.getSurahName(prevSurahNumber),
              verseNumber: lastVerse.number,
              text: lastVerse.text,
              page: lastVerse.page,
              juz: lastVerse.juz,
            });
          }
        } else {
          Alert.alert('تنبيه', 'هذه هي الآية الأولى في النطاق المحدد');
        }
      } else if (testType === 'Hizb') {
        const hizbVerses = quranData.getVersesByHizb(hizbNumber);
        if (hizbVerses && hizbVerses.length > 0) {
          const firstVerse = hizbVerses[0];
          if (currentVerse.surahNumber === firstVerse.surahNumber && 
              currentVerse.verseNumber === firstVerse.verseNumber) {
            Alert.alert('تنبيه', 'هذه هي الآية الأولى في الحزب');
          }
        }
      } else {
        Alert.alert('تنبيه', 'هذه هي الآية الأولى في السورة');
      }
    }
  };

  const handleNextVerse = () => {
    if (!currentVerse) return;

    const verses = quranData.versesDetailed[currentVerse.surahNumber];
    if (!verses) return;

    const currentIndex = verses.findIndex(v => v.number === currentVerse.verseNumber);
    
    if (currentIndex < verses.length - 1) {
      const nextVerse = verses[currentIndex + 1];
      setCurrentVerse({
        surahNumber: currentVerse.surahNumber,
        surahName: currentVerse.surahName,
        verseNumber: nextVerse.number,
        text: nextVerse.text,
        page: nextVerse.page,
        juz: nextVerse.juz,
      });
    } else {
      // Logique pour passer à la sourate suivante
      if (testType === 'pages') {
        const surahs = quranData.getSurahsByPageRange(pageFrom, pageTo);
        const currentSurahIndex = surahs.indexOf(currentVerse.surahNumber);
        
        if (currentSurahIndex < surahs.length - 1) {
          const nextSurahNumber = surahs[currentSurahIndex + 1];
          const nextSurahVerses = quranData.versesDetailed[nextSurahNumber];
          
          if (nextSurahVerses && nextSurahVerses.length > 0) {
            const firstVerse = nextSurahVerses[0];
            setCurrentVerse({
              surahNumber: nextSurahNumber,
              surahName: quranData.getSurahName(nextSurahNumber),
              verseNumber: firstVerse.number,
              text: firstVerse.text,
              page: firstVerse.page,
              juz: firstVerse.juz,
            });
          }
        } else {
          Alert.alert('تنبيه', 'هذه هي الآية الأخيرة في النطاق المحدد');
        }
      } else if (testType === 'Hizb') {
        const hizbVerses = quranData.getVersesByHizb(hizbNumber);
        if (hizbVerses && hizbVerses.length > 0) {
          const lastVerse = hizbVerses[hizbVerses.length - 1];
          if (currentVerse.surahNumber === lastVerse.surahNumber && 
              currentVerse.verseNumber === lastVerse.verseNumber) {
            Alert.alert('تنبيه', 'هذه هي الآية الأخيرة في الحزب');
          }
        }
      } else {
        Alert.alert('تنبيه', 'هذه هي الآية الأخيرة في السورة');
      }
    }
  };

  const handleNewQuestion = () => {
    setShowCorrectModal(true);
  };

  const handleAnswerCorrect = (isCorrect) => {
    setShowCorrectModal(false);
    
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setErrors(errors + 1);
    }
    
    setQuestionNumber(questionNumber + 1);
    loadRandomVerse();
  };

  const handleQuit = () => {
    setShowQuitModal(false);
    
    navigation.navigate('Results', {
      score,
      errors,
      totalQuestions: questionNumber - 1,
      testType,
      surahNumber,
      pageFrom,
      pageTo,
      hizbNumber,
    });
  };

  if (loading || !currentVerse) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل السؤال...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowQuitModal(true)}>
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>اختبار القرآن</Text>
        </View>
      </View>

      <View style={styles.scoreBar}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{errors}</Text>
          <Text style={styles.scoreLabel}>✗</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>✓</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.questionInfo}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionNumber}>{questionNumber}</Text>
          </View>
          <View style={styles.questionTextContainer}>
            <Text style={styles.surahName}>سورة {currentVerse.surahName}</Text>
            <Text style={styles.instructionText}>
              اقرأ من قوله تعالى (آية {currentVerse.verseNumber}):
            </Text>
          </View>
        </View>

        <View style={styles.bismillahBox}>
          <Text style={styles.bismillah}>﷽</Text>
        </View>

        <View style={styles.verseCard}>
          <View style={styles.verseOrnament} />
          <ScrollView 
            style={styles.verseScrollView}
            contentContainerStyle={styles.verseScrollContent}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}>
            <Text style={styles.verseText}>{currentVerse.text}</Text>
          </ScrollView>
          <View style={styles.verseOrnament} />
          
          <View style={styles.verseMetadata}>
            <Text style={styles.metadataText}>
              صفحة {currentVerse.page} • جزء {currentVerse.juz}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handlePreviousVerse}
            activeOpacity={0.8}>
            <Text style={styles.controlButtonText}>السابقة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleNextVerse}
            activeOpacity={0.8}>
            <Text style={styles.controlButtonText}>التالية</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.newQuestionButton}
          onPress={handleNewQuestion}
          activeOpacity={0.85}>
          <Text style={styles.newQuestionButtonText}>سؤال جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quitButton}
          onPress={() => setShowQuitModal(true)}
          activeOpacity={0.8}>
          <Text style={styles.quitButtonText}>إنهاء</Text>
        </TouchableOpacity>
      </View>

      {/* Modal: Answer Correct */}
      <Modal
        visible={showCorrectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCorrectModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تقييم الإجابة</Text>
            <Text style={styles.modalText}>هل قرأت الآيات بشكل صحيح؟</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSuccess]}
                onPress={() => handleAnswerCorrect(true)}
                activeOpacity={0.85}>
                <Text style={styles.modalButtonText}>✓ نعم</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonError]}
                onPress={() => handleAnswerCorrect(false)}
                activeOpacity={0.85}>
                <Text style={styles.modalButtonText}>✗ لا</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Quit Confirmation */}
      <Modal
        visible={showQuitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuitModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تأكيد الخروج</Text>
            <Text style={styles.modalText}>
              هل تريد إنهاء الاختبار؟
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setShowQuitModal(false)}
                activeOpacity={0.85}>
                <Text style={styles.modalButtonText}>متابعة</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleQuit}
                activeOpacity={0.85}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                  إنهاء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: colors.textSecondary,
  },
  
  
  header: {
    backgroundColor: colors.primary,
    paddingVertical: hp(12),
    paddingHorizontal: wp(16),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.1,
    shadowRadius: wp(4),
    elevation: 3,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  backButton: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(10),
    marginTop: hp(15),
  },
  backButtonText: {
    fontSize: fp(18),
    color: colors.textLight,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: hp(25),
    marginRight: wp(15),
  },
  
  // SCORE BAR
  scoreBar: {
    backgroundColor: colors.bgWhite,
    flexDirection: 'row-reverse',
    paddingVertical: hp(10),
    paddingHorizontal: wp(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: FONT_SIZES.md,
    color: colors.textSecondary,
  },
  scoreDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: wp(16),
  },
  
  // MAIN CONTENT
  mainContent: {
    flex: 1,
    padding: SPACING.md,
  },
  
  // QUESTION INFO
  questionInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: hp(12),
    gap: wp(10),
  },
  questionBadge: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: colors.textLight,
  },
  questionTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahName: {
    fontSize: FONT_SIZES.surahName,
    fontWeight: '600',
    color: colors.primary,
  },
  instructionText: {
    fontSize: FONT_SIZES.sm,
    color: colors.textSecondary,
  },
  
  // BISMILLAH
  bismillahBox: {
    backgroundColor: colors.bgWhite,
    padding: hp(12),
    borderRadius: RADIUS.md,
    marginBottom: hp(12),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bismillah: {
    fontSize: FONT_SIZES.lg,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // VERSE CARD
  verseCard: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: RADIUS.xl,
    paddingVertical: hp(16),
    paddingHorizontal: wp(20),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(4) },
    shadowOpacity: 0.1,
    shadowRadius: wp(8),
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  verseOrnament: {
    width: wp(50),
    height: 2,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: hp(8),
  },
  verseScrollView: {
    flex: 1,
  },
  verseScrollContent: {
    paddingVertical: hp(8),
  },
  verseText: {
    fontSize: FONT_SIZES.verse,
    lineHeight: fp(42),
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  verseMetadata: {
    marginTop: hp(8),
    paddingTop: hp(8),
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metadataText: {
    fontSize: FONT_SIZES.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // CONTROLS
  controlsContainer: {
    backgroundColor: colors.bgWhite,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: hp(10),
  },
  controlsRow: {
    flexDirection: 'row-reverse',
    gap: wp(10),
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.bgLight,
    paddingVertical: hp(12),
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  newQuestionButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(14),
    borderRadius: RADIUS.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.25,
    shadowRadius: wp(4),
    elevation: 3,
  },
  newQuestionButtonText: {
    fontSize: FONT_SIZES.buttonText,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: colors.bgLight,
    paddingVertical: hp(12),
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: colors.error,
  },
  quitButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
  },
  
  // MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: colors.bgWhite,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: wp(360),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(6) },
    shadowOpacity: 0.3,
    shadowRadius: wp(12),
    elevation: 10,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: hp(16),
  },
  modalText: {
    fontSize: FONT_SIZES.md,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: hp(24),
    lineHeight: fp(26),
  },
  modalButtons: {
    gap: hp(10),
  },
  modalButton: {
    paddingVertical: hp(14),
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.bgLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalButtonSuccess: {
    backgroundColor: colors.success,
  },
  modalButtonError: {
    backgroundColor: colors.error,
  },
  modalButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: colors.textLight,
  },
  modalButtonTextSecondary: {
    color: colors.primary,
  },
});

export default TestScreen;