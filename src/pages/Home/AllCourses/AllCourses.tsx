'use client'

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, X, Play, ShoppingCart, Loader2 } from 'lucide-react'
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
} from "@/components/ui/dialog"
import Coursecatagory2 from "../Coursecatagory2/Coursecatagory2"
import useModalStore from '@/store/modalStore'
import { useTranslation } from "react-i18next"
import { useStudentCoursesQuery, StudentCourse } from '@/hooks/useStudentCourses'
import CourseGrid from "./CourseGrid"
import StudentCourseDetails from "../StudentCourseDetails/StudentCourseDetails"

import { useCartStore } from "@/store/cartStore"

const baseImageURL = 'https://admin.goldenlifeltd.com/uploads/course/course_image/';

export default function AllCourses() {
  const navigate = useNavigate();
  const { addItem, toggleCart } = useCartStore();
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { t } = useTranslation("global");
  const scrollLeftRef = React.useRef(0);

  const { data: apiCourses = [], isLoading } = useStudentCoursesQuery();

  const handleCourseSelect = (lesson: any) => {
    setSelectedCourseId(lesson.id);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourseId(null);
  }

  const addToCart = (lesson: any) => {
    addItem({
        id: Number(lesson.id),
        name: lesson.course_title_english,
        product_title_english: lesson.course_title_english,
        image: lesson.image?.startsWith('http') ? lesson.image : `${baseImageURL}${lesson.image}`,
        quantity: 1,
        offer_price: Number(lesson.regular_fee) || 0, // Member Price
        regular_price: Number(lesson.offer_fee) || 0, // Customer Price
        type: 'course'
    });
  };

  return (
    <>
      <Coursecatagory2 />
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-0">
        <div className="space-y-2">
          {isLoading ? (
            <div className="py-20 flex justify-center">
               <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
          ) : (
            <>
              <CourseGrid
                courses={apiCourses as any}
                title="Courses"
                onSelect={handleCourseSelect}
                onAddToCart={addToCart}
              />
            </>
          )}
        </div>

        {isModalOpen && selectedCourseId && (
          <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className="max-w-6xl p-0 overflow-hidden border-none bg-transparent shadow-none">
              <div className="bg-white rounded-3xl overflow-y-auto max-h-[90vh]">
                <StudentCourseDetails courseId={selectedCourseId} onClose={closeModal} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  )
}

