import "./AnalysisDetail.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function AnalysisDetail() {
  return (
    <>
      <Header />

      <main className="analysis">
        <div className="container">
          <section className="analysis__wrapper">
            <h1 className="analysis__title">Результат</h1>

            <div className="analysis__content">
              
              <div className="analysis__image-block">
                <div className="analysis__image-placeholder">
                  Bounding Boxes
                </div>
              </div>

              <div className="analysis__info-block">
                
                <div className="analysis__info-row">
                  <span className="analysis__label">Файл:</span>
                  <span className="analysis__value">1.jpg</span>
                </div>

                <div className="analysis__info-row">
                  <span className="analysis__label">Дата:</span>
                  <span className="analysis__value">29.01.2026</span>
                </div>

                <div className="analysis__info-row">
                  <span className="analysis__label">Кол-во опор:</span>
                  <span className="analysis__value">3</span>
                </div>

                <div className="analysis__info-row">
                  <span className="analysis__label">Время:</span>
                  <span className="analysis__value">0.132 c</span>
                </div>

              </div>

            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}