import { useNavigate } from "react-router-dom";

import "./Register.css";

import Footer from "../../components/Footer/Footer";

export default function Register() {
  const navigate = useNavigate();

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

              <form className="register__form">
                <input
                  type="text"
                  placeholder="Логин"
                  className="input-field"
                />

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
                  className="register-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  Зарегистрироваться
                </button>
              </form>

              <button
                className="login-link"
                onClick={() => navigate("/")}
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