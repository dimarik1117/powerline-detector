import { useState, type InputHTMLAttributes } from 'react';
import './PasswordInput.css';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}

export default function PasswordInput({
  placeholder = 'Пароль',
  value,
  onChange,
  disabled = false,
  required = false,
  name = 'password',
  className = '',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-input-wrapper">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`password-input-field ${className}`}
        {...props}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={togglePasswordVisibility}
        disabled={disabled}
        aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
      >
        <img
          src={showPassword 
            ? '../../images/sprite/icon-close-eye.svg' 
            : '../../images/sprite/icon-eye.svg'
          }
          className="password-toggle-icon"
          alt={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        />
      </button>
    </div>
  );
}