# 📱 Phase 9: Mobile App - AEGIS Platform

## 📋 סקירה כללית

**שם המודול:** Mobile App (אפליקציה ניידת)  
**מטרה:** אפליקציה ניידת לביצוע ביקורות בשטח ופורטל לקוח  
**תלויות:** Phase 1-8 (כל המודולים הקודמים)  
**זמן פיתוח משוער:** 6-8 שבועות  

---

## 🎯 מה כולל המודול

| רכיב | תיאור | עדיפות |
|------|--------|--------|
| PWA | Progressive Web App | 🔴 קריטי |
| Offline Support | עבודה ללא חיבור | 🔴 קריטי |
| Camera Integration | צילום תמונות | 🔴 קריטי |
| Signature Capture | חתימה במובייל | 🔴 קריטי |
| Push Notifications | התראות Push | 🟠 גבוה |
| GPS Location | מיקום GPS | 🟡 בינוני |
| Native App | React Native (עתידי) | 🟢 עתידי |

---

## 📱 גישה מומלצת: PWA First

```
┌─────────────────────────────────────────────────────────────────┐
│                    Mobile Strategy                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🥇 שלב 1: PWA (Progressive Web App)                           │
│  ─────────────────────────────────────────────────────────────  │
│  • עובד על כל מכשיר (iOS, Android, Desktop)                   │
│  • התקנה מהדפדפן                                               │
│  • Offline support                                              │
│  • Push notifications                                           │
│  • Camera access                                                │
│  • ללא צורך ב-App Store                                        │
│                                                                 │
│  🥈 שלב 2 (עתידי): React Native                                │
│  ─────────────────────────────────────────────────────────────  │
│  • Native performance                                           │
│  • App Store presence                                           │
│  • יכולות מתקדמות                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ ארכיטקטורת PWA

### Service Worker

```typescript
// sw.ts - Service Worker

// Cache strategies
const CACHE_NAME = 'aegis-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // CSS, JS bundles
];

