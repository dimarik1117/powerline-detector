import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import type { AuthResponse, LoginCredentials } from '../../types';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import './Login.css';
import Footer from '../../components/Footer/Footer';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/login', formData);
      login(response.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="login">
        <div className="container">
          <section className="login__wrapper">
            <header className="login__header">
              <img
                src="../../images/sprite/icon-logo.svg"
                alt="PowerLine Logo"
                className="login__logo"
              />
            </header>

            <section className="login__form-section">
              <h1 className="login__title">Авторизация</h1>

              {error && <div className="error-message">{error}</div>}

              <form className="login__form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                  disabled={isLoading}
                />

                <PasswordInput
                  name="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="input-field"
                />

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Вход...' : 'Войти'}
                </button>
              </form>

              <button
                className="register-link"
                onClick={() => navigate('/register')}
                disabled={isLoading}
              >
                Зарегистрироваться
              </button>
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}