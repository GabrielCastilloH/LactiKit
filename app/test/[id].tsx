import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTestHistory } from '../../context/ScanHistoryContext';
import { BiomarkerCard } from '../../components/results/BiomarkerCard';
import { COLORS, TEST_TYPE_LABELS } from '../../lib/constants';
import { TestType } from '../../types';
import { generateTestOverview } from '../../lib/gemini';

// ---------------------------------------------------------------------------
// Survey definitions
// ---------------------------------------------------------------------------

interface SurveyQuestion {
  question: string;
  options: string[];
  multi?: boolean;
}

const SURVEY_QUESTIONS: Record<TestType, SurveyQuestion[]> = {
  mom_urine: [
    {
      question: 'Any pain or burning when urinating?',
      options: ['Yes', 'Sometimes', 'No'],
    },
    {
      question: 'How much water have you been drinking daily?',
      options: ['Less than 4 cups', '4–8 cups', 'More than 8 cups'],
    },
    {
      question: 'Which of these have you been eating a lot of lately?',
      options: ['Citrus & berries', 'Leafy greens', 'Processed/fast food', 'Red meat', 'Dairy'],
      multi: true,
    },
    {
      question: 'How have your energy levels been?',
      options: ['Exhausted', 'Tired', 'Normal', 'Good'],
    },
  ],
  breastmilk: [
    {
      question: 'How would you describe your protein intake lately?',
      options: ['Low (rarely meat/beans)', 'Moderate', 'High'],
    },
    {
      question: 'Which of these have you been eating a lot of lately?',
      options: ['Fish & seafood', 'Eggs', 'Dairy & cheese', 'Nuts & seeds', 'Leafy greens'],
      multi: true,
    },
    {
      question: 'Are you taking any supplements?',
      options: ['None', 'Calcium', 'Vitamin D', 'Iron', 'Omega-3'],
      multi: true,
    },
    {
      question: 'How is your milk supply feeling?',
      options: ['Decreased', 'Normal', 'Increased'],
    },
  ],
  baby_urine: [
    {
      question: 'How many wet diapers has the baby had today?',
      options: ['0–3', '4–6', '7 or more'],
    },
    {
      question: 'How has the baby been feeding?',
      options: ['Struggling to feed', 'Normal', 'Feeding very well'],
    },
    {
      question: 'What has the baby been drinking?',
      options: ['Breast milk', 'Formula', 'Both', 'Started solids'],
      multi: true,
    },
    {
      question: 'Any unusual color or smell in the urine?',
      options: ['Yes', 'No', 'Not sure'],
    },
  ],
};

// ---------------------------------------------------------------------------
// Survey card component
// ---------------------------------------------------------------------------

interface SurveyCardProps {
  questions: SurveyQuestion[];
  onComplete: (answers: Record<string, string | string[]>) => void;
}

