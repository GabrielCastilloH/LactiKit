import React from 'react';
import { View, Text } from 'react-native';
import { Biomarker } from '../../types';
import { COLORS } from '../../lib/constants';

type Props = {
  biomarker: Biomarker;
};

function levelColor(level: Biomarker['level']): string {
  if (level === 'normal') return '#0D9488';
  if (level === 'high') return COLORS.warning;
  return COLORS.danger;
}

export function BiomarkerCard({ biomarker }: Props) {
  const { displayName, unit, detected, normalMin, normalMax, level } = biomarker;
  const color = levelColor(level);
  const fillPercent = Math.min((detected / normalMax) * 100, 100);

  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: color + '40',
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <View style={{ flex: 1, padding: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>{displayName}</Text>
          <View style={{ backgroundColor: color, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFF' }}>{level.toUpperCase()}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <View>
            <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>Detected</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827' }}>{detected} {unit}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>Normal Range</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827' }}>{normalMin}–{normalMax} {unit}</Text>
          </View>
        </View>

        <View style={{ height: 6, backgroundColor: COLORS.border, borderRadius: 9999, overflow: 'hidden' }}>
          <View style={{ height: 6, width: `${fillPercent}%`, backgroundColor: color, borderRadius: 9999 }} />
        </View>
      </View>
    </View>
  );
}
