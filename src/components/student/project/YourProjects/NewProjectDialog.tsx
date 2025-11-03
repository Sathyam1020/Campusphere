
import ResponsiveDialog from '@/components/ResponsiveDialog';
import ProjectForm from './ProjectForm';

interface NewProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const NewProjectDialog = ({
    open,
    onOpenChange,
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
                }}
                onCancel={() => {
                    onOpenChange(false);
                }}
            />
        </ResponsiveDialog>
    )
}

export default NewProjectDialog; 