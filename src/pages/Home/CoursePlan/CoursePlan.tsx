import React, { useState } from 'react';
import { PlayCircle, Users, Clock } from 'lucide-react'; // Ensure these icons are from 'lucide-react'
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import CourseOutline from '../CourseOutline/CourseOutline';

const CourseStructure: React.FC = () => {
    const { t } = useTranslation("global"); // Initialize translation hook
    const [showCourseOutline, setShowCourseOutline] = useState(false); // To control CourseOutline visibility

    const openCourseOutline = () => {
        setShowCourseOutline(true); // Show CourseOutline when the button is clicked
    };

    return (
        <div className="container mx-auto h-auto">
            <div className="p-2 rounded">
                <h2 className="text-lg font-bold mt-2">{t('courseStructure.title')}</h2>
                <div className="grid grid-cols-2 gap-4 mt-4 mx-auto">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-500 rounded-full">
                            <PlayCircle className="text-white w-6 h-6" />
                        </div>
                        <p className="ml-4">{t('features.text1')}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-500 rounded-full">
                            <Users className="text-white w-6 h-6" />
                        </div>
                        <p className="ml-4">{t('features.text2')}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 bg-green-500 rounded-full">
                            <Clock className="text-white w-6 h-6" />
                        </div>
                        <p className="ml-4">{t('features.text3')}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-500 rounded-full">
                            <Users className="text-white w-6 h-6" />
                        </div>
                        <p className="ml-4">{t('features.text4')}</p>
                    </div>
                </div>

                {/* You can add a button to open course outline if needed */}
                {/* <button onClick={openCourseOutline} className="mt-4 px-6 py-2 bg-primary-default text-white rounded-lg">
                    {t('courseStructure.openOutlineButton')}
                </button> */}

                {/* Conditionally render CourseOutline if showCourseOutline is true */}
                {/* {showCourseOutline && <CourseOutline />} */}
            </div>
        </div>
    );
};

export default CourseStructure;
