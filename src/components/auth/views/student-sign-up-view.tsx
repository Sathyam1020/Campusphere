'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useColleges, useSignUp } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const studentSignupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    collegeId: z.string().min(1, 'Please select a college'),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    githubUsername: z.string().optional(),
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    interests: z.string().optional(),
    hobbies: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type StudentSignupFormValues = z.infer<typeof studentSignupSchema>;

const StudentSignUpView = () => {
    const router = useRouter();

    // Fetch colleges using React Query
    const {
        data: collegesResponse,
        isLoading: loadingColleges
    } = useColleges();

    const colleges = collegesResponse?.data?.colleges || [];

    // Sign up mutation
    const signUpMutation = useSignUp();

    const form = useForm<StudentSignupFormValues>({
        resolver: zodResolver(studentSignupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            collegeId: '',
            bio: '',
            githubUsername: '',
            linkedin: '',
            interests: '',
            hobbies: '',
        },
    });

    const onSubmit = async (values: StudentSignupFormValues) => {
        const payload = {
            ...values,
            interests: values.interests ? values.interests.split(',').map(item => item.trim()) : [],
            hobbies: values.hobbies ? values.hobbies.split(',').map(item => item.trim()) : [],
        };

        signUpMutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Account created successfully!');
                router.push('/sign-in');
            },
            onError: (error: any) => {
                toast.error(error.message || 'Something went wrong. Try again.');
            },
        });
    };

    const isPending = signUpMutation.isPending;

    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle>Student Sign Up</CardTitle>
                    <CardDescription>Create your student account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='grid gap-6'>
                                <div className='grid gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='John Doe' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type='email' placeholder='john@example.com' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <FormField
                                            control={form.control}
                                            name='password'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type='password' placeholder='********' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='confirmPassword'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input type='password' placeholder='********' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name='collegeId'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>College</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    disabled={loadingColleges}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={loadingColleges ? "Loading colleges..." : "Select your college"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {colleges.map((college) => (
                                                            <SelectItem key={college.id} value={college.id}>
                                                                {college.name} {college.location && `(${college.location})`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='bio'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bio (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Tell us about yourself...'
                                                        className='resize-none'
                                                        rows={3}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <FormField
                                            control={form.control}
                                            name='githubUsername'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>GitHub Username (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='johndoe' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='linkedin'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>LinkedIn URL (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='https://linkedin.com/in/johndoe' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <FormField
                                            control={form.control}
                                            name='interests'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Interests (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Web Dev, AI, Design (comma separated)' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='hobbies'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Hobbies (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Reading, Gaming, Music (comma separated)' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button type='submit' className='w-full' disabled={isPending || loadingColleges}>
                                        {isPending ? 'Creating Account...' : 'Create Student Account'}
                                    </Button>
                                </div>

                                <div className='text-center text-sm'>
                                    Already have an account?{' '}
                                    <Link href='/sign-in' className='underline underline-offset-4'>
                                        Sign In
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

export default StudentSignUpView;