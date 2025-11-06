'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSignIn } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const studentSigninSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type StudentSigninFormValues = z.infer<typeof studentSigninSchema>;

const StudentSignInView = () => {
    const router = useRouter();

    // Put this anywhere client-side (e.g., in a useEffect)
    useEffect(() => {
        console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);
    }, []);


    // Sign in mutation
    const signInMutation = useSignIn();

    const form = useForm<StudentSigninFormValues>({
        resolver: zodResolver(studentSigninSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: StudentSigninFormValues) => {
        console.log('🚀 Starting login process...');
        signInMutation.mutate(values, {
            onSuccess: (data) => {
                console.log('✅ Login API success:', data);
                console.log('🍪 All cookies after login:', document.cookie);
                
                // TEMPORARY: Store token in localStorage as fallback
                if (data.token) {
                    localStorage.setItem('auth-token', data.token);
                    console.log('💾 Token stored in localStorage as fallback');
                }
                
                // Check specifically for our cookies
                const allCookies = document.cookie.split(';').reduce((acc, cookie) => {
                    const [name, value] = cookie.trim().split('=');
                    acc[name] = value;
                    return acc;
                }, {} as Record<string, string>);
                
                console.log('🍪 Parsed cookies:', allCookies);
                console.log('🍪 Test cookie present:', !!allCookies['test-cookie']);
                console.log('🍪 Auth token present:', !!allCookies['auth-token']);
                console.log('💾 LocalStorage token present:', !!localStorage.getItem('auth-token'));
                
                toast.success('Login successful!');

                // Add a small delay before redirect to see if cookie gets cleared
                setTimeout(() => {
                    console.log('🍪 Checking cookies before redirect:', document.cookie);
                    router.push('/home');
                }, 100);
            },
            onError: (error: any) => {
                console.error('❌ Login error:', error);
                toast.error(error.message || 'Invalid email or password');
            },
        });
    };

    const isPending = signInMutation.isPending;

    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle>Student Sign In</CardTitle>
                    <CardDescription>Welcome back! Sign in to your student account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='grid gap-6'>
                                <div className='grid gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='email'
                                                        placeholder='john@example.com'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder='********'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='flex items-center justify-between'>
                                        <Link
                                            href='/forgot-password'
                                            className='text-sm text-muted-foreground hover:text-primary underline underline-offset-4'
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <Button
                                        type='submit'
                                        className='w-full'
                                        disabled={isPending}
                                    >
                                        {isPending ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </div>

                                <div className='text-center text-sm'>
                                    Don't have an account?{' '}
                                    <Link href='/sign-up' className='underline underline-offset-4'>
                                        Create Student Account
                                    </Link>
                                </div>

                                <div className='text-center text-sm text-muted-foreground'>
                                    Are you a teacher or recruiter?{' '}
                                    <Link href='/auth/other' className='underline underline-offset-4'>
                                        Sign in here
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentSignInView;