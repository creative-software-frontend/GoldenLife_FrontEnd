import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, X } from "lucide-react";
import CourseInstructor from "../Courseinstructor/CourseInstructor";
import CoursePlan from "../CoursePlan/CoursePlan";
import CourseDetails from "../CourseDetails/CourseDetails";
import CourseFeatures from "../CourseFeature/CourseFeature";

interface CourseBannerProps {
    title?: string;
    instructor?: string;
    rating?: number;
    studentsEnrolled?: number;
    duration?: string;
    level?: string;
    category?: string;
    backgroundImage?: string;
}

const CourseBanner: React.FC<CourseBannerProps> = ({
    title = "Advanced Machine Learning and AI",
    instructor = "Dr. Jane Smith",
    rating = 4.8,
    studentsEnrolled = 15000,
    duration = "10 weeks",
    level = "Advanced",
    category = "Computer Science",
    backgroundImage = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"instructor" | "structure" | "details" | "feature">("instructor");

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <div className="container mx-auto my-8">
            {/* Trigger Button */}
            <Button onClick={openModal} className="bg-blue-600 text-white mb-4">
                Open Course View
            </Button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
                    <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 bg-gray-200 rounded-full p-2"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Banner Content */}
                        <div
                            className="relative mt-20 w-full h-[260px] bg-cover bg-center text-white"
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                        >
                            <div className="absolute inset-0 bg-black opacity-60"></div>
                            <div className="relative z-10 h-full max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col justify-center">
                                <div className="space-y-6 text-start">
                                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                        {title}
                                    </h1>
                                    <p className="text-xl">
                                        Taught by <span className="font-semibold">{instructor}</span>
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <Star className="w-5 h-5 text-yellow-400" />
                                            <span className="ml-1 font-medium">{rating}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-5 h-5" />
                                            <span className="ml-1">
                                                {studentsEnrolled.toLocaleString()} students
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {duration}
                                        </Badge>
                                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white">
                                            {level}
                                        </Badge>
                                        <Badge className="text-sm py-1 px-2 bg-white/20 text-white">
                                            {category}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="p-2">
                            <div className="flex justify-center mb-4">
                                <div className="flex space-x-4 bg-gray-200 p-1 rounded-md shadow">
                                    {["instructor", "structure", "details", "feature"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setSelectedTab(tab as any)}
                                            aria-selected={selectedTab === tab}
                                            className={`px-2 py-1 rounded-md transition-all duration-300 ${selectedTab === tab ? "bg-primary-default text-white" : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div>
                                {selectedTab === "instructor" && <CourseInstructor />}
                                {selectedTab === "structure" && <CoursePlan />}
                                {selectedTab === "details" && <CourseDetails />}
                                {selectedTab === "feature" && <CourseFeatures />}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseBanner;
