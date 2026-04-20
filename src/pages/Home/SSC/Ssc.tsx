'use client'

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useTranslation } from "react-i18next"

interface Lesson {
    type: string
    number: string
    title: string
    thumbnail: string
    color: string
    badge: string
}

const lessons: Lesson[] = [
    {
        type: "ssc",
        number: "2.1",
        title: "ভেক্টরের পরিচয় ও প্রকারভেদ",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-purple-500",
        badge: "ssc",
    },
    {
        type: "hsc",
        number: "8.1",
        title: "আলোর প্রকৃতি",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-blue-500",
        badge: "hsc",
    },
    {
        type: "ssc",
        number: "2.1",
        title: "ভেক্টরের পরিচয় ও প্রকারভেদ",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-purple-500",
        badge: "ssc",
    },
    {
        type: "hsc",
        number: "8.1",
        title: "আলোর প্রকৃতি",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-blue-500",
        badge: "hsc",
    },
    {
        type: "ssc",
        number: "2.1",
        title: "ভেক্টরের পরিচয় ও প্রকারভেদ",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-purple-500",
        badge: "ssc",
    },
    {
        type: "hsc",
        number: "8.1",
        title: "আলোর প্রকৃতি",
        thumbnail: "/placeholder.svg?height=200&width=400",
        color: "bg-blue-500",
        badge: "hsc",
    },
]

const CourseCarousel: React.FC<{ courses: Lesson[], title: string }> = ({ courses, title }) => {
    const { t } = useTranslation("global")
    return (
        <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">{t(title)}</h3>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full container mx-auto"
            >
                <CarouselContent>
                    {courses.map((lesson, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                            <Card className="border-0 shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
                                <CardContent className="p-0">
                                    <div className="relative aspect-[2/1] bg-teal-100">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Button size="icon" className="h-16 w-16 rounded-full bg-white/90 hover:bg-white shadow-lg">
                                                <Play className="h-8 w-8 text-slate-600 ml-1" />
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-white rounded-md px-2 py-1 text-xs">
                                            {t(`lesson.badge.${lesson.badge}`)}
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${lesson.color}`} />
                                            <span className="text-sm text-slate-600">{t(`lesson.type.${lesson.type}`)}</span>
                                        </div>
                                        <h4 className="font-medium text-start text-slate-900">{lesson.number} - {t(`lesson.${lesson.type.toLowerCase().replace(/\s+/g, '')}`)}</h4>
                                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                                            {t("buttons.enroll")}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
                <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-0 bg-white shadow-lg" />
            </Carousel>
        </div>
    )
}

export default function Ssc() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-6 flex justify-center">
            <div className="w-full">
                <CourseCarousel
                    courses={lessons.slice(0, 4)}
                    title="courses.ssc"
                />
            </div>
        </div>
    )
}
