'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { SettingsSidebar } from '@/components/manage/SettingsSidebar';
import { ProfileSection, PreferencesSection, NotificationsSection, PrivacyDataSection } from '@/components/manage/SettingsUI';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [activeSection, setActiveSection] = useState('profile');

    return (
        <div className="w-full h-full relative font-sans text-black">
            <div className="relative z-10 px-4 md:px-8 py-4 md:py-8 max-w-7xl mx-auto border-t-2 border-black/10 mt-2">
                
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-16">
                    {/* LEFT SIDEBAR */}
                    <SettingsSidebar activeSection={activeSection} onSelectSection={setActiveSection} />

                    {/* RIGHT CONTENT AREA */}
                    <div className="flex-1 min-w-0 pb-32">
                        
                        {activeSection === 'profile' && <ProfileSection session={session} />}
                        {activeSection === 'preferences' && <PreferencesSection />}
                        {activeSection === 'notifications' && <NotificationsSection />}
                        {activeSection === 'privacy' && <PrivacyDataSection />}
                        {activeSection === 'data' && <PrivacyDataSection />}

                        {/* Stubs for sections not yet fully built out in SettingsUI */}
                        {['categories', 'subtopics', 'tasks', 'habits', 'log', 'dailyPlan'].includes(activeSection) && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-black mb-4 tracking-tight">Manage in Tracker</h2>
                                <p className="text-slate-500 font-medium">Please use the primary Manage tab to edit your {activeSection}.</p>
                            </div>
                        )}

                        {['appearance', 'integrations', 'billing', 'help', 'activity'].includes(activeSection) && (
                            <div className="mt-8 bg-white border-2 border-black rounded-xl p-8 shadow-[4px_4px_0_0_#000] text-center">
                                <span className="text-4xl mb-4 block">🚧</span>
                                <h2 className="text-2xl font-black mb-2 tracking-tight">Coming Soon</h2>
                                <p className="text-slate-500 font-medium">This section is currently under construction.</p>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
