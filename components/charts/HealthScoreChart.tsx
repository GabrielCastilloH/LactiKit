import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TestResult } from '../../types';
import { COLORS } from '../../lib/constants';

type Props = {
  tests: TestResult[];
};

const BABY_COLOR = '#5BA4A4';

function calcScore(t: TestResult) {
  const normal = t.biomarkers.filter(b => b.level === 'normal').length;
  return Math.round((normal / t.biomarkers.length) * 100);
}

export function HealthScoreChart({ tests }: Props) {
  if (tests.length < 2) {
    return (
      <View style={{ height: 80, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Run more tests to see your trend</Text>
      </View>
    );
  }

  // Oldest → newest
  const sorted = [...tests].reverse();

  // Build unified x-axis from all tests; forward-fill each series
  let lastMomScore = calcScore(sorted.find(t => t.testType !== 'baby_urine') ?? sorted[0]);
  let lastBabyScore = calcScore(sorted.find(t => t.testType === 'baby_urine') ?? sorted[0]);

  const momData: { value: number; label: string; dataPointColor: string; hideDataPoint?: boolean }[] = [];
  const babyData: { value: number; label: string; dataPointColor: string; hideDataPoint?: boolean }[] = [];

  sorted.forEach(t => {
    const d = new Date(t.date);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const score = calcScore(t);
    const isBaby = t.testType === 'baby_urine';

    if (isBaby) {
      lastBabyScore = score;
      babyData.push({ value: score, label, dataPointColor: BABY_COLOR });
      momData.push({ value: lastMomScore, label, dataPointColor: COLORS.primary, hideDataPoint: true });
    } else {
      lastMomScore = score;
      momData.push({ value: score, label, dataPointColor: COLORS.primary });
      babyData.push({ value: lastBabyScore, label, dataPointColor: BABY_COLOR, hideDataPoint: true });
    }
  });

  const latestMom = momData[momData.length - 1].value;
  const prevMom = momData[momData.length - 2].value;
  const delta = latestMom - prevMom;
  const deltaText = delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : '—';
  const deltaColor = delta > 0 ? '#7BAAA3' : delta < 0 ? COLORS.danger : '#9CA3AF';

  const latestBaby = babyData[babyData.length - 1].value;

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 1 }}>Mom</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.primary }}>{latestMom}%</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: deltaColor }}>{deltaText}</Text>
          </View>
        </View>
        <View style={{ width: 1, height: 32, backgroundColor: COLORS.border }} />
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 1 }}>Baby</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: BABY_COLOR }}>{latestBaby}%</Text>
        </View>
      </View>
      <LineChart
        data={momData}
        data2={babyData}
        width={270}
        height={110}
        color={COLORS.primary}
        color2={BABY_COLOR}
        thickness={3}
        thickness2={3}
        startFillColor={COLORS.primary}
        endFillColor={COLORS.background}
        startOpacity={0.15}
        endOpacity={0.0}
        areaChart
        curved
        isAnimated
        animationDuration={900}
        hideDataPoints={false}
        dataPointsRadius={5}
        dataPointsColor={COLORS.primary}
        dataPointsColor2={BABY_COLOR}
        yAxisLabelWidth={32}
        yAxisTextStyle={{ color: '#9CA3AF', fontSize: 11 }}
        xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 11 }}
        rulesColor="#EDE9FE"
        rulesType="solid"
        noOfSections={4}
        maxValue={100}
        mostNegativeValue={40}
      />
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 18, height: 3, backgroundColor: COLORS.primary, borderRadius: 2 }} />
          <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '500' }}>Mom's health</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 18, height: 3, backgroundColor: BABY_COLOR, borderRadius: 2 }} />
          <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '500' }}>Baby's health</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.warning }} />
          <Text style={{ fontSize: 11, color: '#9CA3AF' }}>Some flagged</Text>
        </View>
      </View>
    </View>
  );
}
