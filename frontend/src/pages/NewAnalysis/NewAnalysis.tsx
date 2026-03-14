import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import type { DetectionResult } from '../../types';
import './NewAnalysis.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Выберите изображение для анализа');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const result = await api.uploadFile<DetectionResult>('/ml/detect', selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      localStorage.setItem('lastAnalysisId', result.analysis_id.toString());
      
      setTimeout(() => {
        navigate(`/analysis/${result.analysis_id}`);
      }, 500);
      
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Ошибка при анализе');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="new-analysis">
        <div className="container">
          <section className="new-analysis__wrapper">
            <h1 className="new-analysis__title">
              Новый анализ
            </h1>

            {error && <div className="error-message">{error}</div>}

            <div className="new-analysis__grid">
              <div
                className={`new-analysis__drag ${selectedFile ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {!selectedFile ? (
                  'Drag & Drop'
                ) : (
                  <div className="file-info">
                    <span>{selectedFile.name}</span>
                    <span className="file-size">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="new-analysis__preview">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="preview-image"
                  />
                ) : (
                  'Превью'
                )}
              </div>

              <button
                type="button"
                className="new-analysis__launch"
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? 'Анализ...' : 'Запустить анализ'}
              </button>

              <div className="new-analysis__loading">
                {isLoading ? (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                    <span className="progress-text">{progress}%</span>
                  </div>
                ) : (
                  'Загрузка'
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}