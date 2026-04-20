import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "../pages/errorpage/Errorpage";
import OrderDetails from "@/pages/Home/OrderDetails/OrderDetails";
import Story from "@/pages/Help/Story/Story";
import Career from "@/pages/Help/Career/Career";
import Contact from "@/pages/Help/Contact/Contact";
import PrivacyPolicy from "@/pages/Help/PrivacyPolicy/PrivacyPolicy";
import UserLayout from "@/layout/userlayout/UserLayout";
import HelpLayout from "@/layout/HelpLayout/HelpLayout";
import Faq from "@/pages/Home/Faq/Faq";
import TermsOfUse from "@/pages/Help/TermsOfUse/TermsOfUse";
import AllCategories from "@/pages/Home/AllCategories/AllCategories";
import ProductPage from "@/pages/Home/ProductPage/ProductPage";
import Home from "@/pages/Home/Home/Home";
import AllProduct from "@/pages/Home/AllProducts/AllProducts";
import Trending from "@/pages/Home/TrendingCategory/Trending";
// import AdminLayout from "@/layout/AdminLAyout/AdminLayout";
// import Overview from "@/pages/Dashboard/Overview/Overview";
import SearchResults from "@/pages/Home/Search/SearchResults";
import AllCourses from "@/pages/Home/AllCourses/AllCourses";
import CourseViewPage from "@/pages/Home/CourseViewPage/CourseViewPage";
import CourseLayout from "@/layout/CourseLayout/CourseLayout";
import Hsc from "@/pages/Home/HSC/Hsc";
import Ssc from "@/pages/Home/SSC/Ssc";
import Course from "@/pages/Home/Course/Course";
import PercelLayout from "@/layout/PercelLayout/PercelLayout";
import TopupLayout from "@/layout/TopUplayout/TopUplayout";
import CommingSoon from "./../pages/commingSoon";
import OutletLayout from "@/layout/OutletLayout/OutletLayout";
import DriveLayout from "@/layout/DriveLayout/DriveLayout";

import LandingLayout from "@/layout/LandingLayout/LandingLayout";

import AllCourses2 from "@/pages/Home/AllCourses2/AllCourses2";
import AddMoney from "@/pages/Dashboard/AddMoney/AddMoney";
import History from "@/pages/Dashboard/History/History";
import SendMoney from "@/pages/Dashboard/SendMoney/SendMoney";
// import PaymentMethod from "@/pages/Dashboard/PaymentMethod/PaymentMethod";
import SendMoneyAmount from "@/pages/Dashboard/SendMoneyAmount/SendMoneyAmount";
import SendMoneyConfirm from "@/pages/Dashboard/SendMoneyConfirm/SendMoneyConfirm";
import Cookies from "@/pages/legal/Cookies";
import Payments from "@/pages/legal/Payments";
import TermsConditions from "@/pages/legal/TermsConditions";
import Login from "@/pages/common/Login/Login";
import Register from "@/pages/common/Register/Register";
import Landing from "@/pages/Landing/Landing";
import AuthLayout from "@/layout/AuthLayout/AuthLayout";
import ProductDetails from "@/pages/ProductDetail/ProductDetails";
import VendorProductDetails from "@/pages/Vendor/Products/ProductDetails";
import VendorLogin from "@/pages/common/Vendor/VendorLogin";
import VendorLoginNew from "@/pages/common/Vendor/VendorLoginNew";
import VendorRegister from "@/pages/common/Vendor/VendorRegister";
import VendorRegisterWithOTP from "@/pages/common/Vendor/VendorRegisterWithOTP";
import CategoryPage from "@/pages/common/CategoryPage/CategoryPage";
import StudentProtectedRoute from "@/components/ProtectedRoute/StudentProtectedRoute";
import ProfileSettings from "@/pages/profile/ProfileSettings";
import ForgotPassword from "@/pages/common/ForgotPassword/ForgotPassword";
import VendorLayout from "@/layout/VendorLayout/VendorLayout";
import VendorHome from "@/pages/VendorHome/VendorHome";
import VendorProtectedRoute from "@/components/ProtectedRoute/VendorProtectedRoute";
import WalletAdd from "@/pages/Wallet/WalletAdd/WalletAdd";
import VendorInfo from "@/pages/Home/VendorInfo/VendorInfo";
import InstructorLogin from "@/pages/common/Instructor/InstructorLogin";
import InstructorRegister from "@/pages/common/Instructor/InstructorRegister";
import InstructorLayout from "@/layout/InstructorLayout/InstructorLayout";
import InstructorHome from "@/pages/InstructorHome/InstructorHome";


