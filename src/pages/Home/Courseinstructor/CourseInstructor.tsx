import React from 'react';
import { useTranslation } from 'react-i18next';

// Instructor Component
const CourseInstructor: React.FC = () => {
    const { t } = useTranslation('global');

    return (
        <div className="p-6 border rounded-lg h-auto">
            <div className="flex items-start gap-4">
                <img
                    src="../../../../public/image/courses/instructor.jpeg"
                    alt={t('instructor.profile.imageAlt')}
                    width={64}
                    height={64}
                    className="rounded-full"
                />
                <div className="space-y-1">
                    <h2 className="font-semibold text-lg">{t('instructor.profile.name')}</h2>
                    <div className="space-y-0.5 text-sm text-muted-foreground">
                        {t('instructor.profile.qualifications', { returnObjects: true }).map(
                            (qualification: string, index: number) => (
                                <p key={index}>{qualification}</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInstructor;
