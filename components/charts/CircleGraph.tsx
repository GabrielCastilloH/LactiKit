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
    { value: 100 - clamped, color: '#EDE8E3' },
  ];

  const outerRadius = size / 2;
  const innerRadius = size / 2 - 14;
  const ringMidRadius = (outerRadius + innerRadius) / 2;
  const capRadius = (outerRadius - innerRadius) / 2;
  const center = size / 2;

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (clamped / 100) * 2 * Math.PI;

  const startCapX = center + ringMidRadius * Math.cos(startAngle);
  const startCapY = center + ringMidRadius * Math.sin(startAngle);
  const endCapX = center + ringMidRadius * Math.cos(endAngle);
  const endCapY = center + ringMidRadius * Math.sin(endAngle);

  const showCaps = clamped > 0 && clamped < 100;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size, position: 'relative' }}>
        <PieChart
          data={data}
          donut
          radius={outerRadius}
          innerRadius={innerRadius}
          centerLabelComponent={() => (
            <View style={{ alignItems: 'center', backgroundColor: '#FDF6EE', width: size - 28, height: size - 28, borderRadius: (size - 28) / 2, justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                {clamped}%
              </Text>
            </View>
          )}
          showText={false}
          isAnimated
          animationDuration={800}
          strokeWidth={0}
        />
        {showCaps && (
          <>
            <View style={{
              position: 'absolute',
              width: capRadius * 2,
              height: capRadius * 2,
              borderRadius: capRadius,
              backgroundColor: color,
              left: startCapX - capRadius,
              top: startCapY - capRadius,
            }} />
            <View style={{
              position: 'absolute',
              width: capRadius * 2,
              height: capRadius * 2,
              borderRadius: capRadius,
              backgroundColor: color,
              left: endCapX - capRadius,
              top: endCapY - capRadius,
            }} />
          </>
        )}
      </View>
      <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 6, fontWeight: '500' }}>
        {label}
      </Text>
    </View>
  );
}
