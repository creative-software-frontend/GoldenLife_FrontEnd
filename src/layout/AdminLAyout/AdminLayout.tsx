'use client'

import { useState } from 'react'
// import { useTranslation } from 'next-i18next'
import { Truck, ChevronRight, Info, Instagram, Twitter, Facebook, Youtube, Linkedin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import AdminHeader from '@/pages/Dashboard/UserPanelHeader/UserPanelHeader'
import { useTranslation } from 'react-i18next'
import Products from '@/pages/Home/products/Products'
import IconsSection from '@/pages/Home/IconSection/IconSection'
import DCatagories from '@/pages/DCatagories/DCatagories'
import DCourse from '@/pages/DCourse/DCourse'
import WalletAmount from '@/pages/WalletAmount/WalletAmount'
import OrderDetailsTable from '@/pages/OrderDetailsTable/OrderDetailsTable'
import CourseOrderTable from '@/pages/Home/CourseOrderTable/CourseOrderTable'
import { Link } from 'react-router-dom'
// import AdminHeader from '@/components/AdminHeader'


export default function AdminDashboard() {

  const currentYear = new Date().getFullYear();

  const { t,i18n} = useTranslation('global')
  const [dateRange, setDateRange] = useState<string>(t('today'))

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
  }

  return (
    <>
      <AdminHeader />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <IconsSection />
        <WalletAmount />
      </div>

    

      <main className="w-full min-h-screen mx-auto px-6 sm:px-6 lg:px-1 py-2 bg-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              {/* First Div - 1/3 of Width */}
              <div className="shadow rounded-lg w-full lg:w-1/3 bg-white flex items-center justify-center py-8">
                <h2 className="text-lg font-medium text-center">{t('brief_stats')}</h2>
              </div>

              {/* Second Div - 2/3 of Width */}
              <div className="shadow rounded-lg p-6 w-full lg:w-2/3 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Date Range Buttons */}
                  <div
                    className="flex flex-col sm:flex-row rounded-md shadow-sm space-y-2 sm:space-y-0 sm:space-x-2"
                    role="group"
                  >
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto rounded-r-none ${dateRange === t('today')
                        ? "bg-primary-default text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      onClick={() => handleDateRangeChange(t('today'))}
                    >
                      {t('today')}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto rounded-r-none ${dateRange === t('this_week')
                        ? "bg-primary-default text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      onClick={() => handleDateRangeChange(t('this_week'))}
                    >
                      {t('this_week')}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto rounded-none border-x-0 ${dateRange === t('this_month')
                        ? "bg-primary-default text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      onClick={() => handleDateRangeChange(t('this_month'))}
                    >
                      {t('this_month')}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full sm:w-auto rounded-l-none ${dateRange === t('this_year')
                        ? "bg-primary-default text-primary-foreground"
                        : "hover:text-accent-foreground"
                        }`}
                      onClick={() => handleDateRangeChange(t('this_year'))}
                    >
                      {t('this_year')}
                    </Button>
                  </div>

                </div>
              </div>
            </div>

            {/* Other content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="pb-4">
                  <h2 className="text-lg font-medium text-start">
                    {t('total_delivered')}
                  </h2>
                </div>
                <div className="text-4xl font-bold text-start">0</div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground text-gray-400">
                      {t('pending_delivery')}
                    </span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground text-gray-400">
                      {t('total_returned')}
                    </span>
                    <span>0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-row items-center justify-between pb-4">
                  <h2 className="text-lg font-medium text-start">
                    {t('payment_invoiced')}
                  </h2>
                  <div className="flex items-center justify-center ">
                    <Button className="mr-4 bg-primary-default">
                      {t('details')}
                    </Button>
                  </div>
                </div>
                <div className="text-4xl font-bold text-start"> ৳ 0</div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <a href="#" className="flex items-center text-gray-400">
                      {t('payment_due')}
                      <div className="flex items-center justify-center w-4 h-4 bg-gray-500 rounded-full ml-2">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                    </a>
                    <span>৳ 0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <a href="#" className="flex items-center text-gray-400">
                      {t('parcel_in_process')}
                      <div className="flex items-center justify-center w-4 h-4 bg-gray-500 rounded-full ml-2">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                    </a>
                    <span> ৳ 0</span>
                  </div>
                </div>
              </div>
            </div>


          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
           
              <Products />
            </div>

          
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4 w-full mt-2">
          <div className="bg-white rounded-lg w-full md:w-1/2">
            <OrderDetailsTable />
          </div>
          <div className="bg-white rounded-lg w-full md:w-1/2">
            <CourseOrderTable />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
          <div className="bg-white rounded-lg w-full md:w-1/2 p-2 mt-2">
            <DCatagories />
          </div>
          <div className="bg-white rounded-lg w-full md:w-1/2 p-2 mt-2">
            <DCourse />
          </div>
        </div>


      </main>
      <div className="border-0 -mb-8 border-gray-300 bg-white py-2">
        <div className="flex flex-wrap justify-between items-center mx-2 px-4">
          <p className="text-gray-600 text-start">{t('copyright', { year: currentYear })}</p>
          <div className="flex space-x-4">
            <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
              <Linkedin size={20} className="text-gray-600" />
            </Link>
            <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
              <Youtube size={20} className="text-gray-600" />
            </Link>
            <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
              <Facebook size={20} className="text-gray-600" />
            </Link>
            <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
              <Twitter size={20} className="text-gray-600" />
            </Link>
            <Link to="#" className="flex items-center justify-center bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300 transition">
              <Instagram size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-1 mx-1">
              <button
                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en')}
                className="text-gray-800"
              >
                {i18n.language === 'en' ? 'BN' : 'EN'}
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

