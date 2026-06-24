import { usePage } from '@inertiajs/react';
import { ChevronsUpDown, Coins } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';

const geekPoints = '1,240';
const profileStats = {
    level: 3,
    progress: 72,
};
const fallbackUser = {
    name: 'Local Coach',
    email: 'local-coach@example.test',
    avatar: '',
};

export function NavbarUser() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const user = auth.user ?? fallbackUser;

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-12 gap-2 rounded-full px-2.5"
                        aria-label="Open user menu"
                    >
                        <Avatar className="size-8 overflow-hidden rounded-full">
                            <AvatarImage
                                src={user.avatar}
                                alt={user.name}
                            />
                            <AvatarFallback className="rounded-full bg-neutral-200 text-xs text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(user.name ?? '')}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden min-w-36 max-w-44 flex-col items-start gap-1 md:flex">
                            <span className="max-w-full truncate text-sm font-medium leading-none">
                                {user.name}
                            </span>
                        </span>
                        <ChevronsUpDown className="size-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    <UserMenuContent user={user} />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export function NavbarUserStats() {
    return (
        <div className="hidden min-w-52 max-w-64 flex-col gap-1 rounded-full border border-alpha/45 bg-[#fff7d1] px-4 py-2 shadow-[0_8px_24px_rgba(255,200,1,0.16)] md:flex dark:border-alpha/25 dark:bg-alpha/10 dark:shadow-[0_0_22px_rgba(255,200,1,0.08)]">
            <div className="flex items-center justify-between gap-3 text-xs leading-none">
                <span className="font-semibold text-[#5a4600] dark:text-foreground">
                    <TransText en="Level" fr="Level" ar="Level" /> {profileStats.level}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#8a6a00] dark:text-alpha">
                    <Coins className="size-3.5" />
                    {geekPoints}{' '}
                    <TransText
                        en="Geek Points"
                        fr="Geek Points"
                        ar="Geek Points"
                    />
                </span>
            </div>
            <span className="h-1.5 w-full overflow-hidden rounded-full bg-[#ead893] dark:bg-muted">
                <span
                    className="block h-full rounded-full bg-[#d8a200] dark:bg-alpha"
                    style={{ width: `${profileStats.progress}%` }}
                />
            </span>
        </div>
    );
}
