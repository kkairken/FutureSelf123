#!/bin/bash
echo "🗄️  Настройка базы данных Future Self"
echo ""
echo "Шаг 1: Скопируйте .env.example в .env"
cp .env.example .env 2>/dev/null || echo "✓ .env уже существует"
echo ""
echo "Шаг 2: Откройте .env и вставьте ваш DATABASE_URL из Neon:"
echo "  DATABASE_URL=\"postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require\""
echo ""
read -p "Нажмите Enter когда добавите DATABASE_URL в .env файл..."
echo ""
echo "Шаг 3: Применяем схему Prisma к базе данных..."
npx prisma db push
echo ""
echo "✅ Готово! Таблицы созданы в Neon."
echo ""
echo "Хотите открыть Prisma Studio для просмотра? (y/n)"
read -r answer
if [ "$answer" = "y" ]; then
  npx prisma studio
fi
