'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreateProjectRequest, useCreateProject } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Define the project schema to match API expectations
const projectFormSchema = z.object({
    title: z.string()
        .min(3, 'Project title must be at least 3 characters')
        .max(100, 'Project title must be less than 100 characters'),
    description: z.string()
        .min(10, 'Project description must be at least 10 characters')
        .max(2000, 'Project description must be less than 2000 characters'),
    githubUrl: z.string()
        .url('GitHub URL must be a valid URL')
        .regex(/^https:\/\/github\.com\//, 'Must be a valid GitHub repository URL')
        .optional()
        .or(z.literal('')),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

// Available skills
const availableSkills = [
    'React',
    'Next.js',
    'Tailwind CSS',
    'Node.js',
    'Express.js',
    'MySQL',
    'MongoDB',
    'PostgreSQL',
    'TypeScript',
    'JavaScript',
    'Python',
    'Java',
    'C++',
    'Angular',
    'Vue.js',
    'Django',
    'Flask',
    'Spring Boot',
    'Docker',
    'Kubernetes',
];

interface ProjectFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: any;
}

const ProjectForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: ProjectFormProps) => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // Create project mutation
    const createProjectMutation = useCreateProject({
        onSuccess: (data) => {
            toast.success('Project created successfully!');
            onSuccess?.(data.data?.project?.id);
        },
        onError: (error: any) => {
            console.error('Error creating project:', error);

            // Handle validation errors
            if (error.status === 400 && error.details) {
                error.details.forEach((detail: any) => {
                    if (detail.field) {
                        form.setError(detail.field as keyof ProjectFormData, {
                            type: 'manual',
                            message: detail.message,
                        });
                    }
                });
                toast.error('Please fix the validation errors');
                return;
            }

            const errorMessage = error.message || 'Failed to create project';
            toast.error(errorMessage);
        },
    });

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? "",
            githubUrl: initialValues?.githubUrl ?? "",
            skills: initialValues?.skills ?? [],
        }
    });

    useEffect(() => {
        if (initialValues?.skills) {
            setSelectedSkills(initialValues.skills);
        }
    }, [initialValues]);

    const addSkill = (skill: string) => {
        if (!selectedSkills.includes(skill)) {
            const newSkills = [...selectedSkills, skill];
            setSelectedSkills(newSkills);
            form.setValue('skills', newSkills);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
        setSelectedSkills(newSkills);
        form.setValue('skills', newSkills);
    };

    const onSubmit = async (values: ProjectFormData) => {
        const projectData: CreateProjectRequest = {
            title: values.title,
            description: values.description,
            githubUrl: values.githubUrl || undefined,
            skills: values.skills,
            teamMembers: [],
        };

        createProjectMutation.mutate(projectData);
    };

    const isEdit = !!initialValues?.id;
    const isLoading = createProjectMutation.isPending;

    return (
        <Form {...form}>
            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name='title'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Title</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder='Enter project title'
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name='description'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder='Enter project description'
                                    disabled={isLoading}
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name='githubUrl'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GitHub URL (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder='https://github.com/username/repository'
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name='skills'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                                <div className="space-y-3">
                                    <Select onValueChange={addSkill} disabled={isLoading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select skills for your project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableSkills
                                                .filter(skill => !selectedSkills.includes(skill))
                                                .map((skill) => (
                                                    <SelectItem key={skill} value={skill}>
                                                        {skill}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>

                                    {selectedSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSkills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                                                        disabled={isLoading}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-between gap-x-2'>
                    {onCancel && (
                        <Button
                            variant='ghost'
                            disabled={isLoading}
                            type='button'
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        disabled={isLoading}
                        type='submit'
                    >
                        {isLoading ? (
                            'Creating...'
                        ) : (
                            isEdit ? 'Update Project' : 'Create Project'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProjectForm; 