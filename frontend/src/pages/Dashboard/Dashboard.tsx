import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import type { Analysis } from '../../types';
import './Dashboard.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await api.get<Analysis[]>('/analyses');
        const sorted = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecentAnalyses(sorted.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch recent analyses', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getDisplayFilename = (analysis: Analysis): string => {
    if (analysis.original_filename) {
      return analysis.original_filename;
    }
    return analysis.image_path.split('\\').pop()?.split('/').pop() || 'Неизвестный файл';
  };

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
              onClick={() => navigate('/new-analysis')}
            >
              Создать анализ
            </button>
          </section>

          <section className="dashboard__history">
            <button
              type="button"
              className="dashboard__history-header"
              onClick={() => navigate('/history')}
            >
              История
            </button>

            <div className="dashboard__history-body">
              <h3 className="dashboard__history-body-title">
                {isLoading ? 'Загрузка...' : 'Последние 3 анализа'}
              </h3>

              {!isLoading && recentAnalyses.length === 0 ? (
                <p className="no-analyses">У вас пока нет анализов</p>
              ) : (
                <ul className="dashboard__history-body-list">
                  {recentAnalyses.map((analysis) => (
                    <li 
                      key={analysis.id} 
                      className="dashboard__history-body-item"
                      onClick={() => navigate(`/analysis/${analysis.id}`)}
                    >
                      {getDisplayFilename(analysis)}:{' '}
                      {formatDate(analysis.created_at)};{' '}
                      Опоры: {analysis.poles_number || '—'},{' '}
                      Время: {analysis.processing_time?.toFixed(3) || '—'}с
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}