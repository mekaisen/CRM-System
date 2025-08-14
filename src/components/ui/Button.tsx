import styles from './button.module.css';

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'classic' | 'underline';
}

export const Button = ({ children, className, variant = 'classic', ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`${variant === 'classic' ? styles.button_classic : styles.button_underline} ${className}`}
    >
      {children}
    </button>
  );
};
