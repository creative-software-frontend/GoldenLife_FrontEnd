import React from 'react';

const InstructorFooter: React.FC = () => {
    return (
        <footer className="w-full bg-background border-t border-border py-4 px-6 text-sm text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-2 mt-auto">
            <p>
                © {new Date().getFullYear()} <span className="font-bold text-indigo-500">Golden Life Instructor Dashboard</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
                <span>Developed by <span className="font-bold text-primary hover:underline cursor-pointer">Creative Software</span></span>
                <div className="flex gap-3 text-xs">
                    <a href="#" className="hover:text-foreground transition-colors">Support</a>
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default InstructorFooter;
