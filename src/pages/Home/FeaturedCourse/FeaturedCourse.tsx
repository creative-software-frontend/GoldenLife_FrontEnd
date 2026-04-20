'use client'

import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { ShoppingCart } from 'lucide-react'

interface Course {
    id: string
    title: string
    instructor: string
    price: string
    promoCode: string
    image: string
}

export default function FeaturedCourse() {
    const { t } = useTranslation('global')

    const courses: Course[] = [
        { id: '1', title: t("course.fb"), instructor: t("name.sakib"), price: '1,690', promoCode: 'SE1690', image: '/image/featiredcourse/f4.jpg' },
        { id: '2', title: t("course.yt"), instructor: t("name.ayman"), price: '3,850', promoCode: 'IELTS3850', image: '/image/featiredcourse/f3.jpg' },
        { id: '3', title: t("course.seo"), instructor: t("name.shahid"), price: '1,690', promoCode: 'EMKF1690', image: '/image/featiredcourse/f2.jpg' },
        { id: '4', title: t("course.smm"), instructor: t("name.ayman"), price: '890', promoCode: 'FBM890', image: '/image/featiredcourse/f1.jpg' },
    ]

    return (
        <section className="w-full py-16 bg-gray-50/50">
            {/* Increased width to max-w-8xl */}
            <div className="mx-auto px-4 max-w-7xl w-full">
                
                {/* Header - Larger and more prominent */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {t("course.h") || "Featured Courses"}
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
                        {t("course.p") || "Explore our top-rated courses designed for your career success."}
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {courses.map((course) => (
                        <Card key={course.id} className="border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group bg-white flex flex-col h-full hover:-translate-y-2">
                            
                            {/* Image Section */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Content Section */}
                            {/* Increased padding to p-5 */}
                            <CardContent className="p-5 flex-1 flex flex-col">
                                {/* Increased title size to text-lg/xl */}
                                <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors cursor-pointer mb-2">
                                    {course.title}
                                </h3>
                                {/* Increased instructor text size */}
                                <p className="text-gray-500 text-sm font-medium mb-4">
                                    by <span className="text-slate-700">{course.instructor}</span>
                                </p>

                                {/* Price & Promo - Spacious */}
                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Price</p>
                                        {/* Increased price size to text-2xl */}
                                        <p className="text-2xl font-black text-slate-900 leading-none">৳{course.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Promo</p>
                                        {/* Increased promo code size */}
                                        <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-mono font-bold px-2 py-1 rounded border border-emerald-100 leading-none">
                                            {course.promoCode}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>

                            {/* Actions Footer */}
                            <CardFooter className="p-5 pt-0 grid grid-cols-5 gap-3">
                                {/* Increased button height to h-11 and font to text-sm */}
                                <Button className="col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm h-11 rounded-xl shadow-md transition-all active:scale-95 tracking-wide">
                                    {t("buttons.show") || "View Details"}
                                </Button>
                                <Button variant="outline" size="icon" className="col-span-1 border-emerald-100 text-emerald-600 hover:bg-emerald-50 h-11 w-full rounded-xl shadow-sm">
                                    {/* Increased icon size */}
                                    <ShoppingCart className="w-5 h-5" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}