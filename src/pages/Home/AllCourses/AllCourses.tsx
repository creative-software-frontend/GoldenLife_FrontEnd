'use client'

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, X, Play, ShoppingCart } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Coursecatagory2 from "../Coursecatagory2/Coursecatagory2"
import CourseInstructor from "../Courseinstructor/CourseInstructor"
import CoursePlan from "../CoursePlan/CoursePlan"
import CourseDetails from "../CourseDetails/CourseDetails"
import CourseFeatures from "../CourseFeature/CourseFeature"
import useModalStore from '@/store/modalStore'
import { useTranslation } from "react-i18next"
import CourseCarousel from "@/pages/Home/AllCourses/CourseCaroudel"
import CourseGrid from "./CourseGrid"

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
  quantity?: number;
}




//const CourseCarousel: React.FC<{ ... }> = ({ courses, title, onSelect, onAddToCart }) => { ... }


export default function AllCourses() {

  // const { changeCheckoutModal, toggleClicked } = useModalStore();
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<"instructor" | "structure" | "details" | "feature">("instructor")
  const [cart, setCart] = React.useState<Lesson[]>([])
  const [isCartModalOpen, setIsCartModalOpen] = React.useState(false)
  const { t } = useTranslation("global"); // Update here
  const scrollLeftRef = React.useRef(0);

  // const [cart, setCart] = React.useState<any[]>([]);
  const lessons: Lesson[] = [
    {
      id: "1",
      type: t("type.1"), // Update here
      number: "2.1",
      title: t("title.2"), // Update here
      thumbnail: "/placeholder.svg?height=200&width=400",
      color: "bg-purple-500",
      badge: t("badge.HSC"), // Update here
      image: "/placeholder.svg?height=400&width=800",
      instructor: "Dr. Rahim Khan",
      rating: 4.8,
      studentsEnrolled: 1500,
      duration: "8 weeks",
      level: "Intermediate",
      category: "Mathematics",
    },
    {
      id: "2",
      type: t("type.2"), // Update here
      number: "8.1",
      title: t("title.3"), // Update here
      thumbnail: "/placeholder.svg?height=200&width=400",
      color: "bg-blue-500",
      badge: t("badge.JSC"), // Update here
      image: "/placeholder.svg?height=400&width=800",
      instructor: "Prof. Salma Begum",
      rating: 4.7,
      studentsEnrolled: 2000,
      duration: "6 weeks",
      level: "Beginner",
      category: "Physics",
    },
    {
      id: "3",
      type: t("type.5"), // Update here
      number: "8.1",
      title: t("title.1"), // Update here
      thumbnail: "/placeholder.svg?height=200&width=400",
      color: "bg-blue-500",
      badge: t("badge.SSC"), // Update here
      image: "/placeholder.svg?height=400&width=800",
      instructor: "Prof. Salma Begum",
      rating: 4.7,
      studentsEnrolled: 2000,
      duration: "6 weeks",
      level: "Beginner",
      category: "Physics",
    },
    {
      id: "4",
      type: t("type.4"), // Update here
      number: "8.1",
      title: t("title.2"), // Update here
      thumbnail: "/placeholder.svg?height=200&width=400",
      color: "bg-blue-500",
      badge: t("badge.PSC"), // Update here
      image: "/placeholder.svg?height=400&width=800",
      instructor: "Prof. Salma Begum",
      rating: 4.7,
      studentsEnrolled: 2000,
      duration: "6 weeks",
      level: "Beginner",
      category: "Physics",
    },
    // Add more lessons here...
  ];


  // const addToCart = (product: Product) => {
  //   const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  //   const updatedCart = [...existingCart, {
  //     ...product,
  //     quantity: 1
  //   }];
  //   localStorage.setItem("cart", JSON.stringify(updatedCart));
  // };
  const handleCourseSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedLesson(null)
  }

  // const addToCart = (lesson: Lesson) => {
  //   setCart((prevCart) => [...prevCart, lesson])
  //   setIsCartModalOpen(true)
  // }

  const closeCartModal = () => {
    setIsCartModalOpen(false)
  }
  const addToCart = (lesson: Lesson) => {
    // Retrieve existing cart items from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if the lesson already exists in the cart
    const existingLessonIndex = existingCart.findIndex((item: Lesson) => item.id === lesson.id);

    if (existingLessonIndex !== -1) {
      // If the lesson exists, update the quantity
      existingCart[existingLessonIndex].quantity += 1;
    } else {
      // If the lesson does not exist, add it to the cart
      existingCart.push({
        ...lesson,
        quantity: 1, // Initialize quantity to 1
      });
    }

    // Update state and localStorage
    setCart(existingCart);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Trigger update in other components
    // toggleClicked();
  };

  return (
    <>
      <Coursecatagory2 />
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-0">
        <div className="space-y-2">
          <CourseGrid
            courses={lessons.slice(0, 4)}
            title={t("Popular Courses")}
            onSelect={handleCourseSelect}
            onAddToCart={addToCart}
          />
          <CourseGrid
            courses={lessons}
            title={t("All Courses")}
            onSelect={handleCourseSelect}
            onAddToCart={addToCart}
          />
        </div>

        {isModalOpen && selectedLesson && (
          <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                {/* <DialogTitle>{selectedLesson.title}</DialogTitle> */}
              </DialogHeader>
              <div className="overflow-y-auto max-h-[80vh]">
                <div
                  className="relative w-full bg-cover bg-center text-white"
                  style={{ backgroundImage: `url(${selectedLesson.image})` }}
                >
                  <div className="absolute inset-0 bg-black opacity-60"></div>
                  <div className="relative z-10 h-full max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col justify-center">
                    <div className="space-y-6 text-start">
                      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        {selectedLesson.title}
                      </h1>
                      <p className="text-xl">
                        Taught by <span className="font-semibold">{selectedLesson.instructor}</span>
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="ml-1 font-medium">{selectedLesson.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-5 h-5" />
                          <span className="ml-1">
                            {selectedLesson.studentsEnrolled.toLocaleString()} students
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {selectedLesson.duration}
                        </Badge>
                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white">
                          {selectedLesson.level}
                        </Badge>
                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white">
                          {selectedLesson.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-4 bg-gray-200 p-1 rounded-md shadow">
                      {["instructor", "structure", "details", "feature", "Add To cart"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSelectedTab(tab as any)}
                          aria-selected={selectedTab === tab}
                          className={`px-2 py-1 rounded-md transition-all duration-300 ${selectedTab === tab
                            ? "bg-primary-default text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                  </div>

                  <div>
                    {selectedTab === "instructor" && <CourseInstructor />}
                    {selectedTab === "structure" && <CoursePlan />}
                    {selectedTab === "details" && <CourseDetails />}
                    {selectedTab === "feature" && <CourseFeatures />}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </>
  )
}

