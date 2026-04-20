import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CourseFeature() {
    const { t } = useTranslation("global");
    const features2 = [
        t('features2.text1'),
        t('features2.text2'),
        t('features2.text3'),
        t('features2.text4'),
        t('features2.text5'),
        t('features2.text6'),
    ];

    return (
        <div className="p-6 h-[450px]">
            <h2 className="text-xl font-bold mb-4">{t('features2.title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {features2.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <div className="mt-1">
                            <Check className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-sm">{feature}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