const API_CACHE = 'aegis-api-v1';

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Fetch - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // API calls - network first
    event.respondWith(networkFirst(event.request));
  } else {
    // Static assets - cache first
    event.respondWith(cacheFirst(event.request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-inspections') {
    event.waitUntil(syncInspections());
  }
  if (event.tag === 'sync-photos') {
    event.waitUntil(syncPhotos());
  }
});
```

### Web App Manifest

```json
// manifest.json
{
  "name": "AEGIS Safety Management",
  "short_name": "AEGIS",
  "description": "מערכת ניהול בטיחות",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "dir": "rtl",
  "lang": "he",
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "ביקורות היום",
      "short_name": "היום",
      "url": "/admin/inspections?filter=today",
      "icons": [{ "src": "/icons/calendar.png", "sizes": "96x96" }]
    },
    {
      "name": "ליקויים פתוחים",
      "short_name": "ליקויים",
      "url": "/admin/findings?status=open",
      "icons": [{ "src": "/icons/warning.png", "sizes": "96x96" }]
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

---

## 📴 Offline Support

### IndexedDB Schema

```typescript
// db/offlineDB.ts

interface OfflineDB {
  // תורים לסנכרון
  pendingInspections: PendingInspection[];
  pendingPhotos: PendingPhoto[];
  pendingCorrections: PendingCorrection[];
  
  // נתונים מקומיים
  cachedClients: Client[];
  cachedTemplates: Template[];
  cachedInspections: Inspection[];
  
  // מטא
  lastSyncAt: Date;
  syncStatus: 'idle' | 'syncing' | 'error';
}

interface PendingInspection {
  id: string;
  localId: string;                 // ID מקומי זמני
  data: Partial<Inspection>;
  action: 'create' | 'update';
  createdAt: Date;
  retryCount: number;
  error?: string;
}

interface PendingPhoto {
  id: string;
  inspectionId: string;
  localUri: string;                // URI מקומי
  blob: Blob;
  metadata: {
    caption?: string;
    category?: string;
    location?: GeolocationPosition;
  };
  createdAt: Date;
  uploaded: boolean;
}
```

### Sync Manager

```typescript
// hooks/useOfflineSync.ts

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  
  // מעקב אחרי חיבור
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // סנכרון
  const triggerSync = async () => {
    if (!navigator.onLine || isSyncing) return;
    
    setIsSyncing(true);
    try {
      // סנכרון ביקורות
      await syncPendingInspections();
      
      // סנכרון תמונות
      await syncPendingPhotos();
      
      // סנכרון תיקונים
      await syncPendingCorrections();
      
      // עדכון cache
      await refreshCache();
    } finally {
      setIsSyncing(false);
    }
  };
  
  return { isOnline, isSyncing, pendingCount, triggerSync };
}
```

---

## 📸 Camera Integration

### Camera Hook

```typescript
// hooks/useCamera.ts

interface UseCameraOptions {
  quality?: number;                // 0-1
  maxWidth?: number;
  maxHeight?: number;
  facingMode?: 'user' | 'environment';
}

export function useCamera(options: UseCameraOptions = {}) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080,
    facingMode = 'environment'
  } = options;
  
  // פתיחת מצלמה
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: maxWidth },
          height: { ideal: maxHeight }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('לא ניתן לגשת למצלמה');
    }
  };
  
  // צילום
  const capture = async (): Promise<Blob | null> => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          setIsCapturing(false);
          resolve(blob);
        },
        'image/jpeg',
        quality
      );
    });
  };
  
  // סגירת מצלמה
  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };
  
  return {
    videoRef,
    canvasRef,
    isCapturing,
    error,
    openCamera,
    capture,
    closeCamera
  };
}
```

### Camera Component

```typescript
// components/mobile/CameraCapture.tsx

interface CameraCaptureProps {
  onCapture: (photo: Blob, location?: GeolocationPosition) => void;
  onClose: () => void;
  includeLocation?: boolean;
}

export function CameraCapture({ onCapture, onClose, includeLocation }: CameraCaptureProps) {
  const { videoRef, canvasRef, capture, openCamera, closeCamera } = useCamera();
  const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  
  useEffect(() => {
    openCamera();
    
    if (includeLocation) {
      navigator.geolocation.getCurrentPosition(setLocation);
    }
    
    return () => closeCamera();
  }, []);
  
  const handleCapture = async () => {
    const photo = await capture();
    if (photo) {
      setCapturedPhoto(photo);
    }
  };
  
  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto, location || undefined);
    }
  };
  
  const handleRetake = () => {
    setCapturedPhoto(null);
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50">
      {!capturedPhoto ? (
        <>
          {/* Live preview */}
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          
          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-4">
            <button onClick={onClose} className="btn-secondary">
              ביטול
            </button>
            <button onClick={handleCapture} className="btn-primary rounded-full p-4">
              📷
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Preview captured photo */}
          <img 
            src={URL.createObjectURL(capturedPhoto)} 
            className="w-full h-full object-contain"
          />
          
          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-4">
            <button onClick={handleRetake} className="btn-secondary">
              צלם שוב
            </button>
            <button onClick={handleConfirm} className="btn-primary">
              ✓ אשר
            </button>
          </div>
        </>
      )}
      
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
```

---

## ✍️ Signature Capture

### Signature Component

```typescript
// components/mobile/SignatureCapture.tsx

interface SignatureCaptureProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel: () => void;
  signerName?: string;
}

export function SignatureCapture({ onSave, onCancel, signerName }: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // הגדרת Canvas
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // רקע לבן
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDrawing(true);
    setHasSignature(true);
    draw(e);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };
  
  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };
  
  const save = () => {
    if (!hasSignature) return;
    
    const dataUrl = canvasRef.current?.toDataURL('image/png');
    if (dataUrl) {
      onSave(dataUrl);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">חתימה</h2>
        {signerName && <p className="text-gray-600">{signerName}</p>}
      </div>
      
      {/* Canvas */}
      <div className="flex-1 p-4">
        <div className="border-2 border-gray-300 rounded-lg h-full">
          <canvas
            ref={canvasRef}
            width={window.innerWidth - 48}
            height={300}
            className="w-full touch-none"
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
        <p className="text-center text-gray-500 mt-2">חתום באצבע או בעט</p>
      </div>
      
      {/* Controls */}
      <div className="p-4 border-t flex gap-4">
        <button onClick={onCancel} className="btn-secondary flex-1">
          ביטול
        </button>
        <button onClick={clear} className="btn-secondary flex-1">
          נקה
        </button>
        <button 
          onClick={save} 
          className="btn-primary flex-1"
          disabled={!hasSignature}
        >
          אשר
        </button>
      </div>
    </div>
  );
}
```

---

## 🔔 Push Notifications

### FCM Setup

```typescript
// firebase/messaging.ts

import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }
    
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: process.env.VITE_FIREBASE_VAPID_KEY
    });
    
    return token;
  } catch (error) {
    console.error('Error getting notification token:', error);
    return null;
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  const messaging = getMessaging();
  
  return onMessage(messaging, (payload) => {
    console.log('Foreground message:', payload);
    callback(payload);
  });
}
```

### Push Notification Hook

```typescript
// hooks/usePushNotifications.ts

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  
  useEffect(() => {
    // בדיקת הרשאה קיימת
    setPermission(Notification.permission);
    
    // האזנה להודעות ב-foreground
    const unsubscribe = onForegroundMessage((payload) => {
      // הצג toast notification
      showToast({
        title: payload.notification?.title,
        body: payload.notification?.body,
        onClick: () => handleNotificationClick(payload.data)
      });
    });
    
    return unsubscribe;
  }, []);
  
  const requestPermission = async () => {
    const fcmToken = await requestNotificationPermission();
    
    if (fcmToken) {
      setToken(fcmToken);
      setPermission('granted');
      
      // שמירת token בשרת
      await saveUserFCMToken(fcmToken);
    }
  };
  
  return { token, permission, requestPermission };
}
```

---

## 📍 GPS Location

### Location Hook

```typescript
// hooks/useLocation.ts

interface LocationState {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
}

export function useLocation(options?: PositionOptions) {
  const [state, setState] = useState<LocationState>({
    position: null,
    error: null,
    loading: false
  });
  
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return;
    }
    
    setState(prev => ({ ...prev, loading: true }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position,
          error: null,
          loading: false
        });
      },
      (error) => {
        setState({
          position: null,
          error: error.message,
          loading: false
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options
      }
    );
  }, [options]);
  
  return { ...state, getLocation };
}
```

---

## 🖥️ Mobile UI Components

### Mobile Layout

```typescript
// components/mobile/MobileLayout.tsx

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function MobileLayout({ 
  children, 
  title, 
  showBack, 
  onBack,
  actions 
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {showBack && (
              <button onClick={onBack} className="p-2">
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
            {title && <h1 className="text-lg font-bold">{title}</h1>}
          </div>
          {actions}
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
}
```

### Bottom Navigation

```typescript
// components/mobile/MobileNavigation.tsx

export function MobileNavigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin', icon: Home, label: 'ראשי' },
    { path: '/admin/inspections', icon: ClipboardList, label: 'ביקורות' },
    { path: '/admin/findings', icon: AlertTriangle, label: 'ליקויים' },
    { path: '/admin/clients', icon: Building, label: 'לקוחות' },
    { path: '/admin/profile', icon: User, label: 'פרופיל' },
  ];
  
  return (
    <nav className="bg-white border-t safe-area-pb">
      <div className="flex justify-around">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### Offline Indicator

```typescript
// components/mobile/OfflineIndicator.tsx

export function OfflineIndicator() {
  const { isOnline, isSyncing, pendingCount } = useOfflineSync();
  
  if (isOnline && pendingCount === 0) return null;
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-2 text-center text-sm ${
      isOnline ? 'bg-yellow-500' : 'bg-red-500'
    } text-white`}>
      {!isOnline && '📴 אין חיבור לאינטרנט - עובד במצב לא מקוון'}
      {isOnline && isSyncing && '🔄 מסנכרן נתונים...'}
      {isOnline && !isSyncing && pendingCount > 0 && 
        `⏳ ${pendingCount} פריטים ממתינים לסנכרון`
      }
    </div>
  );
}
```

---

## 📱 מסכים מותאמים למובייל

### ביקורת במובייל

```
┌─────────────────────────┐
│ ◀ ביקורת רבעונית       │
│ רול פרופיל              │
├─────────────────────────┤
│ ████████████░░░░ 60%    │
├─────────────────────────┤
│                         │
│ 3. ציוד בטיחות (3/5)   │
│                         │
│ ┌─────────────────────┐ │
│ │ ☑️ משקפי מגן       │ │
│ │ [✅ תקין ▼]         │ │
│ │                     │ │
│ │ כמות: [5__]         │ │
│ │                     │ │
│ │ [📷 צלם]            │ │
│ │ ┌────┐              │ │
│ │ │ 📷 │ (1 תמונה)   │ │
│ │ └────┘              │ │
│ │                     │ │
│ │ [💬 הערה]           │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ❌ שילוט אזהרה     │ │
│ │ [⚠️ לא תקין ▼]      │ │
│ │                     │ │
│ │ חומרה: [🟠 גבוה]    │ │
│ │                     │ │
│ │ [📷 צלם]            │ │
│ │ ┌────┐ ┌────┐       │ │
│ │ │ 📷 │ │ 📷 │       │ │
│ │ └────┘ └────┘       │ │
│ │                     │ │
│ │ תיאור:              │ │
│ │ [שלט דהוי וקשה    ] │ │
│ │ [לקריאה...        ] │ │
│ │                     │ │
│ │ [📋 צור ליקוי]      │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ [◀ הקודם] [סיים ▶]     │
├─────────────────────────┤
│ 🏠  📋  ⚠️  🏢  👤     │
└─────────────────────────┘
```

### פורטל לקוח במובייל

```
┌─────────────────────────┐
│ 🏠 רול פרופיל     [🔔3] │
│ שלום, עדי               │
├─────────────────────────┤
│                         │
│ ┌─────────┐┌─────────┐  │
│ │   ✅    ││   ⚠️2   │  │
│ │  תקין   ││ ליקויים │  │
│ └─────────┘└─────────┘  │
│                         │
│ ┌─────────┐┌─────────┐  │
│ │  📅45   ││  ✓4/4   │  │
│ │  ימים   ││ הדרכות  │  │
│ └─────────┘└─────────┘  │
│                         │
│ ─────────────────────── │
│ ⚠️ ליקויים פתוחים      │
│ ─────────────────────── │
│                         │
│ ┌─────────────────────┐ │
│ │ 🟠 שילוט דהוי       │ │
│ │ יעד: 05/01 (5 ימים) │ │
│ │           [📤 תיקון]│ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 🟡 תיעוד חסר        │ │
│ │ יעד: 20/01 (20 ימים)│ │
│ │           [📤 תיקון]│ │
│ └─────────────────────┘ │
│                         │
│ ─────────────────────── │
│ 📋 דוחות אחרונים       │
│ ─────────────────────── │
│                         │
│ 📄 ביקורת Q4     [PDF]  │
│ 📄 ביקורת Q3     [PDF]  │
│                         │
├─────────────────────────┤
│ 🏠  ⚠️  📋  📁  👤     │
└─────────────────────────┘
```

---

## 📁 מבנה קבצים

```
frontend/src/
├── pwa/
│   ├── sw.ts                      # Service Worker
│   ├── manifest.json              # Web App Manifest
│   └── offlineDB.ts               # IndexedDB schema
│
├── hooks/
│   ├── useOfflineSync.ts          # Offline sync
│   ├── useCamera.ts               # Camera access
│   ├── useLocation.ts             # GPS
│   ├── usePushNotifications.ts    # FCM
│   └── useInstallPrompt.ts        # PWA install
│
├── components/mobile/
│   ├── MobileLayout.tsx           # Layout ראשי
│   ├── MobileNavigation.tsx       # Bottom nav
│   ├── MobileHeader.tsx           # Header
│   ├── OfflineIndicator.tsx       # Offline banner
│   ├── CameraCapture.tsx          # צילום
│   ├── SignatureCapture.tsx       # חתימה
│   ├── PhotoGallery.tsx           # גלריית תמונות
│   ├── SwipeableCard.tsx          # כרטיס עם swipe
│   └── PullToRefresh.tsx          # Pull to refresh
│
├── pages/mobile/
│   ├── MobileInspectionPage.tsx   # ביקורת במובייל
│   ├── MobileChecklistPage.tsx    # צ'קליסט
│   └── MobileSignaturePage.tsx    # חתימות
│
└── utils/
    ├── imageCompression.ts        # דחיסת תמונות
    └── offlineStorage.ts          # Local storage
```

---

## ✅ Checklist לפיתוח

### PWA Foundation
- [ ] Service Worker
- [ ] Web App Manifest
- [ ] Icons (all sizes)
- [ ] Offline page

### Offline Support
- [ ] IndexedDB setup
- [ ] Offline sync logic
- [ ] Background sync
- [ ] Conflict resolution

### Mobile Components
- [ ] MobileLayout
- [ ] MobileNavigation
- [ ] OfflineIndicator
- [ ] CameraCapture
- [ ] SignatureCapture
- [ ] PhotoGallery
- [ ] PullToRefresh

### Device Features
- [ ] Camera integration
- [ ] GPS location
- [ ] Push notifications
- [ ] File upload

### Mobile Pages
- [ ] Mobile inspection flow
- [ ] Mobile checklist
- [ ] Mobile signatures

### Testing
- [ ] iOS Safari testing
- [ ] Android Chrome testing
- [ ] Offline testing
- [ ] Install testing

---

## 📅 אבני דרך

| שבוע | משימות |
|------|---------|
| **1** | PWA setup, Service Worker, Manifest |
| **2** | Offline DB, Sync logic |
| **3** | Camera, Photos, Compression |
| **4** | Signature, Mobile layouts |
| **5** | Push notifications, Location |
| **6** | Mobile inspection flow |
| **7** | Client portal mobile |
| **8** | Testing, Performance, Polish |

---

## 🔗 קשר למודולים אחרים

| מודול | קשר |
|-------|------|
| **Phase 4: Inspections** | ביקורות במובייל |
| **Phase 5: Findings** | הגשת תיקונים במובייל |
| **Phase 6: Client Portal** | פורטל לקוח מותאם |
| **Phase 7: Notifications** | Push notifications |

---

*מסמך זה יעודכן במהלך הפיתוח*

**גרסה:** 1.0  
**תאריך:** 31/12/2025  
**נכתב ע"י:** Claude + Michel Mazor
