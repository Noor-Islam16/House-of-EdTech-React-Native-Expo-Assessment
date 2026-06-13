import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import { useAuthStore, useCourseStore, usePreferenceStore } from "@src/store";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { WebViewMessageEvent } from "react-native-webview";
import { WebView } from "react-native-webview";

const generateCourseHTML = (payload: {
  courseTitle: string;
  instructorName: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  theme: string;
  courseId: string;
  token: string;
  progress: number;
}) => {
  const isDark = payload.theme === "dark";
  const bg = isDark ? "#0F172A" : "#F8FAFC";
  const card = isDark ? "#1E293B" : "#FFFFFF";
  const textColor = isDark ? "#F8FAFC" : "#0F172A";
  const muted = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#334155" : "#E2E8F0";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: ${bg};
      color: ${textColor};
      padding: 20px;
      min-height: 100vh;
    }
    .badge {
      display: inline-block;
      background: rgba(37,99,235,0.15);
      color: #2563EB;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      line-height: 1.3;
      margin-bottom: 8px;
      color: ${textColor};
    }
    .instructor {
      font-size: 13px;
      color: ${muted};
      margin-bottom: 16px;
    }
    .progress-wrap {
      background: ${border};
      border-radius: 999px;
      height: 8px;
      margin-bottom: 6px;
      overflow: hidden;
    }
    .progress-bar {
      height: 8px;
      background: linear-gradient(90deg, #2563EB, #06B6D4);
      border-radius: 999px;
      width: ${payload.progress}%;
      transition: width 0.5s ease;
    }
    .progress-label {
      font-size: 12px;
      color: ${muted};
      margin-bottom: 20px;
    }
    .card {
      background: ${card};
      border: 1px solid ${border};
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 14px;
    }
    .card h3 {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 10px;
      color: ${textColor};
    }
    .lesson-row {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid ${border};
      gap: 12px;
      cursor: pointer;
    }
    .lesson-row:last-child { border-bottom: none; }
    .lesson-icon {
      width: 32px;
      height: 32px;
      background: rgba(37,99,235,0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 14px;
    }
    .lesson-info { flex: 1; }
    .lesson-title {
      font-size: 13px;
      font-weight: 600;
      color: ${textColor};
    }
    .lesson-dur {
      font-size: 11px;
      color: ${muted};
      margin-top: 2px;
    }
    .lesson-done {
      width: 20px;
      height: 20px;
      background: #22C55E;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: white;
    }
    .btn {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: none;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .btn-primary {
      background: linear-gradient(135deg, #2563EB, #06B6D4);
      color: white;
    }
    .btn-outline {
      background: transparent;
      border: 2px solid #2563EB;
      color: #2563EB;
    }
    .stats {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
    }
    .stat-box {
      flex: 1;
      background: ${card};
      border: 1px solid ${border};
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }
    .stat-val {
      font-size: 18px;
      font-weight: 800;
      color: #2563EB;
    }
    .stat-lbl {
      font-size: 11px;
      color: ${muted};
      margin-top: 2px;
    }
    .toast {
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: #22C55E;
      color: white;
      padding: 12px 16px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 999;
    }
    .toast.show { opacity: 1; }
  </style>
</head>
<body>
  <div class="badge">${payload.category}</div>
  <h1>${payload.courseTitle}</h1>
  <p class="instructor">👨‍🏫 ${payload.instructorName}</p>

  <div class="progress-wrap">
    <div class="progress-bar" id="progressBar"></div>
  </div>
  <p class="progress-label" id="progressLabel">${payload.progress}% Complete</p>

  <div class="stats">
    <div class="stat-box">
      <div class="stat-val">⭐ ${payload.rating}</div>
      <div class="stat-lbl">Rating</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">$${payload.price}</div>
      <div class="stat-lbl">Price</div>
    </div>
    <div class="stat-box">
      <div class="stat-val" id="lessonCount">0</div>
      <div class="stat-lbl">Done</div>
    </div>
  </div>

  <div class="card">
    <h3>📚 Course Curriculum</h3>
    <div class="lesson-row" onclick="completeLesson(1, 'Introduction & Setup')">
      <div class="lesson-icon">▶️</div>
      <div class="lesson-info">
        <div class="lesson-title">Introduction & Setup</div>
        <div class="lesson-dur">5 lessons • 45 min</div>
      </div>
      <div id="done-1" style="color:${muted};font-size:12px">Start</div>
    </div>
    <div class="lesson-row" onclick="completeLesson(2, 'Core Concepts')">
      <div class="lesson-icon">📖</div>
      <div class="lesson-info">
        <div class="lesson-title">Core Concepts</div>
        <div class="lesson-dur">8 lessons • 1h 20min</div>
      </div>
      <div id="done-2" style="color:${muted};font-size:12px">Start</div>
    </div>
    <div class="lesson-row" onclick="completeLesson(3, 'Building Components')">
      <div class="lesson-icon">🔧</div>
      <div class="lesson-info">
        <div class="lesson-title">Building Components</div>
        <div class="lesson-dur">12 lessons • 2h 10min</div>
      </div>
      <div id="done-3" style="color:${muted};font-size:12px">Start</div>
    </div>
    <div class="lesson-row" onclick="completeLesson(4, 'State Management')">
      <div class="lesson-icon">⚡</div>
      <div class="lesson-info">
        <div class="lesson-title">State Management</div>
        <div class="lesson-dur">9 lessons • 1h 45min</div>
      </div>
      <div id="done-4" style="color:${muted};font-size:12px">Start</div>
    </div>
    <div class="lesson-row" onclick="completeLesson(5, 'API Integration')">
      <div class="lesson-icon">🌐</div>
      <div class="lesson-info">
        <div class="lesson-title">API Integration</div>
        <div class="lesson-dur">7 lessons • 1h 30min</div>
      </div>
      <div id="done-5" style="color:${muted};font-size:12px">Start</div>
    </div>
  </div>

  <div class="card">
    <h3>📝 About This Course</h3>
    <p style="font-size:13px;color:${muted};line-height:1.6">${payload.description}</p>
  </div>

  <button class="btn btn-primary" onclick="markComplete()">
    ✅ Mark Lesson Complete
  </button>
  <button class="btn btn-outline" onclick="updateProgress()">
    📊 Update Progress
  </button>

  <div class="toast" id="toast"></div>

  <script>
    var completedLessons = 0;
    var currentProgress = ${payload.progress};

    function showToast(msg) {
      var t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(function() { t.classList.remove('show'); }, 2500);
    }

    function completeLesson(id, title) {
      var el = document.getElementById('done-' + id);
      if (el && el.textContent !== '✅') {
        el.textContent = '✅';
        completedLessons++;
        document.getElementById('lessonCount').textContent = completedLessons;
        showToast('Lesson completed: ' + title);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'LESSON_COMPLETED',
          lessonId: id,
          lessonTitle: title,
          completedCount: completedLessons
        }));
      }
    }

    function markComplete() {
      currentProgress = Math.min(currentProgress + 10, 100);
      document.getElementById('progressBar').style.width = currentProgress + '%';
      document.getElementById('progressLabel').textContent = currentProgress + '% Complete';
      showToast('Progress updated to ' + currentProgress + '%');
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PROGRESS_UPDATED',
        progress: currentProgress
      }));
    }

    function updateProgress() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'REQUEST_SYNC',
        currentProgress: currentProgress,
        completedLessons: completedLessons
      }));
      showToast('Syncing with app...');
    }

    // Listen for messages from Native
    document.addEventListener('message', function(e) {
      var data = JSON.parse(e.data);
      if (data.type === 'THEME_CHANGE') {
        document.body.style.background = data.theme === 'dark' ? '#0F172A' : '#F8FAFC';
      }
    });
  </script>
