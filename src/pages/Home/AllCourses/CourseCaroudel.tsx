import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ShoppingCart, Star, User, Clock, BarChart } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useTranslation } from "react-i18next"
import Autoplay from "embla-carousel-autoplay" // 1. Import Autoplay

interface Lesson {
    id: string
    type: string
    number: string
    title: string
    thumbnail: string
    color: string
    badge: string
    image: string
    instructor: string
    rating: number
    studentsEnrolled: number
    duration: string
    level: string
    category: string
}

const CourseCarousel: React.FC<{
    courses: Lesson[],
    title: string,
    onSelect: (lesson: Lesson) => void,
    onAddToCart: (lesson: Lesson) => void
}> = ({ courses, title, onSelect, onAddToCart }) => {
    const [t] = useTranslation("global")

    // 2. Configure Autoplay Plugin
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )

    return (
        <section className="w-full py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                        {title}
                    </h3>
                </div>

                {/* Carousel Container */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[plugin.current]} // 3. Add Plugin
                    onMouseEnter={plugin.current.stop} // Pause on hover
                    onMouseLeave={plugin.current.reset} // Resume on leave
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 pb-4">
                        {courses.map((lesson, index) => (
                            <CarouselItem
                                key={index}
                                // 4. RESPONSIVE LOGIC:
                                // Mobile: 85% (1 card + peek)
                                // Tablet: 50% (2 cards)
                                // Desktop: 33% (3 cards)
                                className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="h-full">
                                    {/* WRAPPER: Apply max-w-4xl to the grid container, NOT the individual card */}
                                    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

                                        <Card className="h-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group flex flex-col bg-white">

                                            {/* Image Section */}
                                            <div className="relative aspect-video overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(lesson)}>
                                                <div
                                                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                    style={{ backgroundImage: `url(${lesson.image})` }}
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                                <Badge className="absolute top-2.5 left-2.5 bg-white/95 text-slate-800 hover:bg-white shadow-sm backdrop-blur-sm border-0 font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                                                    {lesson.badge}
                                                </Badge>

                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
                                                    <div className="bg-white/95 p-2.5 rounded-full shadow-lg text-green-600 transition-transform hover:scale-110">
                                                        <Play className="h-5 w-5 fill-current ml-0.5" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <CardContent className="p-4 flex-1 flex flex-col gap-2.5">
                                                {/* Top Meta: Type & Rating */}
                                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`w-2 h-2 rounded-full shadow-sm ${lesson.color}`} />
                                                        <span>{lesson.type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <span className="text-slate-700">{lesson.rating}</span>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h4
                                                    className="font-bold text-[15px] leading-snug text-slate-900 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors mt-0.5"
                                                    onClick={() => onSelect(lesson)}
                                                    title={lesson.title}
                                                >
                                                    <span className="text-slate-400 font-medium mr-1.5 text-xs">#{lesson.number}</span>
                                                    {lesson.title}
                                                </h4>

                                                {/* Bottom Meta (Pushed to bottom) */}
                                                <div className="mt-auto pt-2 flex flex-col gap-2.5">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="line-clamp-1">{lesson.instructor}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 border-t border-slate-100 pt-2.5">
                                                        <div className="flex items-center gap-1">
                                                          
                                                            {lesson.duration}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <BarChart className="w-3.5 h-3.5 text-slate-400" />
                                                            {lesson.level}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            {/* Actions Footer */}
                                            <CardFooter className="p-4 pt-0 flex gap-2">
                                                <Button
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all font-semibold text-xs h-9"
                                                    onClick={() => onSelect(lesson)}
                                                >
                                                    {t("buttons.show")}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="w-9 h-9 shrink-0 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        onAddToCart(lesson);
                                                    }}
                                                    aria-label={t("buttons.addToCart")}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </Button>
                                            </CardFooter>

                                        </Card>

                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* 5. Navigation Buttons: HIDDEN on Mobile, Visible on Tablet/Desktop */}
                    <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12 h-12 w-12 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-md transition-transform hover:scale-110" />
                    <CarouselNext className="hidden md:flex -right-4 lg:-right-12 h-12 w-12 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-md transition-transform hover:scale-110" />
                </Carousel>
            </div>
        </section>
    )
}

export default CourseCarousel
