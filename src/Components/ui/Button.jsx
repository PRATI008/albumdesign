import './Button.css';

/**
 * Reusable Button Component
 * @param {'primary' | 'secondary' | 'danger'} variant - Visual style variant
 * @param {'sm' | 'md' | 'lg'} size - Button size (defaults to md with 44px min tap target)
 * @param {boolean} fullWidth - Whether button expands to full container width
 * @param {React.ReactNode} children - Button label or nested elements
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) => {
  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    fullWidth ? 'ui-btn--full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
