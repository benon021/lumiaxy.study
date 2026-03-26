import { getUserFromRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentAssignmentsClient from "./StudentAssignmentsClient";

export default async function StudentAssignmentsPage() {
  const user = await getUserFromRequest();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");
  return <StudentAssignmentsClient />;
}
