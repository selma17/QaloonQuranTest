// src/screens/MainScreen.js
// Écran principal avec design amélioré

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import colors from '../styles/colors';

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Header avec gradient visuel */}
        <View style={styles.headerContainer}>
          <View style={styles.ornamentTop} />
          <Text style={styles.mainTitle}>اختبارات القرآن الكريم</Text>
          <Text style={styles.subtitle}>برواية قالون عن نافع المدني</Text>
          <View style={styles.ornamentBottom} />
        </View>

        {/* Cartes de test */}
        <View style={styles.cardsContainer}>
          
          {/* Carte 1 : Test par sourate */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SurahSelection')}
            activeOpacity={0.85}>
            <View style={styles.cardGradient} />
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📖</Text>
            </View>
            <Text style={styles.cardTitle}>اختبار في سورة معينة</Text>
            <Text style={styles.cardDescription}>
              اختر سورة واختبر حفظك آياتها
            </Text>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>←</Text>
            </View>
          </TouchableOpacity>

          {/* Carte 2 : Test par pages */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PageSelection')}
            activeOpacity={0.85}>
            <View style={styles.cardGradient} />
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📄</Text>
            </View>
            <Text style={styles.cardTitle}>اختبار في صفحات معينة</Text>
            <Text style={styles.cardDescription}>
              حدد نطاق الصفحات من المصحف
            </Text>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>←</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section info */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <View style={styles.infoDivider} />
            <Text style={styles.infoTitle}>عن التطبيق</Text>
            <View style={styles.infoDivider} />
          </View>
          <Text style={styles.infoText}>
            تطبيق مخصص لاختبار حفظ القرآن الكريم برواية قالون عن نافع المدني.
            {'\n'}
            اختر نوع الاختبار المناسب وابدأ رحلتك في تثبيت الحفظ ومراجعة كتاب الله.
          </Text>
          
          {/* Citation coranique */}
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              ﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾
            </Text>
            <Text style={styles.quoteReference}>سورة القمر</Text>
          </View>
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
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: -20,
  },
  ornamentTop: {
    width: 60,
    height: 3,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  ornamentBottom: {
    width: 40,
    height: 3,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 2,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 20,
  },
  card: {
    backgroundColor: colors.bgWhite,
    borderRadius: 24,
    padding: 28,
    marginBottom: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    position: 'relative',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: colors.secondary,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  icon: {
    fontSize: 36,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: 12,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  infoSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  infoDivider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 26,
    marginBottom: 24,
  },
  quoteBox: {
    backgroundColor: colors.primaryLight,
    padding: 24,
    borderRadius: 20,
    borderRightWidth: 4,
    borderRightColor: colors.secondary,
  },
  quoteText: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 12,
    fontWeight: '600',
  },
  quoteReference: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default MainScreen;