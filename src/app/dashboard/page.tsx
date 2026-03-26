import { getUserFromRequest } from "@/lib/auth";
import StudentHome from "@/components/dashboard/StudentHome";
import TeacherHome from "@/components/dashboard/TeacherHome";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUserFromRequest();
  
  if (!user) {
    redirect("/login");
  }

  if (user.role === "TEACHER") {
    return <TeacherHome user={user} />;
  }

  return <StudentHome user={user} />;
}
