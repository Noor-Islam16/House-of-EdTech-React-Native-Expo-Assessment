import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@src/constants/colors";
import { useAuthStore, useCourseStore } from "@src/store";
import { router } from "expo-router";
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
  courseId: string;
  token: string;
  progress: number;
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #F8FAFC;
      color: #0F172A;
      padding-bottom: 60px;
    }
    .content { padding: 16px; }
    .section {
      background: white;
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title-dot {
      width: 4px;
      height: 16px;
      background: linear-gradient(180deg, #2563EB, #06B6D4);
      border-radius: 999px;
      flex-shrink: 0;
    }
    .lesson-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 0;
      border-bottom: 1px solid #F1F5F9;
      cursor: pointer;
      user-select: none;
    }
    .lesson-item:last-child { border-bottom: none; padding-bottom: 0; }
    .lesson-item:first-child { padding-top: 0; }
    .lesson-num {
      width: 32px;
      height: 32px;
      background: #EFF6FF;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #2563EB;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .lesson-num.done { background: #DCFCE7; color: #16A34A; }
    .lesson-body { flex: 1; }
    .lesson-title { font-size: 13px; font-weight: 600; color: #0F172A; }
    .lesson-meta { font-size: 11px; color: #64748B; margin-top: 2px; }
    .lesson-tag {
      font-size: 11px;
      font-weight: 700;
      color: #2563EB;
      background: #EFF6FF;
      padding: 3px 10px;
      border-radius: 999px;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .lesson-tag.done { background: #DCFCE7; color: #16A34A; }
    .btn-row { display: flex; gap: 10px; margin-bottom: 12px; }
    .btn {
      flex: 1;
      padding: 13px;
      border-radius: 14px;
      border: none;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.15s;
      user-select: none;
    }
    .btn:active { opacity: 0.8; transform: scale(0.97); }
    .btn-primary {
      background: linear-gradient(135deg, #2563EB, #06B6D4);
      color: white;
      box-shadow: 0 4px 12px rgba(37,99,235,0.25);
    }
    .btn-outline {
      background: white;
      border: 2px solid #2563EB;
      color: #2563EB;
    }
    .desc-text { font-size: 13px; color: #64748B; line-height: 1.7; }
    .toast {
      position: fixed;
      bottom: 24px;
      left: 16px;
      right: 16px;
      background: #0F172A;
      color: white;
      padding: 13px 18px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 13px;
      text-align: center;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      z-index: 999;
      pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
    .loader-wrap {
      display: flex;
      justify-content: center;
      padding: 20px 0;
    }
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #E2E8F0;
      border-top-color: #2563EB;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="content">

    <div class="btn-row">
      <button class="btn btn-primary" onclick="markComplete()">Mark Complete</button>
      <button class="btn btn-outline" onclick="syncProgress()">Sync Progress</button>
    </div>

    <div class="section">
      <div class="section-title">
        <div class="section-title-dot"></div>
        Curriculum
      </div>
      <div class="lesson-item" onclick="completeLesson(1,'Introduction & Setup')">
        <div class="lesson-num" id="num-1">1</div>
        <div class="lesson-body">
          <div class="lesson-title">Introduction & Setup</div>
          <div class="lesson-meta">5 lessons &bull; 45 min</div>
        </div>
        <span class="lesson-tag" id="tag-1">Start</span>
      </div>
      <div class="lesson-item" onclick="completeLesson(2,'Core Concepts')">
        <div class="lesson-num" id="num-2">2</div>
        <div class="lesson-body">
          <div class="lesson-title">Core Concepts</div>
          <div class="lesson-meta">8 lessons &bull; 1h 20min</div>
        </div>
        <span class="lesson-tag" id="tag-2">Start</span>
      </div>
      <div class="lesson-item" onclick="completeLesson(3,'Building Components')">
        <div class="lesson-num" id="num-3">3</div>
        <div class="lesson-body">
          <div class="lesson-title">Building Components</div>
          <div class="lesson-meta">12 lessons &bull; 2h 10min</div>
        </div>
        <span class="lesson-tag" id="tag-3">Start</span>
      </div>
      <div class="lesson-item" onclick="completeLesson(4,'State Management')">
        <div class="lesson-num" id="num-4">4</div>
        <div class="lesson-body">
          <div class="lesson-title">State Management</div>
          <div class="lesson-meta">9 lessons &bull; 1h 45min</div>
        </div>
        <span class="lesson-tag" id="tag-4">Start</span>
      </div>
      <div class="lesson-item" onclick="completeLesson(5,'API Integration')">
        <div class="lesson-num" id="num-5">5</div>
        <div class="lesson-body">
          <div class="lesson-title">API Integration</div>
          <div class="lesson-meta">7 lessons &bull; 1h 30min</div>
        </div>
        <span class="lesson-tag" id="tag-5">Start</span>
      </div>
      <div id="lessonLoader" class="loader-wrap" style="display:none">
        <div class="spinner"></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <div class="section-title-dot"></div>
        About This Course
      </div>
      <p class="desc-text">${payload.description} Learn from industry experts and build portfolio-worthy projects with hands-on practice and real-world scenarios.</p>
    </div>

  </div>

  <div class="toast" id="toast"></div>

  <script>
    var completedLessons = 0;
    var currentProgress = ${payload.progress};
    var isUpdating = false;

    function showToast(msg) {
      var t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(function() { t.classList.remove('show'); }, 2500);
    }

    function showLessonLoader(show) {
      document.getElementById('lessonLoader').style.display = show ? 'flex' : 'none';
    }

    function completeLesson(id, title) {
      var numEl = document.getElementById('num-' + id);
      var tagEl = document.getElementById('tag-' + id);
      if (tagEl && tagEl.textContent !== 'Done') {
        showLessonLoader(true);
        setTimeout(function() {
          showLessonLoader(false);
          numEl.textContent = String(id);
          numEl.classList.add('done');
          tagEl.textContent = 'Done';
          tagEl.classList.add('done');
          completedLessons++;
          showToast('Lesson completed: ' + title);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'LESSON_COMPLETED',
            lessonId: id,
            lessonTitle: title,
            completedCount: completedLessons
          }));
        }, 600);
      }
    }

    function markComplete() {
      if (isUpdating) return;
      isUpdating = true;
      currentProgress = Math.min(currentProgress + 10, 100);
      showToast('Progress updated to ' + currentProgress + '%');
      setTimeout(function() { isUpdating = false; }, 500);
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PROGRESS_UPDATED',
        progress: currentProgress
      }));
    }

    function syncProgress() {
      showToast('Syncing with app...');
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'REQUEST_SYNC',
        currentProgress: currentProgress,
        completedLessons: completedLessons
      }));
    }
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
  const [progress, setProgress] = useState(0);
  const [webViewProgress, setWebViewProgress] = useState(0);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  const { courses, enrollments } = useCourseStore();
  const user = useAuthStore((s) => s.user);

  const enrolledCourses = useMemo(
    () => courses.filter((c) => enrollments.includes(c.id)),
    [courses, enrollments],
  );

  const activeCourse = enrolledCourses[selectedCourseIndex] ?? null;

  const htmlContent = useMemo(() => {
    if (!activeCourse) return "";
    return generateCourseHTML({
      courseTitle: activeCourse.title,
      instructorName: `${activeCourse.instructor.firstName} ${activeCourse.instructor.lastName}`,
      description: activeCourse.description,
      category: activeCourse.category,
      price: activeCourse.price,
      rating: activeCourse.rating ?? 4.5,
      courseId: activeCourse.id,
      token: user?.id ?? "",
      progress,
    });
  }, [activeCourse, progress]);

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "PROGRESS_UPDATED") setProgress(data.progress);
    } catch {}
  };

  if (!activeCourse) {
    return (
      <View className="flex-1 bg-background">
        <View
          className="bg-primary px-5 pb-6 rounded-b-[32px]"
          style={{ paddingTop: insets.top + 12 }}
        >
          <Text className="text-white text-2xl font-bold">Learn</Text>
          <Text className="text-white/70 text-sm mt-1">
            Your course content
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-5">
            <Ionicons name="book-outline" size={44} color={COLORS.primary} />
          </View>
          <Text className="text-text font-bold text-xl text-center">
            No Enrolled Courses
          </Text>
          <Text className="text-textMuted text-sm text-center mt-2 leading-5">
            Enroll in a course from the catalog to start learning here.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-primary px-8 py-3 rounded-2xl mt-6"
            activeOpacity={0.85}
            style={{
              elevation: 6,
              shadowColor: COLORS.primary,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Text className="text-white font-bold">Browse Courses</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header — merged with stats */}
      <View
        className="bg-primary px-5 pb-5 rounded-b-[32px]"
        style={{ paddingTop: insets.top + 12 }}
      >
        {/* Title row */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 mr-3">
            <Text className="text-white/70 text-xs font-medium mb-0.5">
              Now Learning
            </Text>
            <Text
              className="text-white font-bold text-base leading-5"
              numberOfLines={2}
            >
              {activeCourse.title}
            </Text>
            <Text className="text-white/60 text-xs mt-1">
              {activeCourse.instructor.firstName}{" "}
              {activeCourse.instructor.lastName}
            </Text>
          </View>
          <View className="bg-white/20 px-3 py-1.5 rounded-full">
            <Text className="text-white text-xs font-bold">
              {progress}% done
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
          <View
            className="h-1.5 bg-white rounded-full"
            style={{
              width: `${progress}%`,
            }}
          />
        </View>

        {/* Stats row */}
        <View className="flex-row gap-3 mb-1">
          <View className="flex-1 bg-white/15 rounded-2xl px-3 py-2.5 flex-row items-center gap-2">
            <Ionicons name="star" size={14} color="#FCD34D" />
            <Text className="text-white font-bold text-sm">
              {activeCourse.rating}
            </Text>
            <Text className="text-white/60 text-xs">Rating</Text>
          </View>
          <View className="flex-1 bg-white/15 rounded-2xl px-3 py-2.5 flex-row items-center gap-2">
            <Ionicons name="pricetag-outline" size={14} color="white" />
            <Text className="text-white font-bold text-sm">
              ${activeCourse.price}
            </Text>
            <Text className="text-white/60 text-xs">Price</Text>
          </View>
          <View className="flex-1 bg-white/15 rounded-2xl px-3 py-2.5 flex-row items-center gap-2">
            <Ionicons
              name="checkmark-circle-outline"
              size={14}
              color="#86EFAC"
            />
            <Text className="text-white font-bold text-sm">0</Text>
            <Text className="text-white/60 text-xs">Done</Text>
          </View>
        </View>

        {/* WebView load bar */}
        {webViewProgress > 0 && webViewProgress < 1 && (
          <View className="h-0.5 bg-white/20 rounded-full overflow-hidden mt-3">
            <View
              className="h-0.5 bg-white rounded-full"
              style={{ width: `${webViewProgress * 100}%` }}
            />
          </View>
        )}

        {/* Course switcher */}
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
                activeOpacity={0.7}
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
            <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="wifi-outline" size={36} color={COLORS.error} />
            </View>
            <Text className="text-text font-bold text-lg text-center">
              Failed to Load
            </Text>
            <Text className="text-textMuted text-sm text-center mt-2 leading-5">
              Check your connection and try again.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setLoadError(false);
                setIsLoading(true);
                webViewRef.current?.reload();
              }}
              className="bg-primary px-8 py-3 rounded-2xl mt-5"
              activeOpacity={0.85}
              style={{
                elevation: 6,
                shadowColor: COLORS.primary,
                shadowOpacity: 0.3,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <WebView
              ref={webViewRef}
              source={{
                html: htmlContent,
                headers: {
                  "X-Course-Id": activeCourse.id,
                  "X-User-Token": user?.id ?? "",
                },
              }}
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
              androidLayerType="hardware"
              style={{ flex: 1, backgroundColor: "transparent" }}
            />
            {isLoading && (
              <View className="absolute inset-0 bg-background items-center justify-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-textMuted text-sm mt-3">
                  Loading course content...
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
