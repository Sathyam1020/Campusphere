import StudentSignInView from "@/components/auth/views/student-sign-in-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect('/');
  }
  return (
    <StudentSignInView />
  )
}

export default page;  