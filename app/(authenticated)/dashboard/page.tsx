
import DashboardView from '@/components/dashboard/DashboardView';
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { HowToUseSection } from '@/components/HowToUseSection';

export default async function DashboardPage() {
    const session = await auth()
    if (!session) {
        redirect("/")
    }
    return (
        <div className="space-y-12">
            <DashboardView />
        </div>
    );
}


