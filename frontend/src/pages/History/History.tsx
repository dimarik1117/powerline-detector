import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import type { Analysis } from '../../types';
import './History.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

type SortField = 'filename' | 'date' | 'poles' | 'time';
type SortDirection = 'asc' | 'desc';

export default function History() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Analysis[]>('/analyses');
      setAnalyses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки истории');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот анализ?')) {
      return;
    }

    try {
      await api.delete(`/analyses/${id}`);
      setAnalyses(analyses.filter(a => a.id !== id));
    } catch (err) {
      alert('Ошибка при удалении анализа');
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getHeaderClass = (field: SortField) => {
    return `sortable-header ${field === sortField ? `sorting-${sortDirection}` : ''}`;
  };

  const getDisplayFilename = (analysis: Analysis): string => {
    if (analysis.original_filename) {
      return analysis.original_filename;
    }
    return analysis.image_path.split('\\').pop()?.split('/').pop() || 'Неизвестный файл';
  };

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

  const sortedAnalyses = useMemo(() => {
    const sorted = [...analyses];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'filename': {
          const nameA = getDisplayFilename(a).toLowerCase();
          const nameB = getDisplayFilename(b).toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        }
        case 'date': {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          comparison = dateA - dateB;
          break;
        }
        case 'poles': {
          const polesA = a.poles_number ?? 0;
          const polesB = b.poles_number ?? 0;
          comparison = polesA - polesB;
          break;
        }
        case 'time': {
          const timeA = a.processing_time ?? 0;
          const timeB = b.processing_time ?? 0;
          comparison = timeA - timeB;
          break;
        }
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [analyses, sortField, sortDirection]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="history">
          <div className="container">
            <div className="loading">Загрузка...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="history">
        <div className="container">
          <section className="history__wrapper">
            <h1 className="history__title">
              История запросов
            </h1>

            {error && <div className="error-message">{error}</div>}

            {sortedAnalyses.length === 0 ? (
              <div className="no-data">
                <p>У вас пока нет анализов</p>
                <button
                  onClick={() => navigate('/new-analysis')}
                  className="create-analysis-btn"
                >
                  Создать первый анализ
                </button>
              </div>
            ) : (
              <div className="history__table-wrapper">
                <table className="history__table">
                  <thead className="history__thead">
                    <tr className="history__header-row">
                      <th 
                        className={getHeaderClass('filename')}
                        onClick={() => handleSort('filename')}
                      >
                        Файл {getSortIcon('filename')}
                      </th>
                      <th 
                        className={getHeaderClass('date')}
                        onClick={() => handleSort('date')}
                      >
                        Дата {getSortIcon('date')}
                      </th>
                      <th 
                        className={getHeaderClass('poles')}
                        onClick={() => handleSort('poles')}
                      >
                        Кол-во опор {getSortIcon('poles')}
                      </th>
                      <th 
                        className={getHeaderClass('time')}
                        onClick={() => handleSort('time')}
                      >
                        Время (с) {getSortIcon('time')}
                      </th>
                      <th className="actions-header">Действия</th>
                    </tr>
                  </thead>

                  <tbody className="history__tbody">
                    {sortedAnalyses.map((item) => (
                      <tr key={item.id} className="history__row">
                        <td>{getDisplayFilename(item)}</td>
                        <td>{formatDate(item.created_at)}</td>
                        <td className="number-cell">{item.poles_number || '0'}</td>
                        <td className="number-cell">
                          {item.processing_time?.toFixed(3) || '—'}
                        </td>
                        <td>
                          <div className="history__buttons">
                            <button
                              type="button"
                              className="history__btn history__btn-open"
                              onClick={() => navigate(`/analysis/${item.id}`)}
                              title="Открыть"
                            >
                              <img
                                src="../../images/sprite/icon-open.svg"
                                className="history__btn-img"
                                alt="Open"
                              />
                            </button>

                            <button
                              type="button"
                              className="history__btn history__btn-delete"
                              onClick={() => handleDelete(item.id)}
                              title="Удалить"
                            >
                              <img
                                src="../../images/sprite/icon-cross.svg"
                                className="history__btn-img"
                                alt="Delete"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="history__info">
                  Всего записей: {sortedAnalyses.length}
                  {sortField && (
                    <span className="sort-info">
                      {' '}
                      (сортировка - {sortField === 'filename' && 'по названию'}
                      {sortField === 'date' && 'по дате'}
                      {sortField === 'poles' && 'по количеству опор'}
                      {sortField === 'time' && 'по времени обработки'}
                      , {sortDirection === 'asc' ? 'возрастание' : 'убывание'})
                    </span>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}