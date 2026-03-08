import { View, Text } from 'react-native';

type BadgeVariant = 'warning' | 'danger' | 'success' | 'info';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const variantConfig: Record<
  BadgeVariant,
  { container: string; dot: string; text: string }
> = {
  warning: {
    container: 'bg-sky-50',
    dot: 'bg-sky-400',
    text: 'text-sky-700',
  },
  danger: {
    container: 'bg-amber-50',
    dot: 'bg-amber-400',
    text: 'text-amber-700',
  },
  success: {
    container: 'bg-green-50',
    dot: 'bg-green-500',
    text: 'text-green-700',
  },
  info: {
    container: 'bg-blue-50',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
  },
};

export function Badge({ label, variant = 'info' }: BadgeProps) {
  const config = variantConfig[variant];

  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-1 ${config.container}`}
    >
      <View className={`w-2 h-2 rounded-full mr-1.5 ${config.dot}`} />
      <Text className={`text-xs font-medium ${config.text}`}>{label}</Text>
    </View>
  );
}
