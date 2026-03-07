import { View } from 'react-native';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl shadow p-4 ${className}`}
    >
      {children}
    </View>
  );
}
