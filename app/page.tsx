import Header from "@/components/global/Header";
import { getUserByEmail } from "@/db/user";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user!!;

  return (
    <>
      <Header user={user} />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] py-2"></div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}
