
import ResponsiveDialog from '@/components/ResponsiveDialog';
import ProjectForm from './ProjectForm';

interface NewProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProjectCreated?: () => void;
}

const NewProjectDialog = ({
    open,
    onOpenChange,
    onProjectCreated,
}: NewProjectDialogProps) => {
    return (
        <ResponsiveDialog
            title='New Project'
            description='Create a new project'
            open={open}
            onOpenChange={onOpenChange}
        >
            <ProjectForm
                onSuccess={() => {
                    onOpenChange(false);
                    if (onProjectCreated) {
                        onProjectCreated();
                    }
                }}
                onCancel={() => {
                    onOpenChange(false);
                }}
            />
        </ResponsiveDialog>
    )
}

export default NewProjectDialog; 