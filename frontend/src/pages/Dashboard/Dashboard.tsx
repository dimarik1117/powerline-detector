import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function Dashboard() {
  const navigate = useNavigate();
  
  return (
    <>
      <Header />

      <main className="dashboard">
        <div className="container">

          <section className="dashboard__hero">
            <h1 className="dashboard__hero-title">
              Обнаружение и классификация опор ЛЭП
            </h1>

              <button
                type="button"
                className="dashboard__create-btn"
                onClick={() => navigate("/new-analysis")}
              >
                Создать анализ
              </button>
          </section>

          <section className="dashboard__history">
            
            <button
              type="button"
              className="dashboard__history-header"
              onClick={() => navigate("/history")}
            >
              История
            </button>

            <div className="dashboard__history-body">
              <h3 className="dashboard__history-body-title">Последние 3 анализа</h3>

              <ul className="dashboard__history-body-list">
                <li className="dashboard__history-body-item">
                  1.jpg: 29.01.2026, 22:23:48; Опоры: 3, Время: 0.132с
                </li>
                <li className="dashboard__history-body-item">
                  2.jpg: 28.01.2026, 18:11:02; Опоры: 5, Время: 0.154с
                </li>
                <li className="dashboard__history-body-item">
                  3.jpg: 27.01.2026, 12:45:33; Опоры: 2, Время: 0.120с
                </li>
              </ul>

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}