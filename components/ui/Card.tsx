import { View } from 'react-native';
import { COLORS } from '../../lib/constants';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`rounded-2xl p-4 ${className}`}
      style={{ backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }}
    >
      {children}
    </View>
  );
}
