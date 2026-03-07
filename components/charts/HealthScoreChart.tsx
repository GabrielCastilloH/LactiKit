import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TestResult } from '../../types';
import { COLORS } from '../../lib/constants';

type Props = {
  tests: TestResult[];
};

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

  const chartData = sorted.map(t => {
    const normal = t.biomarkers.filter(b => b.level === 'normal').length;
    const score = Math.round((normal / t.biomarkers.length) * 100);
    const d = new Date(t.date);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const dotColor = score === 100 ? '#22C55E' : score >= 66 ? '#22C55E' : COLORS.warning;
    return { value: score, label, dataPointColor: dotColor };
  });

  const latest = chartData[chartData.length - 1].value;
  const prev = chartData[chartData.length - 2].value;
  const delta = latest - prev;
  const deltaText = delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : '—';
  const deltaColor = delta > 0 ? '#22C55E' : delta < 0 ? COLORS.danger : '#9CA3AF';

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8, alignSelf: 'flex-start' }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.primary }}>{latest}%</Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: deltaColor }}>{deltaText} vs last test</Text>
      </View>
      <LineChart
        data={chartData}
        width={270}
        height={110}
        color={COLORS.primary}
        thickness={3}
        startFillColor={COLORS.primary}
        endFillColor={COLORS.background}
        startOpacity={0.25}
        endOpacity={0.0}
        areaChart
        curved
        isAnimated
        animationDuration={900}
        hideDataPoints={false}
        dataPointsRadius={5}
        yAxisLabelWidth={32}
        yAxisTextStyle={{ color: '#9CA3AF', fontSize: 11 }}
        xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 11 }}
        rulesColor="#EDE9FE"
        rulesType="solid"
        noOfSections={4}
        maxValue={100}
        mostNegativeValue={40}
      />
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 4, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' }} />
          <Text style={{ fontSize: 11, color: '#9CA3AF' }}>All normal</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.warning }} />
          <Text style={{ fontSize: 11, color: '#9CA3AF' }}>Some flagged</Text>
        </View>
      </View>
    </View>
  );
}
