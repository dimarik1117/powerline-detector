import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import type { Analysis } from '../../types';
import './AnalysisDetail.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function AnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) {
        setError('ID анализа не указан');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const data = await api.get<Analysis>(`/analyses/${id}`);
        setAnalysis(data);
        
        if (data.image_path) {
          setImageLoading(true);
          try {
            const filename = data.image_path.split('\\').pop()?.split('/').pop();
            
            const imageResponse = await fetch(
              `http://localhost:5000/api/v1/ml/images/${filename}`,
              {
                headers: {
                  'Authorization': `Bearer ${api.getToken()}`,
                },
              }
            );
            
            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              const url = URL.createObjectURL(blob);
              setImageUrl(url);
            } else {
              console.error('Failed to load image');
            }
          } catch (imgErr) {
            console.error('Error loading image:', imgErr);
          } finally {
            setImageLoading(false);
          }
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки анализа');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

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

  const getDisplayFilename = (): string => {
    if (!analysis) return '—';
    if (analysis.original_filename) {
      return analysis.original_filename;
    }
    return analysis.image_path.split('\\').pop()?.split('/').pop() || 'Неизвестный файл';
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="analysis">
          <div className="container">
            <div className="loading">Загрузка анализа...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !analysis) {
    return (
      <>
        <Header />
        <main className="analysis">
          <div className="container">
            <div className="error">{error || 'Анализ не найден'}</div>
            <button onClick={() => navigate('/history')} className="back-btn">
              Вернуться к истории
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="analysis">
        <div className="container">
          <section className="analysis__wrapper">
            <h1 className="analysis__title">Результат анализа</h1>

            <div className="analysis__content">
              <div className="analysis__image-block">
                {imageLoading ? (
                  <div className="image-loading">Загрузка изображения...</div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Analysis result"
                    className="analysis__image"
                  />
                ) : (
                  <div className="analysis__image-placeholder">
                    Изображение не найдено
                  </div>
                )}
              </div>

              <div className="analysis__info-block">
                <div className="analysis__info-row">
                  <span className="analysis__label">Файл:</span>
                  <span className="analysis__value">
                    {getDisplayFilename()}
                  </span>
                </div>

                <div className="analysis__info-row">
                  <span className="analysis__label">Дата:</span>
                  <span className="analysis__value">
                    {formatDate(analysis.created_at)}
                  </span>
                </div>

                <div className="analysis__info-row">
                  <span className="analysis__label">Кол-во опор:</span>
                  <span className="analysis__value">
                    {analysis.poles_number || '0'}
                  </span>
                </div>

                <div className="analysis__info-row">
                  <span className="analysis__label">Время обработки:</span>
                  <span className="analysis__value">
                    {analysis.processing_time ? `${analysis.processing_time.toFixed(3)} с` : '—'}
                  </span>
                </div>

                {analysis.bounding_boxes && analysis.bounding_boxes.length > 0 && (
                  <div className="analysis__boxes-info">
                    <h3 className="analysis__label">Детектированные объекты:</h3>
                    <ul>
                      {analysis.bounding_boxes.map((box, index) => (
                        <li key={index}>
                          Опора {index + 1}: уверенность{' '}
                          {(box.confidence * 100).toFixed(1)}%
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => navigate('/history')} 
              className="back-to-history-btn"
            >
            К истории запросов
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}