// Vendor Profile
import VendorProfile from "@/pages/Vendor/Profile/index";
import ChangePassword from "@/pages/Vendor/Profile/ChangePassword";
import Products from "@/pages/Vendor/ProductManagement/index";
import AddProduct from "@/pages/Vendor/Products/AddProduct";
import EditProduct from "@/pages/Vendor/Products/EditProduct";
// import VendorProductDetails from "@/pages/Vendor/Products/ProductDetails"; 

// Vendor Orders
import Orders from "@/pages/Vendor/Orders/index";
import VendorOrderDetails from "@/pages/Vendor/Orders/OrderDetails";

import WalletSend from "@/pages/Wallet/WalletSend/WalletSend";
import WalletWithdraw from "@/pages/Wallet/WalletWithdraw/WalletWithdraw";
import TransactionHistory from "@/pages/Wallet/TransactionHistory/TransactionHistory";
import WalletPurchase from "@/pages/Dashboard/WalletPurchase/WalletPurchase";
import OrderHistory from "@/pages/common/Orders/OrderHistory";
import BasicInfoTab from "@/components/profile/BasicInfoTab/BasicInfoTab";
import PersonalInfoTab from "@/components/profile/PersonalInfoTab/PersonalInfoTab";
import DocumentInfoTab from "@/components/profile/DocumentInfoTab/DocumentInfoTab";
import NomineeInfoTab from "@/components/profile/NomineeInfoTab/NomineeInfoTab";
import AdditionalInfoTab from "@/components/profile/AdditionalInfoTab/AdditionalInfoTab";
import ProjectOverviewTab from "@/components/profile/ProjectOverviewTab/ProjectOverviewTab";
import ChangePassward from "@/components/profile/ChangePassward/ChangePassward";
import ReferralsTab from "@/components/profile/ReferralsTab/ReferralsTab";

// Vendor Wallet
import VendorAddMoney from "@/pages/Vendor/Wallet/VendorAddMoney";
import VendorWithdraw from "@/pages/Vendor/Wallet/VendorWithdraw";
import VendorTransactions from "@/pages/Vendor/Wallet/VendorTransactions";
// import SendMoney from './../pages/Dashboard/SendMoney/SendMoney';



// Help Pages
import HelpLanding from "@/pages/Help/HelpLanding";
import HotlinePage from "@/pages/Help/HotlinePage";
import SupportTicketPage from "@/pages/Help/SupportTicketPage";
import FAQPage from "@/pages/Help/FAQPage";
import AISupportPage from "@/pages/Help/AISupportPage";



