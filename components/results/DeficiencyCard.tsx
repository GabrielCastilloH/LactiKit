import React from 'react';
import { View, Text } from 'react-native';
import { Deficiency } from '../../types';

type DeficiencyCardProps = {
  deficiency: Deficiency;
};

function getLevelColor(level: Deficiency['level']): string {
  switch (level) {
    case 'low':
      return '#EF4444';
    case 'high':
      return '#F59E0B';
    case 'normal':
      return '#22C55E';
    default:
      return '#6B7280';
  }
}

function getLevelLabel(level: Deficiency['level']): string {
  return level.toUpperCase();
}

export function DeficiencyCard({ deficiency }: DeficiencyCardProps) {
  const { nutrient, unit, detected, normalMin, normalMax, level } = deficiency;

  const levelColor = getLevelColor(level);
  const fillPercent = Math.min((detected / normalMax) * 100, 100);

  return (
    <View
      className="rounded-xl mb-4 overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        flexDirection: 'row',
      }}
    >
      {/* Left colored border */}
      <View style={{ width: 4, backgroundColor: levelColor }} />

      {/* Card content */}
      <View className="flex-1 p-4">
        {/* Header row: nutrient name + badge */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold" style={{ color: '#111827' }}>
            {nutrient}
          </Text>
          <View
            className="rounded-full px-2 py-1"
            style={{ backgroundColor: levelColor }}
          >
            <Text className="text-xs font-bold text-white">
              {getLevelLabel(level)}
            </Text>
          </View>
        </View>

        {/* Detected vs Normal values */}
        <View className="flex-row justify-between mb-3">
          <View>
            <Text className="text-xs mb-0.5" style={{ color: '#6B7280' }}>
              Detected
            </Text>
            <Text className="text-sm font-semibold" style={{ color: '#111827' }}>
              {detected} {unit}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs mb-0.5" style={{ color: '#6B7280' }}>
              Normal Range
            </Text>
            <Text className="text-sm font-semibold" style={{ color: '#111827' }}>
              {normalMin}–{normalMax} {unit}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View
          className="rounded-full overflow-hidden"
          style={{ height: 6, backgroundColor: '#F3F4F6' }}
        >
          <View
            style={{
              height: 6,
              width: `${fillPercent}%`,
              backgroundColor: levelColor,
              borderRadius: 9999,
            }}
          />
        </View>
      </View>
    </View>
  );
}
