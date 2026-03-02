import { useNavigate } from "react-router-dom";

import "./History.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function History() {
  const navigate = useNavigate();

  const data = [
    { id: 1, file: "1.jpg", date: "29.01.2026 22:23:48", quantity: 3, time: "0.132c" },
    { id: 2, file: "2.jpg", date: "29.01.2026 22:23:48", quantity: 2, time: "0.238c" },
    { id: 3, file: "3.jpg", date: "29.01.2026 22:23:48", quantity: 4, time: "0.066c" },
    { id: 4, file: "4.jpg", date: "29.01.2026 22:23:48", quantity: 5, time: "0.200c" },
    { id: 5, file: "5.jpg", date: "29.01.2026 22:23:48", quantity: 6, time: "0.150c" },
  ];

  return (
    <>
      <Header />

      <main className="history">
        <div className="container">
          <section className="history__wrapper">

            <h1 className="history__title">
              История запросов
            </h1>

            <div className="history__table-wrapper">

              <table className="history__table">
                <thead className="history__thead">
                  <tr className="history__header-row">
                    <th>Файл</th>
                    <th>Дата</th>
                    <th>Кол-во опор</th>
                    <th>Время</th>
                  </tr>
                </thead>

                <tbody className="history__tbody">
                  {data.map((item) => (
                    <tr key={item.id} className="history__row">
                      <td>{item.file}</td>
                      <td>{item.date}</td>
                      <td>{item.quantity}</td>
                      <td>{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="history__actions">
                {data.map((item) => (
                  <div key={item.id} className="history__buttons">
                    
                    <button
                      type="button"
                      className="history__btn"
                      onClick={() => navigate(`/analysis/${item.id}`)}
                    >
                      <img
                        src="../../images/sprite/icon-open.svg"
                        className="history__btn-img"
                        alt="Open"
                      />
                    </button>

                    <button
                      type="button"
                      className="history__btn"
                    >
                      <img
                        src="../../images/sprite/icon-cross.svg"
                        className="history__btn-img"
                        alt="Delete"
                      />
                    </button>

                  </div>
                ))}
              </div>

            </div>

          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}