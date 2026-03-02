import { useNavigate } from "react-router-dom";

import "./Login.css";

import Footer from "../../components/Footer/Footer";

export default function Login() {
  const navigate = useNavigate();

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

              <form className="login__form">
                <input
                  type="email"
                  placeholder="Email"
                  className="input-field"
                />

                <input
                  type="password"
                  placeholder="Пароль"
                  className="input-field"
                />

                <button
                  type="button"
                  className="login-button"
                  onClick={() => navigate("/dashboard")}
                >
                  Войти
                </button>
              </form>

              <button
                className="register-link"
                onClick={() => navigate("/register")}
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