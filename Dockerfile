FROM python:3.10-slim

# Устанавливаем Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Рабочая директория
WORKDIR /app

# Копируем весь проект
COPY . .

# Устанавливаем зависимости backend
WORKDIR /app/backend
RUN pip install -r requirements.txt

# Устанавливаем зависимости frontend
WORKDIR /app/frontend
RUN npm install

# Возвращаемся в корень проекта
WORKDIR /app

# Запускаем backend и frontend одновременно
CMD bash -c "cd backend && python main.py & cd ../frontend && npm run dev"
