import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TestResult } from '../../types';
import { COLORS } from '../../lib/constants';

type Props = {
  tests: TestResult[];
  biomarkerName: string;
};

export function BiomarkerLineChart({ tests, biomarkerName }: Props) {
  // Collect data points across tests (oldest first)
  const sorted = [...tests].reverse();
  const points = sorted
    .map(t => t.biomarkers.find(b => b.name === biomarkerName))
    .filter(Boolean);

  if (points.length < 2) {
    return (
      <View style={{ height: 80, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6B7280', fontSize: 12 }}>Not enough data for trend</Text>
      </View>
    );
  }

  const chartData = points.map((b, i) => ({
    value: b!.detected,
    label: `T${i + 1}`,
    dataPointColor:
      b!.level === 'normal' ? '#22C55E' : b!.level === 'high' ? COLORS.warning : COLORS.danger,
  }));

  const normalMin = points[0]!.normalMin;
  const normalMax = points[0]!.normalMax;
  const allValues = chartData.map(d => d.value);
  const minVal = Math.min(...allValues, normalMin);
  const maxVal = Math.max(...allValues, normalMax);

  return (
    <View>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 10, letterSpacing: 0.3 }}>
        {points[0]!.displayName}
        <Text style={{ fontSize: 12, fontWeight: '400', color: '#6B7280' }}>  {points[0]!.unit}</Text>
      </Text>
      <LineChart
        data={chartData}
        width={270}
        height={110}
        color={COLORS.primary}
        thickness={3}
        startFillColor={COLORS.primary}
        endFillColor={COLORS.background}
        startOpacity={0.3}
        endOpacity={0.0}
        areaChart
        curved
        isAnimated
        animationDuration={900}
        hideDataPoints={false}
        dataPointsColor={COLORS.primary}
        dataPointsRadius={5}
        yAxisLabelWidth={32}
        yAxisTextStyle={{ color: '#6B7280', fontSize: 11 }}
        xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 12, fontWeight: '500' }}
        rulesColor="#EDE9FE"
        rulesType="solid"
        noOfSections={3}
        maxValue={Math.ceil(maxVal * 1.15)}
        mostNegativeValue={Math.floor(minVal * 0.85)}
        showReferenceLine1
        referenceLine1Position={normalMin}
        referenceLine1Config={{ color: '#22C55E', dashWidth: 6, dashGap: 4, thickness: 1.5 }}
        showReferenceLine2
        referenceLine2Position={normalMax}
        referenceLine2Config={{ color: '#22C55E', dashWidth: 6, dashGap: 4, thickness: 1.5 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
        <View style={{ width: 16, height: 2, backgroundColor: '#22C55E', borderRadius: 1 }} />
        <Text style={{ fontSize: 11, color: '#6B7280' }}>Normal range</Text>
      </View>
    </View>
  );
}
