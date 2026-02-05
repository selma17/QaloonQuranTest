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
  const { 
    testType, 
    surahNumber, 
    pageFrom, 
    pageTo, 
    hizbNumber,
    questionCount,
    selectionMode
  } = route.params;

  // Déterminer si on a un nombre de questions défini dès le départ
  const hasDefinedQuestionCount = questionCount && questionCount > 0;

  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usedVerses, setUsedVerses] = useState(new Set());

  // Générer les questions au chargement
  useEffect(() => {
    const generateQuestions = () => {
      try {
        let allVerses = [];
        
        // Récupérer tous les versets selon le type de test
        if (testType === 'surah') {
          const surahVerses = quranData.versesDetailed[surahNumber] || [];
          allVerses = surahVerses.map(v => ({
            surahNumber: surahNumber,
            surahName: quranData.getSurahName(surahNumber),
            verseNumber: v.number,
            text: v.text,
            page: v.page,
            juz: v.juz,
          }));
        } else if (testType === 'pages') {
          for (let page = pageFrom; page <= pageTo; page++) {
            const pageVerses = quranData.getVersesByPage(page) || [];
            pageVerses.forEach(v => {
              allVerses.push({
                surahNumber: v.surahNumber,
                surahName: v.surahName,
                verseNumber: v.verseNumber,
                text: v.text,
                page: v.page || page,
                juz: v.juz,
              });
            });
          }
        } else if (testType === 'Hizb') {
          const hizbVerses = quranData.getVersesByHizb(hizbNumber) || [];
          hizbVerses.forEach(v => {
            allVerses.push({
              surahNumber: v.surahNumber,
              surahName: v.surahName,
              verseNumber: v.verseNumber,
              text: v.text,
              page: v.page,
              juz: v.juz,
            });
          });
        }

        if (allVerses.length === 0) {
          Alert.alert('خطأ', 'لم يتم العثور على آيات');
          navigation.goBack();
          return;
        }

        let questions = [];

        // Si un nombre de questions est défini
        if (hasDefinedQuestionCount) {
          if (selectionMode === 'sequential') {
            // Mode séquentiel : Division en blocs
            // Exemple : 200 versets, 5 questions → 5 blocs de 40 versets
            // Chaque bloc donne 1 question aléatoire
            
            // Trier tous les versets
            allVerses.sort((a, b) => {
              if (a.surahNumber !== b.surahNumber) {
                return a.surahNumber - b.surahNumber;
              }
              return a.verseNumber - b.verseNumber;
            });

            const numQuestions = Math.min(questionCount, allVerses.length);
            const blockSize = Math.floor(allVerses.length / numQuestions);
            
            questions = [];
            
            for (let i = 0; i < numQuestions; i++) {
              const blockStart = i * blockSize;
              const blockEnd = (i === numQuestions - 1) 
                ? allVerses.length  // Dernier bloc prend tous les versets restants
                : (i + 1) * blockSize;
              
              // Choisir un verset aléatoire dans ce bloc
              const randomIndexInBlock = blockStart + Math.floor(Math.random() * (blockEnd - blockStart));
              
              if (randomIndexInBlock < allVerses.length) {
                questions.push(allVerses[randomIndexInBlock]);
              }
            }

          } else {
            // Mode aléatoire : mélanger et prendre les N premiers
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
        } else {
          // Mode infini : pas de limite de questions, charger le premier verset
          setAllQuestions(allVerses);
          
          // En mode infini, charger un verset aléatoire
          if (allVerses.length > 0) {
            const randomIndex = Math.floor(Math.random() * allVerses.length);
            setCurrentVerse(allVerses[randomIndex]);
            setUsedVerses(new Set([`${allVerses[randomIndex].surahNumber}-${allVerses[randomIndex].verseNumber}`]));
          }
        }

        setLoading(false);
      } catch (error) {
        Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الأسئلة');
        setLoading(false);
      }
    };

    generateQuestions();
  }, [testType, surahNumber, pageFrom, pageTo, hizbNumber, questionCount, selectionMode]);

  // Charger un verset aléatoire (mode infini uniquement)
  const loadRandomVerse = React.useCallback(() => {
    if (hasDefinedQuestionCount) return; // Ne pas utiliser en mode avec limite

    setLoading(true);
    
    try {
      let verses = [];
      
      // Récupérer tous les versets selon le type de test
      if (testType === 'surah') {
        const surahVerses = quranData.versesDetailed[surahNumber] || [];
        verses = surahVerses.map(v => ({
          surahNumber: surahNumber,
          surahName: quranData.getSurahName(surahNumber),
          verseNumber: v.number,
          text: v.text,
          page: v.page,
          juz: v.juz,
        }));
      } else if (testType === 'pages') {
        for (let page = pageFrom; page <= pageTo; page++) {
          const pageVerses = quranData.getVersesByPage(page) || [];
          pageVerses.forEach(v => {
            verses.push({
              surahNumber: v.surahNumber,
              surahName: v.surahName,
              verseNumber: v.verseNumber,
              text: v.text,
              page: v.page || page,
              juz: v.juz,
            });
          });
        }
      } else if (testType === 'Hizb') {
        const hizbVerses = quranData.getVersesByHizb(hizbNumber) || [];
        hizbVerses.forEach(v => {
          verses.push({
            surahNumber: v.surahNumber,
            surahName: v.surahName,
            verseNumber: v.verseNumber,
            text: v.text,
            page: v.page,
            juz: v.juz,
          });
        });
      }

      // Filtrer avec l'état actuel
      setUsedVerses(currentUsed => {
        const availableVerses = verses.filter(v => {
          const verseKey = `${v.surahNumber}-${v.verseNumber}`;
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
          const verseKey = `${selectedVerse.surahNumber}-${selectedVerse.verseNumber}`;
          
          setCurrentVerse(selectedVerse);

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
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الآية');
      setLoading(false);
    }
  }, [testType, surahNumber, pageFrom, pageTo, hizbNumber, hasDefinedQuestionCount]);

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

    // Si nombre de questions défini
    if (hasDefinedQuestionCount) {
      if (currentQuestionIndex < allQuestions.length - 1) {
        // Passer à la question suivante
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setCurrentVerse(allQuestions[nextIndex]);
        setQuestionNumber(questionNumber + 1);
      } else {
        // C'était la dernière question → Fin du test automatique
        setTimeout(() => {
          handleFinishTest(isCorrect);
        }, 300); // Petit délai pour que l'utilisateur voie la transition
      }
    } else {
      // Mode infini : charger un nouveau verset aléatoire
      setQuestionNumber(questionNumber + 1);
      loadRandomVerse();
    }
  };

  const handleFinishTest = (lastAnswerWasCorrect = null) => {
    // Calculer le score final en tenant compte de la dernière réponse si nécessaire
    let finalScore = score;
    let finalErrors = errors;
    
    if (lastAnswerWasCorrect !== null) {
      if (lastAnswerWasCorrect) {
        finalScore = score + 1;
      } else {
        finalErrors = errors + 1;
      }
    }
    
    navigation.navigate('Results', {
      score: finalScore,
      errors: finalErrors,
      totalQuestions: hasDefinedQuestionCount ? allQuestions.length : questionNumber - 1,
      testType,
      surahNumber,
      pageFrom,
      pageTo,
      hizbNumber,
    });
  };

  const handleQuit = () => {
    setShowQuitModal(false);
    
    if (hasDefinedQuestionCount) {
      // Compter les questions restantes comme erreurs
      const questionsAnswered = currentQuestionIndex + 1;
      const remainingQuestions = allQuestions.length - questionsAnswered;
      
      navigation.navigate('Results', {
        score,
        errors: errors + remainingQuestions,
        totalQuestions: allQuestions.length,
        testType,
        surahNumber,
        pageFrom,
        pageTo,
        hizbNumber,
      });
    } else {
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
    }
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
        <View style={styles.scoreDivider} />
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>
            {hasDefinedQuestionCount 
              ? `${currentQuestionIndex + 1}/${allQuestions.length}`
              : questionNumber
            }
          </Text>
          <Text style={styles.scoreLabel}>السؤال</Text>
        </View>
      </View>

      <ScrollView style={styles.mainContent}>
        <View style={styles.questionInfo}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionNumber}>
              {hasDefinedQuestionCount ? currentQuestionIndex + 1 : questionNumber}
            </Text>
          </View>
          <View style={styles.questionTextContainer}>
            <Text style={styles.surahName}>{currentVerse.surahName}</Text>
            <Text style={styles.instructionText}>ما هي الآية التالية؟</Text>
          </View>
        </View>

        {currentVerse.verseNumber === 1 && currentVerse.surahNumber !== 1 && currentVerse.surahNumber !== 9 && (
          <View style={styles.bismillahBox}>
            <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          </View>
        )}

        <View style={styles.verseCard}>
          <View style={styles.verseOrnament} />
          <ScrollView 
            style={styles.verseScrollView}
            contentContainerStyle={styles.verseScrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.verseText}>{currentVerse.text}</Text>
          </ScrollView>
          <View style={styles.verseOrnament} />
          <View style={styles.verseMetadata}>
            <Text style={styles.metadataText}>
              الآية {currentVerse.verseNumber} • الصفحة {currentVerse.page} • الجزء {currentVerse.juz}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handlePreviousVerse}>
            <Text style={styles.controlButtonText}>← الآية السابقة</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleNextVerse}>
            <Text style={styles.controlButtonText}>الآية التالية →</Text>
          </TouchableOpacity>
        </View>
        
        {hasDefinedQuestionCount && currentQuestionIndex === allQuestions.length - 1 ? (
          // Dernière question : afficher un message au lieu du bouton
          <View style={styles.lastQuestionInfo}>
            <Text style={styles.lastQuestionText}>
              هذا هو السؤال الأخير! سيتم عرض النتائج بعد الإجابة.
            </Text>
          </View>
        ) : null}
        
        <TouchableOpacity 
          style={styles.newQuestionButton}
          onPress={handleNewQuestion}>
          <Text style={styles.newQuestionButtonText}>
            {hasDefinedQuestionCount && currentQuestionIndex === allQuestions.length - 1 
              ? 'إنهاء الاختبار' 
              : 'سؤال جديد'
            }
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quitButton}
          onPress={() => setShowQuitModal(true)}>
          <Text style={styles.quitButtonText}>إنهاء الاختبار</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmation de réponse */}
      <Modal
        visible={showCorrectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCorrectModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>هل أجبت بشكل صحيح؟</Text>
            <Text style={styles.modalText}>
              هل تمكنت من تلاوة الآية التالية بشكل صحيح؟
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSuccess]}
                onPress={() => handleAnswerCorrect(true)}>
                <Text style={styles.modalButtonText}>✓ نعم، أجبت بشكل صحيح</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonError]}
                onPress={() => handleAnswerCorrect(false)}>
                <Text style={styles.modalButtonText}>✗ لا، أخطأت</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowCorrectModal(false)}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmation de sortie */}
      <Modal
        visible={showQuitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuitModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>إنهاء الاختبار؟</Text>
            <Text style={styles.modalText}>
              هل أنت متأكد من رغبتك في إنهاء الاختبار؟ سيتم حفظ نتائجك الحالية.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleQuit}>
                <Text style={styles.modalButtonText}>نعم، إنهاء الاختبار</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowQuitModal(false)}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>إلغاء</Text>
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
    gap: hp(16),
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: colors.textSecondary,
  },
  
  // HEADER
  header: {
    backgroundColor: colors.primary,
    paddingTop: hp(15),
    paddingBottom: hp(20),
    paddingHorizontal: wp(20),
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(6) },
    shadowOpacity: 0.12,
    shadowRadius: wp(10),
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
    borderBottomColor: colors.secondary,
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
    backgroundColor: colors.secondary,
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
  lastQuestionInfo: {
    backgroundColor: colors.secondaryLight,
    paddingVertical: hp(12),
    paddingHorizontal: wp(16),
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  lastQuestionText: {
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