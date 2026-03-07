import React from 'react';
import { View, Text } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { BiomarkerName, TestResult } from '../../types';
import { COLORS } from '../../lib/constants';

type Props = {
  biomarkerName: BiomarkerName;
  displayName: string;
  unit: string;
  tests: TestResult[];
  chartType?: 'line' | 'bar';
};

export function BiomarkerTrendChart({ biomarkerName, displayName, unit, tests, chartType = 'line' }: Props) {
  // Filter tests containing this biomarker, sort oldest → newest
  const relevant = [...tests]
    .filter(t => t.biomarkers.some(b => b.name === biomarkerName))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (relevant.length < 2) {
    return (
      <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Not enough data — run more tests</Text>
      </View>
    );
  }

  const points = relevant.map(t => {
    const b = t.biomarkers.find(b => b.name === biomarkerName)!;
    const d = new Date(t.date);
    return {
      value: b.detected,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      normalMin: b.normalMin,
      normalMax: b.normalMax,
      level: b.level,
    };
  });

  const latest = points[points.length - 1];
  const prev = points[points.length - 2];
  const delta = parseFloat((latest.value - prev.value).toFixed(2));
  const deltaText = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '—';

  // Color delta based on whether going up is good or bad
  // For protein/ketones/alcohol: lower is better; for vitamin_c/calcium_magnesium: higher is better
  const lowerIsBetter = ['protein', 'ketones', 'alcohol', 'specific_gravity'].includes(biomarkerName);
  const deltaGood = lowerIsBetter ? delta <= 0 : delta >= 0;
  const deltaNeutral = delta === 0;
  const deltaColor = deltaNeutral ? '#9CA3AF' : deltaGood ? '#0D9488' : COLORS.danger;

  const levelColor = latest.level === 'normal' ? '#0D9488' : latest.level === 'high' ? COLORS.danger : COLORS.warning;

  const chartData = points.map(p => ({
    value: p.value,
    label: p.label,
    dataPointColor: p.level === 'normal' ? COLORS.primary : COLORS.danger,
  }));

  const maxVal = Math.max(...points.map(p => p.normalMax), ...points.map(p => p.value));
  const minVal = Math.min(0, ...points.map(p => p.value));

  return (
    <View>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        {/* Left: name + normal range */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 }}>
            {displayName}
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
            Normal: {latest.normalMin}–{latest.normalMax} {unit}
          </Text>
        </View>
        {/* Right: delta badge + current value */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: deltaColor + '22',
              borderRadius: 8,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: deltaColor }}>
              {deltaText}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: levelColor }}>
              {latest.value}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '400', color: '#9CA3AF' }}>{unit}</Text>
          </View>
        </View>
      </View>
      <View style={{ height: 6 }} />

      {/* Chart */}
      {chartType === 'line' ? (
        <LineChart
          data={chartData}
          width={270}
          height={100}
          color={COLORS.primary}
          thickness={3}
          startFillColor={COLORS.primary}
          endFillColor={COLORS.background}
          startOpacity={0.15}
          endOpacity={0.0}
          areaChart
          curved
          isAnimated
          animationDuration={800}
          dataPointsRadius={5}
          dataPointsColor={COLORS.primary}
          yAxisLabelWidth={36}
          yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
          rulesColor="#EDE9FE"
          rulesType="solid"
          noOfSections={3}
          maxValue={maxVal}
          mostNegativeValue={minVal}
        />
      ) : (
        <BarChart
          data={chartData}
          width={270}
          height={100}
          barWidth={28}
          barBorderRadius={4}
          frontColor={COLORS.primary}
          gradientColor={COLORS.primary + '88'}
          isAnimated
          animationDuration={800}
          yAxisLabelWidth={36}
          yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
          rulesColor="#EDE9FE"
          noOfSections={3}
          maxValue={maxVal}
        />
      )}
    </View>
  );
}
