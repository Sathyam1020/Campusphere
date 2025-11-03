'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Define the project schema
const projectFormSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Project description is required'),
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
    'PostgreSQL'
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
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            description: initialValues?.description ?? "",
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
        setIsLoading(true);

        try {
            // Create project object with required fields
            const projectData = {
                id: initialValues?.id ?? Date.now().toString(),
                name: values.name,
                description: values.description,
                bio: values.description.length > 50 ? values.description.substring(0, 50) + '...' : values.description,
                skills: values.skills,
                status: 'active',
                duration: 1800, // hardcoded 30 minutes
                startedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            };

            // Get existing projects from localStorage
            const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');

            if (initialValues?.id) {
                // Update existing project
                const updatedProjects = existingProjects.map((project: any) =>
                    project.id === initialValues.id ? projectData : project
                );
                localStorage.setItem('projects', JSON.stringify(updatedProjects));
                toast.success('Project updated successfully!');
            } else {
                // Add new project
                existingProjects.push(projectData);
                localStorage.setItem('projects', JSON.stringify(existingProjects));
                toast.success('Project created successfully!');
            }

            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('projectsUpdated'));

            onSuccess?.(projectData.id);
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isEdit = !!initialValues?.id;

    return (
        <Form {...form}>
            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name='name'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder='Enter project name'
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
                            'Processing...'
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