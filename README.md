# EduFlex - Mini LMS Mobile App

A production-ready Learning Management System built with React Native Expo, featuring course catalog, WebView integration, local notifications, and offline support.

---

## Tech Stack

| Category      | Technology                   |
| ------------- | ---------------------------- |
| Framework     | React Native Expo SDK 54     |
| Language      | TypeScript (strict mode)     |
| Navigation    | Expo Router v6               |
| Styling       | NativeWind v4 (Tailwind)     |
| State         | Zustand v4                   |
| Server State  | TanStack React Query v5      |
| HTTP          | Axios (interceptors + retry) |
| Auth Storage  | Expo SecureStore             |
| App Storage   | AsyncStorage                 |
| Forms         | React Hook Form + Zod        |
| Notifications | Expo Notifications (local)   |
| Network       | Expo Network                 |
| WebView       | React Native WebView         |
| Image Picker  | Expo Image Picker            |

---

## Features

- Secure authentication (login/register) with auto-login
- Course catalog with search + category filters
- Featured courses carousel
- Course detail with expandable curriculum
- Enroll + bookmark with persistence
- WebView course content viewer with bidirectional communication
- Local notifications (5 bookmarks + 24h reminder)
- Offline detection banner
- Profile with avatar picker
- Pull to refresh
- Error boundary + retry logic
- Animated splash screen

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Expo CLI
- Android Studio or physical Android device
- Expo Go app (for development)

### Installation

```bash
# clone repo
git clone https://github.com/Noor-Islam16/House-of-EdTech-React-Native-Expo-Assessment.git
cd House-of-EdTech-React-Native-Expo-Assessment

# install dependencies
npm install

# start dev server
npx expo start
```

### Environment Variables

No `.env` file required. API base URL is configured in:

```
src/services/api/client.ts → BASE_URL = "https://api.freeapi.app"
```

---

## Project Structure

```
EduFlex/
├── app/
│   ├── _layout.tsx                  # Root layout, providers, error boundary
│   ├── index.tsx                    # Animated splash + auth gate
│   ├── (auth)/
│   │   ├── _layout.tsx              # Auth stack layout
│   │   ├── login.tsx                # Login screen
│   │   └── register.tsx             # Register screen
│   ├── (tabs)/
│   │   ├── _layout.tsx              # Bottom tab navigator
│   │   ├── index.tsx                # Home - course catalog
│   │   ├── bookmarks.tsx            # Saved courses
│   │   ├── webview.tsx              # WebView course content
│   │   └── profile.tsx              # User profile + settings
│   └── course/
│       └── [id].tsx                 # Course detail screen
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── AppText.tsx          # Global text component (Nunito font)
│   │   │   ├── CourseCard.tsx       # Featured course card (horizontal)
│   │   │   ├── CourseListCard.tsx   # Course list card (vertical)
│   │   │   └── index.ts
│   │   └── common/
│   │       ├── OfflineBanner.tsx    # Animated offline detection banner
│   │       ├── ErrorBoundary.tsx    # React error boundary
│   │       ├── LoadingSpinner.tsx   # Reusable loading state
│   │       └── index.ts
│   │
│   ├── constants/
│   │   └── colors.ts                # App color palette
│   │
│   ├── hooks/
│   │   ├── useNotifications.ts      # Local notification logic
│   │   └── useNetwork.ts            # Network state polling
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts            # Axios instance + interceptors + retry
│   │   │   ├── authApi.ts           # Auth endpoints
│   │   │   ├── courseApi.ts         # Course + instructor endpoints
│   │   │   └── index.ts
│   │   └── storage/
│   │       ├── secureStorage.ts     # Expo SecureStore wrapper
│   │       ├── asyncStorage.ts      # AsyncStorage wrapper
│   │       └── index.ts
│   │
│   ├── store/
│   │   ├── authStore.ts             # Auth state + SecureStore persistence
│   │   ├── courseStore.ts           # Courses, bookmarks, enrollments
│   │   ├── preferenceStore.ts       # Theme, notifications
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── index.ts                 # Shared TypeScript interfaces
│   │   └── legend.d.ts              # LegendList type declarations
│   │
│   └── utils/
│       └── index.ts                 # formatPrice, truncate, getInitials, etc.
│
├── assets/
│   ├── fonts/                       # Nunito font family
│   └── images/                      # App icons, splash
│
├── global.css                       # NativeWind entry point
├── tailwind.config.js               # Tailwind + custom colors
├── babel.config.js                  # Babel + NativeWind + Reanimated
├── metro.config.js                  # Metro + NativeWind
├── nativewind-env.d.ts              # NativeWind type declarations
├── expo-env.d.ts                    # Expo + CSS type declarations
├── app.json                         # Expo config
└── tsconfig.json                    # TypeScript strict config
```

---

## Key Architectural Decisions

### 1. Zustand over Redux

Lightweight, no boilerplate, built-in persistence pattern with `hydrate()` on each store.

### 2. TanStack Query for server state

Handles caching, stale time, retry, and background refetch — separates server state from UI state cleanly.

### 3. Expo SecureStore for tokens

Auth tokens stored encrypted. AsyncStorage used only for non-sensitive data (bookmarks, preferences).

### 4. WebView bidirectional communication

- Native → WebView: `injectJavaScript()` for live updates + HTTP headers for initial data
- WebView → Native: `postMessage` for lesson completion and progress sync

### 5. File-based routing

Expo Router provides type-safe navigation with automatic deep linking via `typedRoutes: true`.

### 6. Axios interceptors

- Request: auto-attaches Bearer token from SecureStore
- Response: retry up to 3 times on network failure with exponential backoff
- Timeout: 10 seconds globally

---

## APK Build

### Development Build

```bash
# install eas cli
npm install -g eas-cli

# login
eas login

# configure
eas build:configure

# build APK
eas build -p android --profile preview
```

### Build Profile (`eas.json`)

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## Known Issues / Limitations

- Remote push notifications not supported in Expo Go (local only) — works in APK build
- Course data is randomized from freeapi.app — refreshing fetches new random data
- Curriculum content is static (API does not provide lesson data)
- Avatar update is local only (API endpoint requires multipart upload)
- freeapi.app resets user data periodically — re-register if login fails

---

## API Reference

Base URL: `https://api.freeapi.app`

| Endpoint                        | Method | Usage           |
| ------------------------------- | ------ | --------------- |
| `/api/v1/users/register`        | POST   | Register user   |
| `/api/v1/users/login`           | POST   | Login user      |
| `/api/v1/users/current-user`    | GET    | Get profile     |
| `/api/v1/public/randomproducts` | GET    | Course data     |
| `/api/v1/public/randomusers`    | GET    | Instructor data |

---

## Demo Video

_Link to demo video — 3-5 minutes walkthrough_
https://drive.google.com/file/d/147uVdk8E2m5_9vDG8UnPOFCJ-jxwedMX/view?usp=drive_link

---

Built with React Native Expo — EduFlex v1.0.0
