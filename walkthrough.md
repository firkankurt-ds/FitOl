# FitOl MVP (V6 - Workout State Management) Rehberi

FitOl V6 ile antrenman yönetimi akıllı hale geldi! Geçmiş antrenmanlar korunuyor, aktif antrenmanlar kolayca düzenlenebiliyor.

## Yenilikler (V6)

### 🎯 Akıllı Durum Yönetimi
- **Dinamik Buton Metinleri**:
    - Henüz antrenman yapılmamışsa: "Start Your Workout!"
    - Antrenman başlatıldıysa: "Edit Workout Details"
    - Bu sayede kullanıcı her zaman neyi yapacağını biliyor.

### 🔄 Antrenman Sıfırlama
- **Reset Workout Data**: Bugünün veya gelecek bir tarihin antrenmanını sıfırlamak için buton eklendi.
- Sıfırlama işlemi Progress Chart'ı da etkiliyor (veri tamamen temizleniyor).
- Kullanıcıya onay penceresi gösteriliyor.

### 📖 Geçmiş Antrenman Görünümü
- **Read-Only Mod**: Geçmiş bir tarihteki antrenmana tıklandığında:
    - Tüm detaylar görünür ama düzenlenemez.
    - Üstte "Workout Details" başlığı görünür: "This is a past workout and cannot be edited"
    - Input alanları ve butonlar devre dışı.
    - Sadece tamamlanmış setler için yeşil onay işareti gösteriliyor.

## Temel Özellikler

### 1. Karşılama & Profil
- İlk açılışta verilerinizi girin.
- Profilinizde "Male/Female" ve yeni karşılama mesajını görün.

### 2. Ana Ekran (Dashboard)
- "Plan Your Day" kartı ile bugünün antrenmanını planlayın.
- Durum bazlı buton metinleri ile akıcı deneyim.
- "Workouts and Progress" bölümünden takvime ve grafiklere ulaşın.

### 3. Antrenman Günlüğü (Workout Logger)
- **Program Seçimi**: Listeden günün programını seçin (bugün ve gelecek tarihler için).
- **Veri Girişi**: "Repetitions" ve "Kg" değerlerini girin (tamamen silinebilir).
- **Kaydet**: Antrenmanı bitirince "Finish Workout" butonuna basın.
- **Sıfırla**: "Reset Workout Data" ile antrenmanyı sıfırlayın.

### 4. Geçmiş İnceleme
- Takvimden geçmiş bir tarihe tıklayın.
- O gün yapılan antrenmanı read-only modda inceleyin.
- Hangi setleri tamamladığınızı görün.

## Nasıl Test Edilir?

1.  **Sunucuyu Başlatın**: `npm run dev`
2.  **Tarayıcıyı Açın**: `http://localhost:3000`
3.  **Buton Testleri**:
    - Ana sayfadan "Start Your Workout!" butonuna basın.
    - Bir antrenman seçin ve kaydedin.
    - Ana sayfaya dönün, butonun "Edit Workout Details" olduğunu görün.
4.  **Sıfırlama Testi**:
    - Antrenman ekranında "Reset Workout Data" butonuna basın.
    - Onaylayın ve ana sayfaya dönün. Butonun "Start Your Workout!" olduğunu görün.
5.  **Geçmiş Antrenman Testi**:
    - Daha önceki bir tarih için bir antrenman kaydedin.
    - Takvimden o tarihe tıklayın.
    - Read-only banner ve devre dışı inputları görün.


---

## ✅ Deploy Test & Verification

1. **Test commit** was pushed (`Update README and test auto‑deploy`).
2. Open the Vercel dashboard: https://vercel.com/furkans-projects-9a07fd2a/fit-ol
3. You should see a new deployment (≈ 30 s) with status **“Ready”** and the same production URL:
   - https://fit-r9m7mvbax-furkans-projects-9a07fd2a.vercel.app
4. Open that URL in a browser – the updated README should be visible.

## 📱 iOS PWA Installation Guide

1. Open the live URL on Safari (iPhone/iPad).
2. Tap the **Share** button (square with arrow up).
3. Choose **“Add to Home Screen”.**
4. An app‑like icon (the 180 × 180 px Apple Touch Icon) will appear on the home screen.
5. Launch the app from there – it runs fullscreen, without browser UI, and respects the dark theme.

## 📖 Walkthrough Updates

- Added steps for **auto‑deploy verification**.
- Added **iOS PWA install instructions**.
- Included the newly generated **Apple Touch Icon** (`public/icon-180.png`).

---
