// src/data/navData.tsx

import {
    Carrot, ShoppingCart, Pill, Milk, Fish, Coffee, Cookie, 
    Package, Snowflake, Scissors, Home, Baby, Dumbbell, 
    ChefHat, ShoppingBag, GraduationCap, Truck
} from 'lucide-react';

// This function takes the translation function 't' as an argument
export const getNavData = (t: any) => {
    return {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        categories: [
            { id: "shopping", name: t("categories2.title"), icon: ShoppingCart, path: "/dashboard" },
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
                    icon: Carrot,
                    isActive: true,
                    items: [
                        // { title: "Fresh Fruits", url: "" },
                    ],
                },
                {
                    title: t("navMain.title2"),
                    url: "",
                    icon: ShoppingCart,
                    items: [],
                },
                {
                    title: t("navMain.title3"),
                    url: "",
                    icon: Pill,
                    items: [],
                },
                {
                    title: t("navMain.title4"),
                    url: "",
                    icon: Milk,
                    items: [],
                },
                {
                    title: t("navMain.title5"),
                    url: "",
                    icon: Fish,
                    items: [],
                },
                {
                    title: t("navMain.title6"),
                    url: "",
                    icon: Coffee,
                    items: [],
                },
                {
                    title: t("navMain.title7"),
                    url: "",
                    icon: Cookie,
                    items: [],
                },
                {
                    title: t("navMain.title8"),
                    url: "",
                    icon: Package,
                    items: [],
                },
                {
                    title: t("navMain.title9"),
                    url: "",
                    icon: Snowflake,
                    items: [],
                },
                {
                    title: t("navMain.title10"),
                    url: "",
                    icon: Scissors,
                    items: [],
                },
                {
                    title: t("navMain.title11"),
                    url: "",
                    icon: Home,
                    items: [],
                },
                {
                    title: t("navMain.title12"),
                    url: "",
                    icon: Baby,
                    items: [],
                },
                {
                    title: t("navMain.title14"),
                    url: "",
                    icon: Dumbbell,
                    items: [],
                },
                {
                    title: t("navMain.title15"),
                    url: "",
                    icon: ChefHat,
                    items: [],
                },
            ],
            course: [{ title: "Course", url: "/course/medicines" }],
            percel: [],
            topup: [],
            drive: [],
            cookups: [
                {
                    title: "Design",
                    url: "/courses/design",
                    icon: ShoppingBag,
                    items: [],
                },
            ],
            outlet: [],
        }
    };
};