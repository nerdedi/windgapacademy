// ...existing code...
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Clock, Users, Star, PlayCircle, CheckCircle } from "lucide-react";

import SubjectTabs from "./SubjectTabs";

export function CourseLibrary() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">LLND Learning Hub</h2>
      <SubjectTabs />
    </div>
  );
}