function SurveyCard({ questions, onComplete }: SurveyCardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const current = questions[step];
  const isMulti = !!current.multi;
  const currentAnswer = answers[current.question];
  const selectedMulti: string[] = isMulti ? (currentAnswer as string[] ?? []) : [];
  const selectedSingle: string = isMulti ? '' : (currentAnswer as string ?? '');

  const hasAnswer = isMulti ? selectedMulti.length > 0 : selectedSingle !== '';
  const isLast = step === questions.length - 1;

  function toggleMulti(option: string) {
    const next = selectedMulti.includes(option)
      ? selectedMulti.filter(o => o !== option)
      : [...selectedMulti, option];
    setAnswers(prev => ({ ...prev, [current.question]: next }));
  }

  function selectSingle(option: string) {
    setAnswers(prev => ({ ...prev, [current.question]: option }));
  }

  function handleNext() {
    if (!hasAnswer) return;
    if (isLast) {
      onComplete(answers);
    } else {
      setStep(s => s + 1);
    }
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ fontSize: 18, marginRight: 8 }}>🩺</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>A few quick questions</Text>
      </View>
      <Text style={{ fontSize: 12, color: '#4B5563', marginBottom: 16 }}>
        Question {step + 1} of {questions.length}
      </Text>

      {/* Progress bar */}
      <View style={{ height: 4, backgroundColor: '#EDE9FE', borderRadius: 2, marginBottom: 16 }}>
        <View
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.primary,
            width: `${((step + 1) / questions.length) * 100}%`,
          }}
        />
      </View>

      {/* Question text */}
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 14, lineHeight: 22 }}>
        {current.question}
      </Text>

      {/* Options */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {current.options.map(option => {
          const selected = isMulti
            ? selectedMulti.includes(option)
            : selectedSingle === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => isMulti ? toggleMulti(option) : selectSingle(option)}
              activeOpacity={0.75}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                borderWidth: 1.5,
                borderColor: selected ? COLORS.primary : COLORS.border,
                backgroundColor: selected ? '#EDE9FE' : COLORS.surface,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: selected ? COLORS.primary : '#4B5563' }}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Nav row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {step > 0 ? (
          <TouchableOpacity onPress={() => setStep(s => s - 1)} activeOpacity={0.75}>
            <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600' }}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <TouchableOpacity
          onPress={handleNext}
          disabled={!hasAnswer}
          activeOpacity={0.85}
          style={{
            backgroundColor: hasAnswer ? COLORS.primary : '#D1D5DB',
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13 }}>
            {isLast ? 'Generate Overview →' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function TestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTest, updateTestOverview } = useTestHistory();
  const test = getTest(id);

  const insets = useSafeAreaInsets();
  const [generating, setGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [resetSurvey, setResetSurvey] = useState(false);

  if (!test) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#4B5563' }}>Test not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const label = TEST_TYPE_LABELS[test.testType] ?? test.testType;
  const formattedDate = new Date(test.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const flaggedCount = test.biomarkers.filter(b => b.level !== 'normal').length;
  const questions = SURVEY_QUESTIONS[test.testType];

  async function handleSurveyComplete(answers: Record<string, string | string[]>) {
    setGenerating(true);
    setStreamingText('');
    try {
      const overview = await generateTestOverview(test!, answers, (chunk) => {
        setStreamingText(prev => prev + chunk);
      });
      updateTestOverview(test!.id, overview);
    } finally {
      setGenerating(false);
    }
  }

  function handleRegenerate() {
    updateTestOverview(test!.id, '');
    setStreamingText('');
    setResetSurvey(r => !r);
  }

  const showSurvey = !generating && !test.aiOverview;
  const showLoading = generating;
  const showOverview = !generating && !!test.aiOverview;
  const displayText = test.aiOverview || streamingText;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          backgroundColor: COLORS.surface,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{label} Test</Text>
          <Text style={{ fontSize: 12, color: '#4B5563' }}>{formattedDate}</Text>
        </View>
        {flaggedCount > 0 && (
          <View style={{ backgroundColor: COLORS.danger, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>{flaggedCount} flagged</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Survey */}
        {showSurvey && (
          <SurveyCard key={String(resetSurvey)} questions={questions} onComplete={handleSurveyComplete} />
        )}

        {/* Generating loading state */}
        {showLoading && (
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              alignItems: 'center',
            }}
          >
            <ActivityIndicator color={COLORS.primary} style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 14, color: '#4B5563', fontWeight: '600' }}>Generating your overview...</Text>
            {streamingText.length > 0 && (
              <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20, marginTop: 12, textAlign: 'left', width: '100%' }}>
                {streamingText}
              </Text>
            )}
          </View>
        )}

        {/* AI Overview (post-survey) */}
        {showOverview && (
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, marginRight: 8 }}>🩺</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>AI Overview</Text>
            </View>
            <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20 }}>{displayText}</Text>
            <TouchableOpacity onPress={handleRegenerate} style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Regenerate</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Biomarkers */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
          Biomarkers
        </Text>
        {test.biomarkers.map(b => (
          <BiomarkerCard key={b.name} biomarker={b} />
        ))}

        {/* CTA */}
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/(tabs)/chat', params: { testId: test.id } })}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 8,
            marginBottom: 24,
          }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '700' }}>
            Chat with Maya about this test
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
