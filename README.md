# 🎓 YouTube Course Scraper

نظام جمع الدورات التعليمية من يوتيوب باستخدام الذكاء الاصطناعي

## 📋 المتطلبات

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- مفتاح OpenAI API
- مفتاح YouTube Data API v3

---

## ⚙️ إعداد قاعدة البيانات

```sql
CREATE DATABASE youtube_courses CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 🔧 إعداد الباك إند (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### تعديل ملف `.env`:

```env
DB_DATABASE=youtube_courses
DB_USERNAME=root
DB_PASSWORD=your_password

OPENAI_API_KEY=sk-your-openai-key
YOUTUBE_API_KEY=your-youtube-api-key
```

### تشغيل الميغريشن:

```bash
php artisan migrate
```

### تشغيل السيرفر:

```bash
php artisan serve
```

السيرفر يعمل على: `http://localhost:8000`

---

## 🎨 إعداد الفرونت إند (React)

```bash
cd frontend
npm install
npm start
```

الفرونت إند يعمل على: `http://localhost:3000`

> **ملاحظة:** Vite مُعد لتوجيه طلبات `/api` تلقائياً إلى `http://localhost:8000`

---

## 🔑 الحصول على مفاتيح API

### OpenAI API Key
1. اذهب إلى [platform.openai.com](https://platform.openai.com)
2. أنشئ حساب أو سجل دخول
3. اذهب إلى API Keys
4. أنشئ مفتاح جديد

### YouTube Data API v3 Key
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. أنشئ مشروع جديد
3. فعّل YouTube Data API v3
4. أنشئ Credentials → API Key

---

## 📡 API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `POST` | `/api/courses/fetch` | جمع دورات جديدة |
| `GET` | `/api/courses` | عرض جميع الدورات |
| `GET` | `/api/courses/categories` | عرض التصنيفات |
| `DELETE` | `/api/courses/reset` | حذف جميع الدورات |


## 🏗️ هيكل المشروع

```
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/CourseController.php
│   │   ├── Models/Playlist.php
│   │   ├── Services/
│   │   │   ├── AIService.php
│   │   │   └── YouTubeService.php
│   │   └── Providers/AppServiceProvider.php
│   ├── config/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env.example
│
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── services/api.ts
│   │   ├── types/index.ts
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🧪 الاختبار

1. شغّل الباك إند والفرونت إند
2. أدخل تصنيفات (مثل: التسويق، البرمجة)
3. اضغط "ابدأ الجمع"
4. انتظر حتى يتم جمع الدورات
5. ستظهر البطاقات في الأسفل

---

## ⚠️ ملاحظات مهمة

- تأكد من أن MySQL يعمل قبل تشغيل الميغريشن
- YouTube Data API لها حد يومي (10,000 وحدة) — استخدمها بحكمة
- الدورات المكررة لا تُضاف مرتين (deduplication تلقائي)
