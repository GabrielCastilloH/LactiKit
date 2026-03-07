import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

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
    secondary: 'bg-white border-2',
    danger: 'border-0',
  };

  const variantStyle = {
    primary: { backgroundColor: '#7C3AED' },
    secondary: { borderColor: '#7C3AED' },
    danger: { backgroundColor: '#EF4444' },
  };

  const textColor = {
    primary: 'text-white',
    secondary: 'text-purple-700',
    danger: 'text-white',
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
          color={variant === 'secondary' ? '#7C3AED' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text className={`font-semibold text-base ${textColor[variant]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
