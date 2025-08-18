import styles from './button.module.css';

interface ButtonProps extends React.ComponentProps<'button'> {
  active?: boolean;
  color: 'dangerous' | 'primary';
  size: 'large' | 'medium' | 'small';
  variant?: 'classic' | 'underline';
}
console.log(styles);
export const Button = ({
  children,
  className,
  variant = 'classic',
  size,
  color,
  active,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`${active ? styles.button_active : ''} ${variant === 'classic' ? styles.button_classic : styles.button_underline} ${color === 'primary' ? styles.button_primary : styles.button_dangerous} ${size === 'large' ? styles.button_large : size === 'medium' ? styles.button_medium : styles.button_small} ${className}`}
    >
      {children}
    </button>
  );
};
