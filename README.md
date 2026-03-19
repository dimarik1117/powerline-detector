# PowerLine Detector - Сервис для обнаружения и классификации опор ЛЭП

## О проекте

Веб-сервис для автоматического обнаружения и классификации опор линий электропередач (ЛЭП) на фотографиях с использованием компьютерного зрения и нейронных сетей.

## О модели
В проекте используется YOLOv8 (You Only Look Once) - современная нейросеть для обнаружения объектов в реальном времени.

## Технологический стек

### Бэкенд
- Python 3.10+
- FastAPI - современный веб-фреймворк
- SQLAlchemy - ORM для работы с БД
- PostgreSQL - реляционная база данных
- YOLOv8 (Ultralytics) - нейросеть для детекции объектов
- PyTorch - фреймворк глубокого обучения
- JWT - аутентификация
- OpenCV/Pillow - обработка изображений

### Фронтенд
- React 18
- TypeScript - типизация
- React Router - навигация
- Context API - управление состоянием
- CSS Modules - стилизация
- Fetch API - HTTP клиент

## Запуск проекта

### 1. Клонирование репозитория

```bash
git clone https://github.com/dimarik1117/powerline-detector.git
cd powerline-detector
```

### 2. Настройка базы данных

Создайте базу данных в PostgreSQL:

```bash
# Вход в PostgreSQL
psql -U postgres

# Создание базы данных
CREATE DATABASE powerline_db;

# Выход
\q
```

### 3. Запуск с помощью Docker:

Проект можно запустить с использованием Docker, что избавляет от необходимости вручную устанавливать зависимости и настраивать окружение.

```bash
# Сборка Docker образа
docker build -t powerline-detector .

# Запуск контейнера
docker run -p 5000:5000 -p 3000:3000 powerline-detector
```

После запуска:

- Фронтенд будет доступен по адресу: http://localhost:3000
- Бэкенд API будет доступен по адресу: http://localhost:5000
- Документация Swagger: http://localhost:5000/docs

### 4. Альтернативный запуск без Docker:

Бэкенд

```bash
# Переход в директорию бэкенда
cd backend

# Создание виртуального окружения (рекомендуется)
python -m venv venv

# Активация виртуального окружения
# На Windows:
venv\Scripts\activate
# На Linux/Mac:
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
python main.py
```

Фронтенд (откройте новый терминал)

```bash
# Переход в директорию фронтенда
cd frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```