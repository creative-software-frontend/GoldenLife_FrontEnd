'use client'

import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Phone, Youtube, Linkedin } from 'lucide-react';
import paywith from '../../../../public/image/footer/Pay-With.png';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t, i18n } = useTranslation("global");
    
    const [value, setValue] = useState<string | undefined>();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 pt-12 mt-8 w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200">
            
            {/* --- TOP SECTION (4 Columns) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 mx-0 md:mx-12">
                {/* 1. About Section */}
                <div>
                    <h3 className="font-bold text-base mb-4 text-gray-800 uppercase tracking-wider">
                        {t('footer.aboutGoldenLife')}
                    </h3>
                    <ul className="space-y-2.5">
                        <li><Link to="/dashboard/help/our-story" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm md:text-base font-medium">{t('footer.ourStory')}</Link></li>
                        <li><Link to="#" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm md:text-base font-medium">{t('footer.team')}</Link></li>
                        <li><Link to="/dashboard/help/privacy-policy" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm md:text-base font-medium">{t('footer.privacyPolicy')}</Link></li>
                        <li><Link to="/dashboard/help/terms" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm md:text-base font-medium">{t('footer.termsOfUse')}</Link></li>
                    </ul>
                </div>

                {/* 2. Customer Service */}
                <div>
                    <h3 className="font-bold text-base mb-4 text-gray-800 uppercase tracking-wider">
                        {t('footer.customerService')}
                    </h3>
                    <ul className="space-y-2.5">
                        <li><Link to="/dashboard/help/contact" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm md:text-base font-medium">{t('footer.contactUs')}</Link></li>
                        <li><Link to="/dashboard/help" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm md:text-base font-medium">{t('footer.faq')}</Link></li>
                        <li><Link to="/dashboard/help" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm md:text-base font-medium">{t('footer.help')}</Link></li>
                    </ul>
                </div>

                {/* 3. For Business */}
                <div>
                    <h3 className="font-bold text-base mb-4 text-gray-800 uppercase tracking-wider">
                        {t('footer.forBusiness')}
                    </h3>
                    <ul className="space-y-2.5">
                        <li><Link to="#" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm md:text-base font-medium">{t('footer.corporate')}</Link></li>
                    </ul>
                </div>

                {/* 4. App & Support */}
                <div className="space-y-5">
                    <h3 className="font-bold text-base mb-2 text-gray-800 uppercase tracking-wider">
                        {t('footer.getApp')}
                    </h3>
                    <div className="space-y-3">
                        <div className="relative border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-emerald-500 transition-colors">
                            <PhoneInput
                                placeholder={t('footer.phoneNumber')}
                                value={value}
                                onChange={setValue}
                                defaultCountry="BD"
                                international
                                className="footer-phone-input px-3 py-2.5 text-sm md:text-base outline-none"
                            />
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-700 w-full text-white px-4 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all shadow-md active:scale-95">
                            {t('footer.getApp')}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE SECTION (Payment Left, Contact Right) --- */}
            <div className="py-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 mx-0 md:mx-12 gap-8">
                
                {/* Payment Methods - Left Side */}
                <div className="md:col-span-3">
                    <h3 className="font-bold text-base mb-4 text-gray-800 uppercase tracking-wider">
                        {t('footer.paymentMethods')}
                    </h3>
                    <img
                        src={paywith}
                        alt="Payment Methods"
                        className="h-10 md:h-14 w-auto object-contain object-left grayscale hover:grayscale-0 transition-all opacity-100 drop-shadow-sm"
                    />
                </div>

                {/* Support Contact - Right Side */}
                <div className="md:col-span-1 flex flex-col justify-center border-t md:border-t-0 pt-6 md:pt-0 border-gray-200">
                    <div className="flex items-center text-gray-800 mb-1.5">
                        <Phone className="h-5 w-5 mr-2 text-emerald-600 shrink-0" />
                        <p className="text-xl md:text-2xl font-black tracking-tighter">09649 866 966</p>
                    </div>
                    <p className="text-gray-500 text-sm font-medium italic opacity-80">
                        or support@goldenlife.com
                    </p>
                </div>
            </div>

            {/* --- BOTTOM BAR --- */}
            <div className="border-t mx-0 md:mx-12 border-gray-200 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm font-medium order-2 md:order-1">
                        {t('copyright', { year: currentYear })}
                    </p>

                    <div className="flex items-center gap-4 order-1 md:order-2">
                        {[Linkedin, Youtube, Facebook, Twitter, Instagram].map((Icon, idx) => (
                            <Link
                                key={idx}
                                to="#"
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm hover:-translate-y-1"
                            >
                                <Icon size={18} />
                            </Link>
                        ))}
                        <div className="h-8 w-px bg-gray-300 mx-1 hidden sm:block" />
                        <button
                            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en')}
                            className="bg-gray-800 text-white text-xs font-black px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors uppercase tracking-widest shadow-sm"
                        >
                            {i18n.language === 'en' ? 'BN' : 'EN'}
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;