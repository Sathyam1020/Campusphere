import StudentSignUpView from '@/components/auth/views/student-sign-up-view';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect('/');
  }
  return (
    <div>
      <StudentSignUpView />
    </div>
  )
}

export default page;