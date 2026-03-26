import { getUserFromRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherAssignmentsClient from "./TeacherAssignmentsClient";

export default async function TeacherAssignmentsPage() {
  const user = await getUserFromRequest();
  if (!user || user.role !== "TEACHER") redirect("/dashboard");
  return <TeacherAssignmentsClient />;
}
