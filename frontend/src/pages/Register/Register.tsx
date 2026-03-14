import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import type { AuthResponse, RegisterData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import './Register.css';
import Footer from '../../components/Footer/Footer';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
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
      await api.post('/auth/register', formData);
      
      const response = await api.post<AuthResponse>('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      
      login(response.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="register">
        <div className="container">
          <section className="register__wrapper">
            <header className="register__header">
              <img
                src="../../images/sprite/icon-logo.svg"
                alt="PowerLine Logo"
                className="register__logo"
              />
            </header>

            <section className="register__form-section">
              <h1 className="register__title">Регистрация</h1>

              {error && <div className="error-message">{error}</div>}

              <form className="register__form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="username"
                  placeholder="Логин"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  required
                  disabled={isLoading}
                  minLength={3}
                />

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
                  minLength={6}
                />

                <button
                  type="submit"
                  className="register-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </form>

              <button
                className="login-link"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                Уже есть аккаунт?
              </button>
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}