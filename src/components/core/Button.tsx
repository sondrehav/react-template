import classNames from 'classnames';
import { ComponentProps } from 'react';

const variants = {
  primary:
    'rounded-lg bg-primary-dark text-primary-light focus:bg-primary hover:bg-primary action:bg-primary-800 disabled:bg-gray-200',
  secondary:
    'rounded-lg bg-white border-2 border-gray-400 text-primary-dark focus:bg-primary hover:bg-primary focus:border-primary hover:border-primary focus:text-primary-light hover:text-primary-light action:bg-primary-light disabled:bg-gray-200',
  plain:
    'bg-transparent border-b-2 text-primary-dark border-primary-300 hover:border-primary-500 focus:border-primary-500 hover:bg-primary-50 focus:bg-primary-50 disabled:text-gray-500 !px-1',
} as const;

const sizes = {
  sm: 'py-1 px-2 text-xs font-semibold',
  md: 'py-3 px-5 text-base font-semibold',
  lg: 'py-4 px-6 text-lg font-semibold',
} as const;

type ButtonProps = ComponentProps<'button'> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
};

const Button = ({
  className,
  children,
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={classNames(
        'transition-colors overflow-hidden truncate',
        fullWidth ? 'w-full' : 'max-w-min',
        'h-fit',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
