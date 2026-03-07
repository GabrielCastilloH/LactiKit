import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

type Props = {
  percent: number;
  label: string;
  color: string;
  size?: number;
};

export function CircleGraph({ percent, label, color, size = 100 }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const data = [
    { value: clamped, color },
    { value: 100 - clamped, color: '#E5E7EB' },
  ];

  return (
    <View style={{ alignItems: 'center' }}>
      <PieChart
        data={data}
        donut
        radius={size / 2}
        innerRadius={size / 2 - 14}
        centerLabelComponent={() => (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
              {clamped}%
            </Text>
          </View>
        )}
        showText={false}
        isAnimated
        animationDuration={800}
      />
      <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 6, fontWeight: '500' }}>
        {label}
      </Text>
    </View>
  );
}
