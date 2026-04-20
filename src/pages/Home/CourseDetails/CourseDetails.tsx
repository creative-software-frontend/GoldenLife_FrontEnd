import { useTranslation } from 'react-i18next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourseDetails() {
    const { t } = useTranslation("global");

    const faqItems = [
        {
            question: t("faqItems.question1"),
            answer: t("faqItems.answer1")
        },
        {
            question: t("faqItems.question2"),
            answer: t("faqItems.answer2")
        },
        {
            question: t("faqItems.question3"),
            answer: t("faqItems.answer3")
        },
        {
            question: t("faqItems.question4"),
            answer: t("faqItems.answer4")
        },
        {
            question: t("faqItems.question5"),
            answer: t("faqItems.answer5")
        },
        {
            question: t("faqItems.question6"),
            answer: t("faqItems.answer6")
        }
    ];

    return (
        <div className="p-6 border rounded-lg h-[450px]">
            <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
