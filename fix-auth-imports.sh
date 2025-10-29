#!/bin/bash

# Fix AuthContext import paths from /context/ to /contexts/

files=(
  "src/components/UnityExperienceDemo.jsx"
  "src/components/UnityEducationalExperience.jsx"
  "src/components/ProtectedRoutes.jsx"
  "src/components/AuthGuard.jsx"
  "src/components/DashboardHeader.jsx"
  "src/components/ProgressTracker.jsx"
  "src/components/Login.jsx"
  "src/components/DashboardRouter.jsx"
  "src/components/LiveSessions.jsx"
  "src/components/UserProfile.jsx"
  "src/components/ResetPasswordPage.jsx"
  "src/components/VerifyEmailPage.jsx"
  "src/components/ProgressReport.jsx"
  "src/components/SetupMFAPage.jsx"
  "src/components/LoginPage.jsx"
  "src/components/SocialLoginButtons.jsx"
  "src/context/LearningPreferencesContext.jsx"
  "src/tests/LoginPage.test.jsx"
  "src/pages/UnityLearningDashboard.jsx"
  "src/pages/LearningModule.jsx"
  "src/test/UnityExperienceDemo.test.jsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file"
    sed -i 's|from "../context/AuthContext"|from "../contexts/AuthContext"|g' "$file"
    sed -i 's|from "\.\./context/AuthContext"|from "../contexts/AuthContext"|g' "$file"
  fi
done

echo "✅ All AuthContext imports fixed!"
