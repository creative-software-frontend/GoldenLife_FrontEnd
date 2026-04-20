import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import InstructorSidebar from './InstructorSidebar';
import InstructorNavbar from './InstructorNavbar';
import InstructorFooter from './InstructorFooter';
import LiveChat from '@/pages/Home/LiveChat/Livechat';

const InstructorLayout: React.FC = () => {
    // 1. Master State: Controls the Sidebar for the whole app
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 2. The Toggle Function 
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex h-screen bg-muted/40 text-foreground overflow-hidden">
            {/* Sidebar receives state and toggle function */}
            <InstructorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <LiveChat showLegacy={false} />
                {/* Navbar receives state and toggle function so the custom icon works */}
                <InstructorNavbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
                    {/* Your page content renders here */}
                    <Outlet />
                </main>

                <InstructorFooter />
            </div>
        </div>
    );
};

export default InstructorLayout;
