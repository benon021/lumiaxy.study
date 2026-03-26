import { getUserFromRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherContentClient from "./TeacherContentClient";

export default async function TeacherContentPage() {
  const user = await getUserFromRequest();
  
  if (!user || user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  return <TeacherContentClient user={user} />;
}
