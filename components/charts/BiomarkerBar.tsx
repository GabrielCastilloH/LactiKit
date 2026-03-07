import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Biomarker } from '../../types';
import { COLORS } from '../../lib/constants';

type Props = {
  biomarker: Biomarker;
};

function levelColor(level: Biomarker['level']): string {
  if (level === 'normal') return '#22C55E';
  if (level === 'high') return COLORS.warning;
  return COLORS.danger;
}

export function BiomarkerBar({ biomarker }: Props) {
  const { displayName, detected, normalMin, normalMax, unit, level } = biomarker;
  const color = levelColor(level);
  const maxScale = Math.max(detected, normalMax) * 1.2;

  const data = [
    { value: detected, label: 'Detected', frontColor: color, topLabelComponent: () => (
      <Text style={{ fontSize: 9, color, fontWeight: '700', marginBottom: 2 }}>{detected}</Text>
    )},
    { value: normalMin, label: 'Min', frontColor: '#A7F3D0', topLabelComponent: () => (
      <Text style={{ fontSize: 9, color: '#4B5563', marginBottom: 2 }}>{normalMin}</Text>
    )},
    { value: normalMax, label: 'Max', frontColor: '#6EE7B7', topLabelComponent: () => (
      <Text style={{ fontSize: 9, color: '#4B5563', marginBottom: 2 }}>{normalMax}</Text>
    )},
  ];

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{displayName}</Text>
        <View style={{ backgroundColor: color, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFF' }}>{level.toUpperCase()}</Text>
        </View>
      </View>
      <BarChart
        data={data}
        barWidth={36}
        spacing={20}
        roundedTop
        roundedBottom={false}
        hideRules={false}
        rulesColor="#F3F4F6"
        yAxisTextStyle={{ color: '#6B7280', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 10 }}
        maxValue={maxScale}
        noOfSections={4}
        isAnimated
        animationDuration={600}
        width={220}
        height={100}
        showLine={false}
        disableScroll
      />
      <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
        Normal: {normalMin}–{normalMax} {unit}
      </Text>
    </View>
  );
}
