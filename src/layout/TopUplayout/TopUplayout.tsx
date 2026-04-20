import * as React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../../../public/image/logo/logo.jpg";
import {
    ChevronRight,
    SquareTerminal,
    Pill,
    ChefHat,
    HelpCircleIcon,
    LogInIcon,
    ShoppingBag,
    ShoppingCart,
    GraduationCap,
    Package,
    Truck,
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar";
import Footer from "@/pages/common/Footer/Footer";
import Header from "@/pages/common/Header/Header";
import useModalStore from "@/store/modalStore";

import Cart from "@/pages/Home/Cart/Cart";
import LiveChat from "@/pages/Home/LiveChat/Livechat";
import { useTranslation } from "react-i18next";


export default function TopupLayout() {
    const { changeCheckoutModal, openLoginModal } = useModalStore();
    const [activeCategory, setActiveCategory] = React.useState("topup");
    const [t] = useTranslation("global");
    const navigate = useNavigate();

    // 2. Define the handleLogout function
    const handleLogout = () => {
        // Clear the session data
        sessionStorage.removeItem("student_session");

        // Optional: Clear other app data like cart or preferences if necessary
        // localStorage.removeItem("cart"); 

        // Redirect to login or home
        navigate("/login");

        // Force a reload if you need to reset all React states immediately
        window.location.reload();
    };

    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        categories: [
            { id: "shopping", name: t("categories2.title"), icon: ShoppingCart, path: "/dashbord" },
            { id: "courses", name: t("categories2.title1"), icon: GraduationCap, path: "/courses" },
            { id: "percel", name: t("categories2.title2"), icon: Package, path: "/percel" },
            { id: "topup", name: t("categories2.title3"), icon: Package, path: "/topup" },
            { id: "drive", name: t("categories2.title4"), icon: Truck, path: "/drive" },
            { id: "cookups", name: t("categories2.title5"), icon: ChefHat, path: "/outlet" },
        ],
        navMain: {
            shopping: [
                {
                    title: t("navMain.title1"),
                    url: "/dashboard",
                    icon: SquareTerminal,
                    isActive: true,
                    items: [
                        // { title: "Web Development", url: "" },
                        // { title: "Mobile App Development", url: "" },
                    ],
                },
            ],
            course: [
                {
                    title: "Medicines",
                    url: "/course/medicines",
                },
            ],
            percel: [],
            topup: [],
            drive: [],
            cookups: [
                {
                    title: "Ready Meals",
                    url: "/cookups/ready-meals",
                    icon: ChefHat,
                    isActive: true,
                    items: [],
                },
            ],
            outlet: [],
        },
    };

    return (
        <SidebarProvider className="">
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <Link to="/dashboard">
                        <img src={logo} alt="logo" className="w-full border-b-2 border-gray pb-2" />
                    </Link>
                </SidebarHeader>
                <div className="px-4 py-3 border-b ">
                    <div className="flex flex-row justify-between gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent p-2">
                        {data.categories.map((category) => (
                            <Link
                                key={category.id}
                                to={category.path}
                                onClick={() => setActiveCategory(category.id)}
                                className={`h-16 w-24 p-3 flex flex-col items-center justify-center rounded ${activeCategory === category.id
                                    ? "bg-primary-default border border-primary-default text-white"
                                    : "border border-primary-default text-gray-700"
                                    }`}
                                aria-label={category.name}
                            >
                                <category.icon className="h-6 w-6 mb-1" />
                                <span className="text-xs">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            {data.navMain[activeCategory as keyof typeof data.navMain]?.map((item) => (
                                <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon />}
                                                <Link to={item.url}>{item.title}</Link>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link to={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="h-auto min-h-[68px] w-full p-2.5 pr-2 flex items-stretch justify-between bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden"
                                    >
                                        {/* --- HELP SECTION (Priority Focus) --- */}
                                        <Link
                                            to="/help"
                                            className="group flex flex-1 items-center justify-center gap-2 rounded-xl hover:bg-teal-50/50 transition-all duration-300 border-2 border-slate-100 hover:border-teal-200 px-2 py-1 shadow-sm hover:shadow"
                                        >
                                            {/* Shrunk icon box from h-10 to h-8 */}
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                                <HelpCircleIcon className="h-5 w-5" />
                                            </div>

                                            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                                                {/* Decreased font from 14px to 12px */}
                                                <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider leading-none">
                                                    {t("help")}
                                                </span>
                                                {/* Decreased font from 10px to 9px */}
                                                <span className="text-[8px] font-bold text-teal-600/60 uppercase tracking-widest mt-1">
                                                    Support
                                                </span>
                                            </div>
                                        </Link>

                                        {/* --- BOLD DIVIDER --- */}
                                        <div className="w-[2px] bg-slate-100 my-1 mx-1.5 group-data-[collapsible=icon]:hidden" />

                                        {/* --- LOGOUT SECTION (Secondary Focus) --- */}
                                        <button
                                            onClick={handleLogout}
                                            className="group flex flex-1 items-center justify-end gap-2 rounded-xl hover:bg-rose-50/50 transition-all duration-300 border-2 border-slate-100 hover:border-rose-200 px-2 py-1 outline-none shadow-sm hover:shadow"
                                        >
                                            <div className="flex flex-col items-end group-data-[collapsible=icon]:hidden text-right">
                                                {/* Decreased font from 12px to 11px */}
                                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none transition-all duration-300 group-hover:text-rose-600">
                                                    Logout
                                                </span>
                                                {/* Decreased font from 10px to 8px */}
                                                <span className="text-[8px] font-bold text-rose-400/50 uppercase tracking-tighter mt-1">
                                                    Exit
                                                </span>
                                            </div>

                                            {/* Shrunk icon box from h-9 to h-8 */}
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-rose-50 text-rose-500 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                                                <LogInIcon className="h-5 w-5 rotate-180" />
                                            </div>
                                        </button>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <div className="hidden lg:block sticky top-0 z-40 bg-white">
                    <Header />
                </div>
                <main className="pt-6 ">
                    <button
                        onClick={changeCheckoutModal} // 1. Change this to alter click behavior
                        className="fixed right-0 top-[55%] ..." // 2. Change this to move the button
                    >
                        <div className="flex items-center">
                            {/* 3. Change Icon here (currently ShoppingBag) */}
                            <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-red-500" />

                            <div className="border-l border-gray-300 h-6 md:h-8 mx-2" />

                            <div className="hidden sm:block">
                                {/* 4. DATA MISSING HERE: Add your cart variables inside { } */}
                                <div className="font-semibold text-xs md:text-sm">{/* count */} ITEMS</div>
                                <div className="text-[10px] md:text-xs">৳ {/* total */}</div>
                            </div>
                        </div>
                    </button>

                    <Cart />
                    <LiveChat />

                    <Outlet />
                    <Footer />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
