import React, { useState, useEffect, useRef } from 'react';
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

const CustomTestScreen = ({ navigation, route }) => {
  const {
    sourceType,
    selectedSurahs,
    pageRanges,
    selectedHizbs,
    questionCount,
    mode,
    versesToRead,
  } = route.params;

  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [versesReadCount, setVersesReadCount] = useState(1);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef(null);

  // Chronomètre
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime]);

  // Formater le temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Récupérer tous les versets des sources sélectionnées
  const getAllVersesFromSources = () => {
    let allVerses = [];

    if (sourceType === 'surahs') {
      selectedSurahs.forEach(surahNum => {
        const verses = quranData.versesDetailed[surahNum] || [];
        verses.forEach(verse => {
          allVerses.push({
            surahNumber: surahNum,
            surahName: quranData.getSurahName(surahNum),
            verseNumber: verse.number,
            text: verse.text,
            page: verse.page,
            juz: verse.juz,
          });
        });
      });
    } else if (sourceType === 'pages') {
      pageRanges.forEach(range => {
        const from = parseInt(range.from);
        const to = parseInt(range.to);
        for (let page = from; page <= to; page++) {
          const pageVerses = quranData.getVersesByPage(page) || [];
          pageVerses.forEach(verse => {
            allVerses.push({
              surahNumber: verse.surahNumber,
              surahName: verse.surahName,
              verseNumber: verse.verseNumber,
              text: verse.text,
              page: verse.page || page,
              juz: verse.juz,
            });
          });
        }
      });
    } else if (sourceType === 'hizbs') {
      selectedHizbs.forEach(hizbNum => {
        const hizbVerses = quranData.getVersesByHizb(hizbNum) || [];
        hizbVerses.forEach(verse => {
          allVerses.push({
            surahNumber: verse.surahNumber,
            surahName: verse.surahName,
            verseNumber: verse.verseNumber,
            text: verse.text,
            page: verse.page,
            juz: verse.juz,
          });
        });
      });
    }

    return allVerses;
  };

  // Générer les questions
  useEffect(() => {
    const generateQuestions = () => {
      const allVerses = getAllVersesFromSources();

      if (allVerses.length === 0) {
        Alert.alert('خطأ', 'لم يتم العثور على آيات');
        navigation.goBack();
        return;
      }

      let questions = [];

      if (mode === 'sequential') {
        // Mode séquentiel : trier puis sélectionner des points de départ aléatoires
        allVerses.sort((a, b) => {
          if (a.surahNumber !== b.surahNumber) {
            return a.surahNumber - b.surahNumber;
          }
          return a.verseNumber - b.verseNumber;
        });

        // Sélectionner N points de départ aléatoires, mais triés
        const possibleStarts = [];
        for (let i = 0; i < allVerses.length - versesToRead + 1; i++) {
          possibleStarts.push(i);
        }

        // Shuffle les indices
        const shuffled = [...possibleStarts];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Prendre les N premiers et les trier
        const selectedIndices = shuffled.slice(0, Math.min(questionCount, shuffled.length)).sort((a, b) => a - b);

        questions = selectedIndices.map(index => allVerses[index]);

      } else {
        // Mode random : complètement aléatoire
        const shuffled = [...allVerses];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        questions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
      }

      setAllQuestions(questions);
      if (questions.length > 0) {
        setCurrentVerse(questions[0]);
      }
      setLoading(false);
    };

    generateQuestions();
  }, []);

  const handleNextVerse = () => {
    if (!currentVerse) return;

    if (versesReadCount >= versesToRead) {
      Alert.alert('تنبيه', 'لقد أنهيت قراءة الآيات المطلوبة. انتقل للسؤال التالي');
      return;
    }

    // Trouver le verset suivant dans la même sourate
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
      setVersesReadCount(versesReadCount + 1);
    } else {
      Alert.alert('تنبيه', 'هذه هي الآية الأخيرة في السورة');
    }
  };

  const handleNextQuestion = () => {
    if (versesReadCount < versesToRead) {
      Alert.alert('تنبيه', `يجب قراءة ${versesToRead} آيات قبل الانتقال للسؤال التالي`);
      return;
    }

    // Marquer comme réponse صحيحة
    setScore(score + 1);

    // Passer à la question suivante
    if (currentQuestionIndex < allQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentVerse(allQuestions[nextIndex]);
      setVersesReadCount(1);
    } else {
      // Fin du test
      handleFinishTest();
    }
  };

  const handleSkipQuestion = () => {
    // Compter comme erreur si pas terminé
    if (versesReadCount < versesToRead) {
      setErrors(errors + 1);
    } else {
      setScore(score + 1);
    }

    // Passer à la question suivante
    if (currentQuestionIndex < allQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentVerse(allQuestions[nextIndex]);
      setVersesReadCount(1);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    navigation.navigate('CustomResults', {
      score,
      errors,
      totalQuestions: allQuestions.length,
      duration: elapsedTime,
      sourceType,
      selectedSurahs,
      pageRanges,
      selectedHizbs,
      mode,
      versesToRead,
    });
  };

  const handleQuit = () => {
    setShowQuitModal(false);
    handleFinishTest();
  };

  if (loading || !currentVerse) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل الاختبار...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canGoToNextQuestion = versesReadCount >= versesToRead;

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
          <Text style={styles.headerTitle}>اختبار مخصص</Text>
          <Text style={styles.headerSubtitle}>⏱ {formatTime(elapsedTime)}</Text>
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
            <Text style={styles.questionNumber}>{currentQuestionIndex + 1}/{allQuestions.length}</Text>
          </View>
          <View style={styles.questionTextContainer}>
            <Text style={styles.surahName}>سورة {currentVerse.surahName}</Text>
            <Text style={styles.instructionText}>
              اقرأ من قوله تعالى (آية {currentVerse.verseNumber}):
            </Text>
          </View>
        </View>

        {/* Compteur de versets */}
        <View style={styles.verseCounter}>
          <Text style={styles.verseCounterText}>
            آية {versesReadCount} / {versesToRead}
          </Text>
          {canGoToNextQuestion && (
            <View style={styles.completeBadge}>
              <Text style={styles.completeText}>✓ مكتمل</Text>
            </View>
          )}
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
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleNextVerse}
          activeOpacity={0.8}
          disabled={versesReadCount >= versesToRead}>
          <Text style={[
            styles.controlButtonText,
            versesReadCount >= versesToRead && styles.controlButtonTextDisabled
          ]}>
            الآية التالية
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextQuestionButton,
            !canGoToNextQuestion && styles.nextQuestionButtonDisabled
          ]}
          onPress={handleNextQuestion}
          activeOpacity={0.85}
          disabled={!canGoToNextQuestion}>
          <Text style={styles.nextQuestionButtonText}>
            {currentQuestionIndex < allQuestions.length - 1 ? 'السؤال التالي' : 'إنهاء الاختبار'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipQuestion}
          activeOpacity={0.8}>
          <Text style={styles.skipButtonText}>
            سؤال جديد {versesReadCount < versesToRead && '(خطأ)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quitButton}
          onPress={() => setShowQuitModal(true)}
          activeOpacity={0.8}>
          <Text style={styles.quitButtonText}>إنهاء الاختبار</Text>
        </TouchableOpacity>
      </View>

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
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: wp(15),
    marginTop: hp(4),
  },

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

  mainContent: {
    flex: 1,
    padding: SPACING.md,
  },

  questionInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: hp(12),
    gap: wp(10),
  },
  questionBadge: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(20),
    backgroundColor: colors.secondary,
  },
  questionNumber: {
    fontSize: FONT_SIZES.md,
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

  verseCounter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondaryLight,
    padding: hp(12),
    borderRadius: RADIUS.md,
    marginBottom: hp(12),
  },
  verseCounterText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: colors.primary,
  },
  completeBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: wp(12),
    paddingVertical: hp(4),
    borderRadius: RADIUS.sm,
  },
  completeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.textLight,
  },

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

  controlsContainer: {
    backgroundColor: colors.bgWhite,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: hp(10),
  },
  controlButton: {
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
  controlButtonTextDisabled: {
    color: colors.textSecondary,
  },
  nextQuestionButton: {
    backgroundColor: colors.success,
    paddingVertical: hp(14),
    borderRadius: RADIUS.lg,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.25,
    shadowRadius: wp(4),
    elevation: 3,
  },
  nextQuestionButtonDisabled: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextQuestionButtonText: {
    fontSize: FONT_SIZES.buttonText,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: colors.secondary,
    paddingVertical: hp(12),
    borderRadius: RADIUS.md,
  },
  skipButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
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
  modalButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: colors.textLight,
  },
  modalButtonTextSecondary: {
    color: colors.primary,
  },
});

export default CustomTestScreen;