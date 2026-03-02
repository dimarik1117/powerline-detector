import { useNavigate } from "react-router-dom";

import "./NewAnalysis.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function NewAnalysis() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main className="new-analysis">
        <div className="container">
          <section className="new-analysis__wrapper">
            
            <h1 className="new-analysis__title">
              Новый анализ
            </h1>

            <div className="new-analysis__grid">
              <div className="new-analysis__drag">
                Drag & Drop
              </div>

              <div className="new-analysis__preview">
                Превью
              </div>

              <button
                type="button"
                className="new-analysis__launch"
                onClick={() => navigate("/analysis/1")}
              >
                Запустить анализ
              </button>

              <div className="new-analysis__loading">
                Загрузка
              </div>

            </div>

          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}