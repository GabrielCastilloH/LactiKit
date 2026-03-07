import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../../lib/constants';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'rounded-full py-4 px-6 items-center justify-center';

  const variantClasses = {
    primary: 'border-0',
    secondary: 'border-2',
    danger: 'border-0',
  };

  const variantStyle = {
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.surface, borderColor: COLORS.primary },
    danger: { backgroundColor: COLORS.danger },
  };

  const textColor = {
    primary: '#FFFFFF',
    secondary: COLORS.primary,
    danger: '#FFFFFF',
  };

  const opacityClass = disabled || loading ? 'opacity-50' : 'opacity-100';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${opacityClass} ${className}`}
      style={variantStyle[variant]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? COLORS.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text className="font-semibold text-base" style={{ color: textColor[variant] }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
