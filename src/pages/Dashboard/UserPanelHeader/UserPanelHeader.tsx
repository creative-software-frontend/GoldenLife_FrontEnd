'use client'

import { useState, useEffect } from 'react'
// import { useTranslation } from 'next-i18next'
// import Link from 'next/link'
// import Image from 'next/image'
import { Moon, Sun, ChevronDown, UserRound } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AdminHeader() {
    const { t } = useTranslation('global')
    // const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode')
        setDarkMode(savedMode ? JSON.parse(savedMode) : false)
    }, [])

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
    }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src="/image/logo/logo.jpg"
                        alt={t('logo_alt')}
                        width={36}
                        height={36}
                        className="h-9 w-auto object-cover"
                    />

                    <nav className="ml-10 hidden md:flex space-x-8">
                        <Link to="/addmoney" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            {/* {t('dashboard')} */}
                            Add Money
                        </Link>
                        <Link to="/sendmoney" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            {/* {t('deliveries')} */}
                            Send Money
                        </Link>
                        <Link to="/history" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            {/* {t('invoices')} */}
                            History
                        </Link>
                        {/* <Link to="" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            {t('store')}
                        </Link> */}
                    </nav>
                </div>

                <div className="flex items-center space-x-1">
                    {/* <Button className="hidden lg:block color-primary-light">
                        {t('new_order')}
                        Wallet 
                    </Button>
                    <Button variant="default" className="hidden lg:block">
                        {t('new_order')}
                        Boucher
                    </Button>
                    <Button variant="default" className="hidden lg:block">
                        {t('new_order')}
                        Recharge 
                    </Button> */}

                    <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <UserRound className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuItem>
                                <Link to="">

                                    {/* {t('your_profile')} */}
                                    Address Book

                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="">
                                    {/* {t('settings')} */}
                                    Help Center
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button onClick={() => {
                                    localStorage.removeItem('isAuthenticated')
                                    // Add logout logic here
                                }}>
                                    {/* {t('sign_out')} */}
                                    My Reviews

                                </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button onClick={() => {
                                    localStorage.removeItem('isAuthenticated')
                                    // Add logout logic here
                                }}>
                                    {/* {t('sign_out')} */}

                                    Return/Repair
                                </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button onClick={() => {
                                    localStorage.removeItem('isAuthenticated')
                                    // Add logout logic here
                                }}>
                                    {/* {t('sign_out')} */}
                                   
                                    Survey
                                </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button onClick={() => {
                                    localStorage.removeItem('isAuthenticated')
                                    // Add logout logic here
                                }}>
                                    {/* {t('sign_out')} */}

                                    Feedback
                                </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button onClick={() => {
                                    localStorage.removeItem('isAuthenticated')
                                    // Add logout logic here
                                }}>
                                    {/* {t('sign_out')} */}
                                    
                                    Profile
                                </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button onClick={() => {
                                    localStorage.removeItem('isAuthenticated')
                                    // Add logout logic here
                                }}>
                                    {/* {t('sign_out')} */}
                                    Logout

                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

