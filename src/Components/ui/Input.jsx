import './Input.css';

/**
 * Reusable Form Input Component
 */
const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`ui-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ui-input-label">
          {label} {required && <span className="ui-input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`ui-input-field ${error ? 'ui-input-field--error' : ''}`}
        {...props}
      />
      {error && <span className="ui-input-error">{error}</span>}
      {helperText && !error && <span className="ui-input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;
