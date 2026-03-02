import "./Profile.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function Profile() {
  return (
    <>
      <Header />

      <main className="profile">
        <div className="container">
          <section className="profile__wrapper">

            <h1 className="profile__title">Профиль</h1>

            <div className="profile__card">

              <div className="profile__row">
                <span className="profile__label">Логин:</span>
                <span className="profile__value">dimarik_1117</span>
              </div>

              <div className="profile__row">
                <span className="profile__label">Email:</span>
                <span className="profile__value">
                  dimaovch.04@mail.ru
                </span>
              </div>

              <div className="profile__row profile__password-row">
                <span className="profile__label">Пароль:</span>
                <span className="profile__value profile__password">
                  ********
                </span>

                <button
                  type="button"
                  className="profile__eye-btn"
                  onClick={() => {}}
                >
                  <img
                    src="../../images/sprite/icon-eye.svg"
                    className="profile__eye-btn-img"
                    alt="Show password"
                  />
                </button>
              </div>

            </div>

          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}