export const routes = createBrowserRouter([
    // PUBLIC ROUTES (No Layout - Full Screen Pages)
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {

                path: "/forgot-password",
                element: <ForgotPassword />
            }

        ],
    },

    // 👇 ADD THIS NEW OBJECT HERE (Outside AuthLayout)
    {
        path: '/vendor/login',
        element: <VendorLogin />,
    },
    {
        path: '/vendor/login-otp',
        element: <VendorLoginNew />,
    },
    // {
    //     path: '/vendor/register',
    //     element: <VendorRegisterWithOTP />,
    // },
    {
        path: '/vendor/register',
        element: <VendorRegister />,
    },
    {
        path: '/instructor/login',
        element: <InstructorLogin />,
    },
    {
        path: '/instructor/register',
        element: <InstructorRegister />,
    },

    {
        path: '/',
        // REMOVE 'element: <LandingLayout/>' from here to stop it applying to everything
        children: [
            // 1. LANDING PAGE (Stays separate, assumes it has its own Header)
            {
                path: '/',
                element: <Landing />
            },

            // 2. LEGAL PAGES GROUP (Apply LandingLayout ONLY to these)
            {
                element: <LandingLayout />, // This adds Header/Footer to children below
                children: [
                    {
                        path: 'cookies',
                        element: <Cookies />
                    },
                    {
                        path: 'payments',
                        element: <Payments />
                    },
                    {
                        path: 'terms',
                        element: <TermsConditions />
                    },
                    // {
                    //     path: 'privacy', 
                    //     element: <PrivacyPolicyLegal />
                    // },
                    // {
                    //     path: 'security', 
                    //     element: <Security />
                    // },
                ]
            }
        ]
    },
    // Inside your routes array
    {
        element: <StudentProtectedRoute />, // The Gatekeeper
        children: [
            {
                path: '/dashboard',
                element: <UserLayout />,
                children: [
                    {
                        path: '',
                        element: <Home />
                    },
                    {
                        path: 'allcategories',
                        element: <AllCategories />
                    },
                    {
                        path: 'all-courses',
                        element: <AllCourses2 />
                    },
                    {
                        path: 'productpage',
                        element: <ProductPage />,
                    },
                    {
                        path: 'allProducts',
                        element: <AllProduct />,
                    },
                    {
                        path: 'product/:id',
                        element: <ProductDetails />,
                    },
                    {
                        path: 'vendor-info/:id',
                        element: <VendorInfo />,
                    },
                    {
                        path: "category/:id",
                        element: <CategoryPage />,
                    },
                    {
                        path: 'wallet/add',
                        element: <WalletAdd />
                    },
                    {
                        path: 'wallet/send',
                        element: <WalletSend />
                    },
                    {
                        path: 'wallet/withdraw',
                        element: <WalletWithdraw />
                    },
                    {
                        path: 'wallet/purchase', // Renders at /vendor/dashboard/wallet/withdraw
                        element: <WalletPurchase />
                    },
                    {
                        path: 'wallet/all', // Renders at /vendor/dashboard/wallet/withdraw
                        element: <TransactionHistory />
                    },
                    {
                        path: 'order', // REMOVED THE SLASH HERE
                        element: <OrderHistory />
                    },
                    {
                        path: 'order-details',  // Separate route for Help page
                        element: <OrderDetails />,
                    },
                    // Inside your routes array, replacing the old profile/settings line:
                    {
                        path: "profile/settings",
                        element: <ProfileSettings />,
                        children: [
                            // Redirect the base URL to basic-info by default
                            { index: true, element: <Navigate to="basic-info" replace /> },
                            { path: "project-overview-info", element: <ProjectOverviewTab /> },
                            // These will render inside the <Outlet /> in ProfileSettings.tsx
                            { path: "basic-info", element: <BasicInfoTab /> },
                            { path: "personal-info", element: <PersonalInfoTab /> },
                            { path: "document-info", element: <DocumentInfoTab /> },
                            { path: "nominee-info", element: <NomineeInfoTab /> },
                            { path: "Additional-info", element: <AdditionalInfoTab /> },
                            { path: "Change-passward", element: <ChangePassward /> },
                            { path: "referrals", element: <ReferralsTab /> },
                        ]
                    },
                    {
                        path: 'help', // This creates /dashboard/help
                        element: <HelpLayout />, // Ensure this layout has an <Outlet />
                        children: [
                            {
                                index: true, // Default view: /dashboard/help
                                element: <HelpLanding />
                            },
                            {
                                path: 'faq',
                                element: <FAQPage />
                            },

                            {
                                path: 'ticket',
                                element: <SupportTicketPage />
                            },
                            {
                                path: 'hotline',
                                element: <HotlinePage />
                            },
                            {
                                path: 'ai',
                                element: <AISupportPage />
                            },
                            {
                                path: 'profile/settings', // Becomes /dashboard/help/profile/settings
                                element: <ProfileSettings />
                            },
                            {
                                path: 'our-story',
                                element: <Story />,
                            },
                            {
                                path: 'career',
                                element: <Career />,
                            },
                            {
                                path: 'contact',
                                element: <Contact />,
                            },
                            {
                                path: 'privacy-policy',
                                element: <PrivacyPolicy />,
                            },
                            {
                                path: 'terms',
                                element: <TermsOfUse />,
                            }
                        ]
                    },
                    {
                        path: 'search',
                        element: <SearchResults />
                    }
                ]
            }
        ]
    },
    {
        path: '/vendor',
        element: <VendorProtectedRoute />,
        children: [
            {
                element: <VendorLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />
                    },
                    {
                        path: 'dashboard', // <-- Parent path
                        children: [
                            {
                                index: true, // Renders at /vendor/dashboard
                                element: <VendorHome />
                            },

                            // Vendor Profile Route
                            {
                                path: 'profile',
                                element: <VendorProfile />
                            },

                            // Vendor Change Password Route
                            {
                                path: 'change-password',
                                element: <ChangePassword />
                            },

                            // Vendor Products Route
                            {
                                path: 'products',
                                element: <Products />
                            },

                            // NEW: Product Add/Edit Routes
                            {
                                path: 'products/add',
                                element: <AddProduct />
                            },
                            {
                                path: 'products/edit/:id',
                                element: <EditProduct />
                            },
                            {
                                path: 'products/:id',
                                element: <VendorProductDetails />
                            },

                            // NEW: Vendor Order Management Routes
                            {
                                path: 'orders',
                                element: <Orders />
                            },
                            {
                                path: 'orders/:order_no',
                                element: <VendorOrderDetails />
                            },

                            // Existing wallet routes

                            {
                                path: 'wallet/vendor_add',
                                element: <VendorAddMoney />
                            },
                            {
                                path: 'wallet/vendor_withdraw',
                                element: <VendorWithdraw />
                            },
                            {
                                path: 'wallet/vendor_all',
                                element: <VendorTransactions />
                            },


                            //  {
                            //     path: 'wallet/receiveHistory', // Renders at /vendor/dashboard/wallet/withdraw
                            //     element: <WalletReceiveHistory />
                            // },
                            {
                                path: 'help',
                                element: <HelpLayout />,
                                children: [
                                    {
                                        index: true,
                                        element: <HelpLanding />
                                    },
                                    {
                                        path: 'faq',
                                        element: <FAQPage />
                                    },

                                    {
                                        path: 'ticket',
                                        element: <SupportTicketPage />
                                    },
                                    {
                                        path: 'hotline',
                                        element: <HotlinePage />
                                    },
                                    {
                                        path: 'ai',
                                        element: <AISupportPage />
                                    },
                                    {
                                        path: 'contact',
                                        element: <Contact />,
                                    },
                                    {
                                        path: 'our-story',
                                        element: <Story />,
                                    },
                                    {
                                        path: 'career',
                                        element: <Career />,
                                    },
                                    {
                                        path: 'privacy-policy',
                                        element: <PrivacyPolicy />,
                                    },
                                    {
                                        path: 'terms',
                                        element: <TermsOfUse />,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: '/instructor',
        children: [
            {
                element: <InstructorLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />
                    },
                    {
                        path: 'dashboard',
                        children: [
                            {
                                index: true,
                                element: <InstructorHome />
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: '/courses',
        element: <CourseLayout />,


        children: [

            {
                path: '/courses',
                element: < Course />
            },


            {
                path: 'hsc',
                element: < Hsc />
            },

            {
                path: 'ssc',
                element: < Ssc />
            },




        ]

    },


    {
        path: '/percel',
        element: <PercelLayout />, // Layout for percel page
        children: [
            {
                path: '/percel',
                element: <CommingSoon />,
            },
        ]

    },
    {
        path: '/topup',
        element: <TopupLayout />, // Layout for percel page
        children: [
            {
                path: '/topup',
                element: <CommingSoon />,
            },
        ]

    },
    {
        path: '/drive',
        element: <DriveLayout />, // Layout for percel page
        children: [
            {
                path: '/drive',
                element: <CommingSoon />,
            },
        ]

    },
    {
        path: '/outlet',
        element: <OutletLayout />, // Layout for percel page
        children: [
            {
                path: '/outlet',
                element: <CommingSoon />,
            },
        ]

    },



    // {
    //     path: '/dashboard',
    //     element: <AdminLayout />, // Layout for dashboard panel
    //     children: [
    //         {
    //             path: '/dashboard',
    //             element: <Overview />,
    //         },
    //         // {
    //         //     path: 'merchants',
    //         //     element: <MerchantList />,
    //         // },
    //         // {
    //         //     path: 'riders',
    //         //     element: <RiderList />,
    //         // },
    //         // {
    //         //     path: 'districts',
    //         //     element: <Districts />,
    //         // },
    //         // {
    //         //     path: 'setting',
    //         //     element: <Setting />,
    //         // },
    //         {
    //             path: 'addmoney',  // Separate route for Help page
    //             element: <AddMoney />,
    //         },
    //         {
    //             path: 'history',  // Separate route for Help page
    //             element: <History />,
    //         },
    //         {
    //             path: 'sendmoney',  // Separate route for Help page
    //             element: <SendMoney />,
    //         },
    //         {
    //             path: 'paymentmethod',  // Separate route for Help page
    //             element: <PaymentMethod />,
    //         },


    //     ],
    // },
    {
        path: '/allcourses',  // Separate route for Help page
        element: <AllCourses />,
    },

    {
        path: '/trending',  // Separate route for Help page
        element: <Trending />,
    },
    {
        path: '/productviewpage',  // Separate route for Help page
        element: <CourseViewPage />,
    },
    {
        path: '/addmoney',  // Separate route for Help page
        element: <AddMoney />,
    },
    {
        path: '/history',  // Separate route for Help page
        element: <History />,
    },
    {
        path: '/sendmoney',  // Separate route for Help page
        element: <SendMoney />,
    },
    {
        path: '/payamount',  // Separate route for Help page
        element: <SendMoneyAmount />,
    },
    {
        path: '/sendmoneyconfirm',  // Separate route for Help page
        element: <SendMoneyConfirm />,
    },

    {
        path: '*',
        element: <ErrorPage />, // Error page for undefined routes
    },

])