</body>
</html>
  `;
};

export default function WebViewScreen() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [progress, setProgress] = useState(30);
  const [webViewProgress, setWebViewProgress] = useState(0);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  const { courses, enrollments } = useCourseStore();
  const user = useAuthStore((s) => s.user);
  const theme = usePreferenceStore((s) => s.theme);

  const enrolledCourses = useMemo(
    () => courses.filter((c) => enrollments.includes(c.id)),
    [courses, enrollments],
  );

  const activeCourse = enrolledCourses[selectedCourseIndex] ?? courses[0];

  const htmlContent = useMemo(() => {
    if (!activeCourse) return "";
    return generateCourseHTML({
      courseTitle: activeCourse.title,
      instructorName: `${activeCourse.instructor.firstName} ${activeCourse.instructor.lastName}`,
      description: activeCourse.description,
      category: activeCourse.category,
      price: activeCourse.price,
      rating: activeCourse.rating ?? 4.5,
      theme,
      courseId: activeCourse.id,
      token: user?.id ?? "",
      progress,
    });
  }, [activeCourse, theme, progress]);

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "PROGRESS_UPDATED") {
        setProgress(data.progress);
      }
      if (data.type === "LESSON_COMPLETED") {
        // could trigger notification here
      }
    } catch {}
  };

  const injectTheme = () => {
    webViewRef.current?.injectJavaScript(`
      document.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify({ type: 'THEME_CHANGE', theme: '${theme}' })
      }));
      true;
    `);
  };

  if (!activeCourse) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <View
          style={{ paddingTop: insets.top }}
          className="absolute top-0 left-0 right-0"
        />
        <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-5">
          <Ionicons name="globe-outline" size={44} color={COLORS.primary} />
        </View>
        <Text className="text-text font-bold text-xl text-center">
          No Course Selected
        </Text>
        <Text className="text-textMuted text-sm text-center mt-2 leading-5">
          Enroll in a course to start learning here.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary px-5 pb-4 rounded-b-[28px]"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-white/70 text-xs">Now Learning</Text>
            <Text className="text-white font-bold text-base" numberOfLines={1}>
              {activeCourse.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={injectTheme}
            className="w-9 h-9 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons
              name={theme === "dark" ? "sunny-outline" : "moon-outline"}
              size={18}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* WebView load progress bar */}
        {webViewProgress < 1 && !loadError && (
          <View className="h-1 bg-white/20 rounded-full overflow-hidden">
            <View
              className="h-1 bg-white rounded-full"
              style={{ width: `${webViewProgress * 100}%` }}
            />
          </View>
        )}

        {/* Enrolled courses selector */}
        {enrolledCourses.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerStyle={{ gap: 8 }}
          >
            {enrolledCourses.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCourseIndex(i)}
                className={`px-3 py-1.5 rounded-full border ${
                  i === selectedCourseIndex
                    ? "bg-white border-white"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    i === selectedCourseIndex ? "text-primary" : "text-white"
                  }`}
                  numberOfLines={1}
                >
                  {c.title.split(" ").slice(0, 2).join(" ")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* WebView */}
      <View className="flex-1">
        {loadError ? (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="wifi-outline" size={48} color={COLORS.error} />
            <Text className="text-text font-bold text-lg mt-3 text-center">
              Failed to Load
            </Text>
            <Text className="text-textMuted text-sm text-center mt-2">
              Check your connection and try again.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setLoadError(false);
                setIsLoading(true);
                webViewRef.current?.reload();
              }}
              className="bg-primary px-8 py-3 rounded-2xl mt-5"
            >
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setLoadError(true);
              setIsLoading(false);
            }}
            onLoadProgress={({ nativeEvent }) =>
              setWebViewProgress(nativeEvent.progress)
            }
            onMessage={onMessage}
            javaScriptEnabled
            domStorageEnabled
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: "transparent" }}
          />
        )}

        {isLoading && !loadError && (
          <View className="absolute inset-0 bg-background items-center justify-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text className="text-textMuted text-sm mt-3">
              Loading course content...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
