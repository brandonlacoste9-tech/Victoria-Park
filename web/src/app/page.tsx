import { redirect } from "next/navigation";

export default function RootPage() {
  // Directly redirect internal staff to the dashboard/login
  redirect("/dashboard");
}
