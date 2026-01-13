// src/screens/TestScreen.js
// Écran de test optimisé avec zone verset scrollable - Adapté pour nouvelle structure

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

const TestScreen = ({ navigation, route }) => {
  const { testType, surahNumber, pageFrom, pageTo } = route.params;

  const [currentVerse, setCurrentVerse] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRandomVerse = React.useCallback(() => {
    setLoading(true);
    
    try {
      let randomVerse;
      
      if (testType === 'surah') {
        // Charger un verset aléatoire de la sourate sélectionnée
        randomVerse = quranData.getRandomVerseFromSurah(surahNumber);
      } else if (testType === 'pages') {
        // Charger un verset aléatoire du range de pages
        randomVerse = quranData.getRandomVerseFromPageRange(pageFrom, pageTo);
      }

      if (randomVerse) {
        setCurrentVerse({
          surahNumber: randomVerse.surahNumber || surahNumber,
          surahName: randomVerse.surahName || quranData.getSurahName(surahNumber),
          verseNumber: randomVerse.number || randomVerse.verseNumber,
          text: randomVerse.text,
          page: randomVerse.page,
          juz: randomVerse.juz,
        });
      } else {
        // Fallback si aucun verset n'est trouvé
        Alert.alert('خطأ', 'لم يتم العثور على آيات في النطاق المحدد');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement du verset:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الآية');
      setLoading(false);
    }
  }, [testType, surahNumber, pageFrom, pageTo]);

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
      Alert.alert('تنبيه', 'هذه هي الآية الأولى في السورة');
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
      Alert.alert('تنبيه', 'هذه هي الآية الأخيرة في السورة');
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
      
      {/* Header - COMPACT */}
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

      {/* Score Bar - COMPACT */}
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

      {/* Main Content - NON SCROLLABLE */}
      <View style={styles.mainContent}>
        {/* Question Info - COMPACT */}
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

        {/* Bismillah - COMPACT */}
        <View style={styles.bismillahBox}>
          <Text style={styles.bismillah}>﷽</Text>
        </View>

        {/* Verse Card - SCROLLABLE CONTENT ONLY */}
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
          
          {/* Métadonnées */}
          <View style={styles.verseMetadata}>
            <Text style={styles.metadataText}>
              صفحة {currentVerse.page} • جزء {currentVerse.juz}
            </Text>
          </View>
        </View>
      </View>

      {/* Control Buttons - FIXED AT BOTTOM */}
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
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  
  // HEADER - COMPACT
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: 25,
    marginRight: 15,
  },
  
  // SCORE BAR - COMPACT
  scoreBar: {
    backgroundColor: colors.bgWhite,
    flexDirection: 'row-reverse',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scoreDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  
  // MAIN CONTENT - NON SCROLLABLE
  mainContent: {
    flex: 1,
    padding: 16,
  },
  
  // QUESTION INFO - COMPACT
  questionInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  questionBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
  },
  questionTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  instructionText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  
  // BISMILLAH - COMPACT
  bismillahBox: {
    backgroundColor: colors.bgWhite,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bismillah: {
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // VERSE CARD - SCROLLABLE ZONE ONLY
  verseCard: {
    flex: 1,
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.secondary,
    position: 'relative',
  },
  verseOrnament: {
    width: 50,
    height: 2,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: 8,
  },
  verseScrollView: {
    flex: 1,
  },
  verseScrollContent: {
    paddingVertical: 8,
  },
  verseText: {
    fontSize: 22,
    lineHeight: 42,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  verseMetadata: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metadataText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // CONTROLS - FIXED BOTTOM - COMPACT
  controlsContainer: {
    backgroundColor: colors.bgWhite,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 10,
  },
  controlsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.bgLight,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  newQuestionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  newQuestionButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: colors.bgLight,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.error,
  },
  quitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
  },
  
  // MODALS - COMPACT
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  modalButtons: {
    gap: 10,
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 14,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  modalButtonTextSecondary: {
    color: colors.primary,
  },
});

export default TestScreen;