import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Failed to refresh user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [refreshUser]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указано';
    
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="profile">
          <div className="container">
            <div className="profile__loading">Загрузка профиля...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="profile">
        <div className="container">
          <section className="profile__wrapper">
            <h1 className="profile__title">Профиль пользователя</h1>

            <div className="profile__card">
              <div className="profile__row">
                <span className="profile__label">Логин:</span>
                <span className="profile__value">
                  {user?.username || 'Не указан'}
                </span>
              </div>

              <div className="profile__row">
                <span className="profile__label">Email:</span>
                <span className="profile__value">
                  {user?.email || 'Не указан'}
                </span>
              </div>

              <div className="profile__row">
                <span className="profile__label">Регистрация:</span>
                <span className="profile__value">
                  {formatDate(user?.created_at)}
                </span>
              </div>

              <div className="profile__row profile__role-row">
                <span className="profile__label">Роль:</span>
                <span className="profile__value profile__role">
                  {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
              </div>
            </div>

            {!user && (
              <div className="profile__error">
                Не удалось загрузить данные профиля
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}