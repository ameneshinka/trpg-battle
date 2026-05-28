# Firebase 設定步驟

## 1. 建立 Firebase 專案

1. 前往 https://console.firebase.google.com/
2. 點「新增專案」→ 輸入專案名稱（如 `trpg-battle`）
3. 關閉 Google Analytics（不需要）
4. 等待建立完成

## 2. 建立 Realtime Database

1. 在左側選「建立」→「Realtime Database」
2. 點「建立資料庫」
3. 選擇地區：**asia-southeast1（新加坡）**（台灣用最快）
4. 安全性規則選「**以測試模式啟動**」（之後再收緊）
5. 完成後你會看到資料庫 URL，格式為：
   `https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app`

## 3. 取得網頁設定

1. 在 Firebase Console 首頁，點齒輪圖示→「專案設定」
2. 往下滾到「你的應用程式」→ 點「</>」（網頁）
3. 輸入應用程式暱稱（如 `trpg-web`），**不**需要 Hosting
4. 你會看到 `firebaseConfig` 物件，裡面有：
   - apiKey
   - authDomain
   - databaseURL
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

## 4. 建立本機 .env.local

複製 `.env.local.example`，改名為 `.env.local`，填入上面的值：

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=trpg-battle-xxxxx.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://trpg-battle-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=trpg-battle-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=trpg-battle-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

然後執行：
```bash
npm run dev
```

## 5. 設定 GitHub Pages 部署（可選）

1. 在 GitHub 建立 repo（名稱建議 `trpg-battle`）
2. 在 repo 設定→ Secrets and variables → Actions，新增上面所有 `VITE_*` 環境變數
3. 在 repo 設定→ Pages → Source 選「GitHub Actions」
4. Push 到 main branch，自動部署

## 6. Realtime Database 安全規則（正式上線前調整）

目前使用測試模式（所有人可讀寫）。上線前建議改為：

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

之後如需限制，可加入 Firebase Authentication。
