import { BookOpenIcon } from '@/components/ui/BookOpenIcon';
import { ClipboardIcon } from '@/components/ui/ClipboardIcon';
import { FolderOpenIcon } from '@/components/ui/FolderOpenIcon';
import { HouseIcon } from '@/components/ui/HouseIcon';
import { ZapIcon } from '@/components/ui/ZapIcon';

export const NavItems = [
  { name: "Home", href: "/home", icon: HouseIcon },
  { name: "Hackathon", href: "/home/hackathon", icon: ZapIcon },
  { name: "Resources", href: "/home/resources", icon: BookOpenIcon },
  { name: "Resume", href: "/home/resume", icon: ClipboardIcon },
  { name: "Projects", href: "/home/projects", icon: FolderOpenIcon },
];