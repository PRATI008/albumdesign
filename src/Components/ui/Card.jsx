import './Card.css';

/**
 * Reusable Card Component
 */
const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  ...props
}) => {
  const classes = [
    'ui-card',
    hoverable ? 'ui-card--hoverable' : '',
    `ui-card--p-${padding}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
