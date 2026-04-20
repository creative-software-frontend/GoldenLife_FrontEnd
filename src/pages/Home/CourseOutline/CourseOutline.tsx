"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import course1 from "../../../../public/image/Banner/Screenshot_3.png"; // Ensure this path is correct
import CourseFeature from "../CourseFeature/CourseFeature";

const CourseOutline = () => {
    const [showCourseFeatures, setShowCourseFeatures] = useState(false); // State to toggle CourseFeature visibility
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = React.useState(0);

    // Static course data
    const courses = [
        {
            id: 1,
            title: "Foundation of Sleep: Sleep Science and Sleep Disorders",
            level: "Beginner",
            category: "Nutrition and Diet",
            rating: 4.9,
            reviews: 586,
            duration: "6h 34m",
            lessons: 3,
            instructor: {
                name: "Kilian Murphy",
                image: "/placeholder.svg",
            },
            price: 40,
            image: "/placeholder.svg",
        },
        {
            id: 6,
            title: "Introduction to Health and Nutrition",
            level: "Beginner",
            category: "Nutrition and Diet",
            rating: 4.9,
            reviews: 566,
            duration: "6h 34m",
            lessons: 3,
            instructor: {
                name: "Kate Winslake",
                image: "/placeholder.svg",
            },
            price: 55,
            image: course1, // Correct usage
        },
    ];

    const slideLeft = () => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.offsetWidth;
            sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            setCurrentSlide((prev) => Math.max(prev - 1, 0));
        }
    };

    const slideRight = () => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.offsetWidth;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            setCurrentSlide((prev) => Math.min(prev + 1, courses.length - 1));
        }
    };

    const openCourseOutline = () => {
        setShowCourseFeatures(true); // Show the CourseFeature component when button is clicked
    };

    return (
        <div className="px-4 py-6 max-w-[1100px] mx-auto">
            {/* Open Course Structure button */}
            <button
                onClick={openCourseOutline}
                className="px-6 py-2 bg-primary-default text-white rounded-lg transition-all mb-6"
            >
                Open Course Feature
            </button>

            {/* Course Content */}
            <div className="p-4 bg-gray-100 rounded shadow-md h-[450px]">
                <h2 className="text-2xl font-bold mb-4">Our popular courses</h2>
                <div className="flex items-center justify-between mb-6">
                    <div className="max-w-2xl">
                        <p className="text-muted-foreground">
                            By taking proactive steps to nurture mental health, we can enhance our quality of life, build resilience, and foster a sense of inner peace and balance.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button variant="outline" size="icon" onClick={slideLeft} aria-label="Previous slide">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button variant="outline" size="icon" onClick={slideRight} aria-label="Next slide">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Slider with Course Cards */}
                <div ref={sliderRef} className="flex overflow-x-hidden scroll-smooth" aria-live="polite">
                    {courses.map((course) => (
                        <Card key={course.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4 p-4 mr-6">
                            <div className="relative">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    width={400}
                                    height={200}
                                    className="object-cover w-full h-48 rounded-md"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button size="icon" variant="secondary">
                                        <ShoppingCart className="h-4 w-4" />
                                        <span className="sr-only">Add to cart</span>
                                    </button>
                                    <button size="icon" variant="secondary">
                                        <Heart className="h-4 w-4" />
                                        <span className="sr-only">Add to favorites</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex gap-2 mb-2">
                                    <Badge variant="secondary">{course.level}</Badge>
                                    <Badge variant="secondary">{course.category}</Badge>
                                </div>
                                <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                                <div className="flex items-center gap-1 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(course.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {course.rating} ({course.reviews})
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>{course.lessons} Lessons</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={course.instructor.image}
                                            alt={course.instructor.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <span className="text-sm font-medium">{course.instructor.name}</span>
                                    </div>
                                    <span className="font-bold">${course.price}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Render CourseFeature when the button is clicked */}
                {showCourseFeatures && <CourseFeature />}
            </div>
        </div>
    );
};

export default CourseOutline;
