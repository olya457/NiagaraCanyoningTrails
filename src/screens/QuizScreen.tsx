import React, {useMemo, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {images} from '../assets';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {quizQuestions, resolveQuizResult} from '../data/quiz';
import {difficultyStars, trailById} from '../data/trails';
import {clamp, colors} from '../theme';
import type {ResultCategory, Trail} from '../types/app';

type Props = {
  onOpenTrail: (trailId: string) => void;
};

export function QuizScreen({onOpenTrail}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 720 || width < 380;
  const tiny = height < 680;
  const questionImageHeight = clamp(height * (compact ? 0.14 : 0.17), 92, 140);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [answers, setAnswers] = useState<
    Record<number, ResultCategory | undefined>
  >({});
  const complete = started && step >= quizQuestions.length;
  const question = quizQuestions[Math.min(step, quizQuestions.length - 1)];
  const selected = question ? answers[question.id] : undefined;
  const result = useMemo(() => resolveQuizResult(answers), [answers]);
  const recommendationIds = [
    ...result.primaryTrailIds,
    ...result.alternativeTrailIds,
  ];
  const recommendationTrails = recommendationIds
    .map(id => trailById[id])
    .filter(Boolean);

  function choose(category: ResultCategory) {
    setAnswers(value => ({...value, [question.id]: category}));
  }

  function next() {
    if (selected) {
      setStep(value => value + 1);
    }
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setStarted(false);
    setExitOpen(false);
  }

  if (!started) {
    return (
      <Screen
        bottomExtra={compact ? 54 : 20}
        contentStyle={styles.introContent}>
        <View style={[styles.header, compact && styles.headerCompact]}>
          <Text style={styles.kicker}>PERSONALIZED</Text>
          <Text style={styles.title}>Route Finder</Text>
        </View>

        <Image
          source={images.guideTablet}
          resizeMode="contain"
          style={[
            styles.introGuide,
            compact && styles.introGuideCompact,
            tiny && styles.introGuideTiny,
          ]}
        />

        <View style={[styles.introCard, compact && styles.introCardCompact]}>
          <View style={[styles.goldLine, compact && styles.goldLineCompact]} />
          <Text style={[styles.introTitle, compact && styles.introTitleCompact]}>
            Find Your Perfect Canyon
          </Text>
          <Text style={[styles.introText, compact && styles.introTextCompact]}>
            Answer 6 short questions about your fitness, preferences, and gear.
            We'll match you with the ideal Niagara canyoning routes for your
            style.
          </Text>
        </View>

        <PrimaryButton
          label="START QUIZ"
          onPress={() => setStarted(true)}
          style={[styles.startButton, compact && styles.startButtonCompact]}
        />
      </Screen>
    );
  }

  if (complete) {
    return (
      <Screen bottomExtra={compact ? 54 : 20}>
        <View style={[styles.header, compact && styles.headerCompact]}>
          <Text style={styles.kicker}>YOUR MATCH</Text>
          <Text style={styles.title}>Recommendations</Text>
        </View>

        {recommendationTrails.slice(0, 4).map((trail, index) => (
          <RecommendationCard
            key={trail.id}
            trail={trail}
            best={index === 0}
            onOpen={onOpenTrail}
          />
        ))}

        <PrimaryButton
          label="Retake Quiz"
          icon="↻"
          variant="ghost"
          onPress={reset}
        />
      </Screen>
    );
  }

  return (
    <Screen bottomExtra={compact ? 56 : 24} contentStyle={styles.questionContent}>
      <View style={[styles.questionHeader, compact && styles.questionHeaderCompact]}>
        <View>
          <Text style={styles.kicker}>QUESTION {question.id} OF 6</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setExitOpen(true)}
          style={styles.exitButton}>
          <Text style={styles.exitText}>×</Text>
        </Pressable>
      </View>

      <View style={[styles.progressTrack, compact && styles.progressTrackCompact]}>
        <View
          style={[
            styles.progressFill,
            {width: `${(question.id / quizQuestions.length) * 100}%`},
          ]}
        />
      </View>

      <View
        style={[
          styles.questionImageWrap,
          {height: questionImageHeight},
          compact && styles.questionImageWrapCompact,
        ]}>
        <Image
          source={images.trails.whisperFalls}
          resizeMode="cover"
          style={styles.questionImage}
        />
        <View style={styles.questionScrim} />
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          style={styles.questionText}>
          {question.question}
        </Text>
      </View>

      <View style={[styles.options, compact && styles.optionsCompact]}>
        {question.options.map(option => {
          const active = selected === option.category;

          return (
            <Pressable
              key={option.key}
              accessibilityRole="button"
              onPress={() => choose(option.category)}
              style={[
                styles.option,
                compact && styles.optionCompact,
                active && styles.optionActive,
              ]}>
              <View style={[styles.optionKey, active && styles.optionKeyActive]}>
                <Text
                  style={[
                    styles.optionKeyText,
                    active && styles.optionKeyTextActive,
                  ]}>
                  {option.key}
                </Text>
              </View>
              <Text
                numberOfLines={2}
                style={[styles.optionText, active && styles.optionTextActive]}>
                {option.text}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton
        label={step === quizQuestions.length - 1 ? 'SEE RESULT' : 'NEXT QUESTION'}
        icon="›"
        disabled={!selected}
        onPress={next}
        style={[styles.nextButton, compact && styles.nextButtonCompact]}
      />

      <ExitQuizModal
        visible={exitOpen}
        onContinue={() => setExitOpen(false)}
        onExit={reset}
      />
    </Screen>
  );
}

function RecommendationCard({
  trail,
  best,
  onOpen,
}: {
  trail: Trail;
  best: boolean;
  onOpen: (trailId: string) => void;
}) {
  const {height, width} = useWindowDimensions();
  const compact = height < 720 || width < 380;

  return (
    <View style={[styles.recCard, compact && styles.recCardCompact]}>
      <Image
        source={trail.image}
        resizeMode="cover"
        style={[styles.recImage, compact && styles.recImageCompact]}
      />
      {best && (
        <View style={styles.bestBadge}>
          <Text style={styles.bestText}>BEST MATCH</Text>
        </View>
      )}
      <View style={[styles.recBody, compact && styles.recBodyCompact]}>
        <Text numberOfLines={1} style={styles.recTitle}>
          {trail.name}
        </Text>
        <Text numberOfLines={1} style={styles.recMeta}>
          {difficultyStars(trail.difficulty)}  ⌾ {trail.coordinates.latitude.toFixed(4)}° N, {Math.abs(trail.coordinates.longitude).toFixed(4)}° W
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => onOpen(trail.id)}
          style={styles.recButton}>
          <Text style={styles.recButtonText}>Open Location ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ExitQuizModal({
  visible,
  onContinue,
  onExit,
}: {
  visible: boolean;
  onContinue: () => void;
  onExit: () => void;
}) {
  const {height, width} = useWindowDimensions();
  const compact = height < 720 || width < 380;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.modalBackdrop, compact && styles.modalBackdropCompact]}>
        <View style={[styles.modalCard, compact && styles.modalCardCompact]}>
          <View style={[styles.modalIcon, compact && styles.modalIconCompact]}>
            <Text style={[styles.modalIconText, compact && styles.modalIconTextCompact]}>
              ×
            </Text>
          </View>
          <Text style={[styles.modalTitle, compact && styles.modalTitleCompact]}>
            Exit Quiz?
          </Text>
          <Text style={[styles.modalText, compact && styles.modalTextCompact]}>
            Your progress will be lost. Are you sure you want to leave the quiz?
          </Text>
          <PrimaryButton label="Continue Quiz" onPress={onContinue} />
          <Pressable
            accessibilityRole="button"
            onPress={onExit}
            style={styles.modalExitButton}>
            <Text style={styles.modalExitText}>Exit Quiz</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  introContent: {
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 18,
  },
  headerCompact: {
    marginBottom: 12,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  title: {
    color: colors.sand,
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8,
  },
  introGuide: {
    width: '72%',
    height: 310,
    alignSelf: 'center',
    marginTop: 14,
  },
  introGuideCompact: {
    width: '62%',
    height: 240,
    marginTop: 4,
  },
  introGuideTiny: {
    height: 210,
  },
  introCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 20,
    marginBottom: 24,
  },
  introCardCompact: {
    padding: 16,
    marginBottom: 16,
  },
  goldLine: {
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginBottom: 16,
  },
  goldLineCompact: {
    marginBottom: 12,
  },
  introTitle: {
    color: colors.sand,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  introTitleCompact: {
    fontSize: 18,
  },
  introText: {
    color: colors.stone,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 14,
  },
  introTextCompact: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  startButton: {
    marginBottom: 20,
  },
  startButtonCompact: {
    marginBottom: 0,
    minHeight: 46,
  },
  questionContent: {
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  questionHeaderCompact: {
    marginBottom: 14,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    color: colors.stone,
    fontSize: 24,
    lineHeight: 27,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(212,170,46,0.18)',
    marginBottom: 16,
  },
  progressTrackCompact: {
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  questionImageWrap: {
    height: 140,
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: colors.panel,
    marginBottom: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionImageWrapCompact: {
    marginBottom: 14,
  },
  questionImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  questionScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,40,24,0.58)',
  },
  questionText: {
    color: colors.sand,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 26,
    letterSpacing: 0,
  },
  options: {
    gap: 12,
  },
  optionsCompact: {
    gap: 8,
  },
  option: {
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
  },
  optionCompact: {
    minHeight: 48,
    gap: 10,
    paddingHorizontal: 14,
  },
  optionActive: {
    borderColor: colors.gold,
    backgroundColor: '#29371b',
  },
  optionKey: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionKeyActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  optionKeyText: {
    color: colors.stone,
    fontSize: 11,
    fontWeight: '900',
  },
  optionKeyTextActive: {
    color: colors.deepForest,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
    color: colors.sand,
    fontSize: 15,
    fontWeight: '800',
  },
  optionTextActive: {
    color: colors.gold,
  },
  nextButton: {
    marginTop: 26,
  },
  nextButtonCompact: {
    marginTop: 14,
    minHeight: 46,
  },
  recCard: {
    overflow: 'hidden',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    marginBottom: 14,
  },
  recCardCompact: {
    marginBottom: 10,
  },
  recImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.moss,
  },
  recImageCompact: {
    height: 118,
  },
  bestBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    minHeight: 24,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  bestText: {
    color: colors.deepForest,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  recBody: {
    padding: 16,
  },
  recBodyCompact: {
    padding: 12,
  },
  recTitle: {
    color: colors.sand,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  recMeta: {
    color: colors.mint,
    fontSize: 12,
    marginTop: 8,
  },
  recButton: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    backgroundColor: 'rgba(212,170,46,0.12)',
  },
  recButtonText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '900',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.56)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBackdropCompact: {
    padding: 16,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 24,
    gap: 14,
  },
  modalCardCompact: {
    padding: 18,
    gap: 11,
    borderRadius: 16,
  },
  modalIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(157,38,33,0.36)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconCompact: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  modalIconText: {
    color: colors.red,
    fontSize: 28,
  },
  modalIconTextCompact: {
    fontSize: 24,
  },
  modalTitle: {
    color: colors.sand,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  modalTitleCompact: {
    fontSize: 20,
  },
  modalText: {
    color: colors.stone,
    fontSize: 15,
    lineHeight: 23,
  },
  modalTextCompact: {
    fontSize: 14,
    lineHeight: 21,
  },
  modalExitButton: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(157,38,33,0.36)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalExitText: {
    color: colors.red,
    fontWeight: '900',
  },
});
