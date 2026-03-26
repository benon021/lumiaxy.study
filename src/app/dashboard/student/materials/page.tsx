import { getUserFromRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentMaterialsClient from "./StudentMaterialsClient";

export default async function StudentMaterialsPage() {
  const user = await getUserFromRequest();
  
  if (!user || user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  return <StudentMaterialsClient />;
}
