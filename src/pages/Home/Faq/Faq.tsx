import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
// import Footer from '@/pages/common/Footer/Footer';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: "What's the capital of Switzerland?",
    answer:
      "The capital of Switzerland is Bern. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: "What languages are spoken in Switzerland?",
    answer:
      "Switzerland has four official languages: German, French, Italian, and Romansh.",
  },
  {
    question: "What is the currency of Switzerland?",
    answer:
      "The currency of Switzerland is the Swiss Franc (CHF).",
  },
  {
    question: "What is Swiss cheese?",
    answer:
      "Swiss cheese is a generic term for several cheese varieties that are produced in Switzerland.",
  },
  {
    question: "What is the Swiss Alps?",
    answer:
      "The Swiss Alps are a mountain range located in Switzerland known for their stunning beauty and skiing opportunities.",
  },
];



function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Faq: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');



  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>





      {/* FAQ Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-1 sm:py-32 sm:px-8 ">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-4xl font-bold leading-10 tracking-tight text-gray-900">Frequently Asked Questions</h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {filteredFaqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="text-base font-semibold leading-7">{faq.question}</span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                              <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Faq;
