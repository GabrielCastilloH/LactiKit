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
        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Not enough data for trend</Text>
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
      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
        {points[0]!.displayName} trend · {points[0]!.unit}
      </Text>
      <LineChart
        data={chartData}
        width={260}
        height={100}
        color={COLORS.primary}
        thickness={2}
        startFillColor={COLORS.primary}
        endFillColor={COLORS.background}
        startOpacity={0.25}
        endOpacity={0.01}
        areaChart
        curved
        isAnimated
        animationDuration={800}
        hideDataPoints={false}
        dataPointsColor={COLORS.primary}
        dataPointsRadius={4}
        yAxisLabelWidth={36}
        yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
        rulesColor="#F3F4F6"
        rulesType="solid"
        maxValue={Math.ceil(maxVal * 1.15)}
        mostNegativeValue={Math.floor(minVal * 0.85)}
        showReferenceLine1
        referenceLine1Position={normalMin}
        referenceLine1Config={{ color: '#22C55E', dashWidth: 4, dashGap: 4, thickness: 1 }}
        showReferenceLine2
        referenceLine2Position={normalMax}
        referenceLine2Config={{ color: '#22C55E', dashWidth: 4, dashGap: 4, thickness: 1 }}
      />
    </View>
  );
}
