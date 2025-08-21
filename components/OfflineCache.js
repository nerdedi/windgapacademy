// Offline support and local caching
export function cacheLessonPlan(domain, userId, plan) {
  try {
    localStorage.setItem(`lessonplan_${domain}_${userId}`, plan);
  } catch (err) {
    console.error("Error caching lesson plan:", err);
  }
}
export function getCachedLessonPlan(domain, userId) {
  return localStorage.getItem(`lessonplan_${domain}_${userId}`);
}
