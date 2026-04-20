import React from 'react';

const VendorFooter: React.FC = () => {
    // Automatically gets the current year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background py-6 px-4 md:px-6 border-t border-border transition-colors duration-300">
            {/* Changed md:flex-row to lg:flex-row to give it more breathing room before stacking */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-sm text-muted-foreground text-center lg:text-left">

                {/* Left Side: Copyright Info */}
                <div className="leading-relaxed">
                    <span>&copy; {currentYear} </span>
                    {/* Added block sm:inline so the brand name drops to a new line on very small phones, but stays inline on tablets+ */}
                    <span className="font-semibold text-primary-light text-base block sm:inline sm:ml-1">
                        Golden Life Vendor Dashboard
                    </span>
                    <span className="hidden sm:inline">. All rights reserved.</span>
                    <span className="block sm:hidden">All rights reserved.</span>
                </div>

                {/* Right Side: Developer Credit & Utility Links */}
                {/* Changed to flex-col sm:flex-row so credits and links stack nicely on small mobile screens */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2 lg:mt-0">
                    <p>
                        Developed by{' '}
                        <a
                            href="#"
                            className="font-semibold text-primary text-base hover:underline transition-all"
                        >
                            Creative Software
                        </a>
                    </p>

                    {/* Utility Links: Made them visible on mobile, but removed the left border on tiny screens so they don't look weird when stacked */}
                    <div className="flex items-center gap-4 sm:border-l border-border sm:pl-4 mt-1 sm:mt-0">
                        <a href="#" className="hover:text-foreground transition-colors">Support</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default VendorFooter;