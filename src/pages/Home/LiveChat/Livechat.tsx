import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, X } from 'lucide-react';
import AIChatbot from './AIChatbot';
import TicketModal from '@/components/shared/TicketModal';
import HotlineModal from '@/components/shared/HotlineModal';
import FAQModal from '@/components/shared/FAQModal';
import { useAppStore } from '@/store/useAppStore';
import useModalStore from '@/store/modalStore';
import { Wrench, HelpCircle, PhoneCall } from 'lucide-react';

type Message = {
    id: number
    text: string
    sender: 'user' | 'agent'
}

interface LiveChatProps {
    showLegacy?: boolean;
}

export default function LiveChat({ showLegacy = true }: LiveChatProps) {
    const [t] = useTranslation("global");
    const [isOpen, setIsOpen] = useState(false)
    const {
        isAIChatOpen,
        setIsAIChatOpen,
        setIsTicketModalOpen,
        openLoginModal
    } = useModalStore();
    const { clearChatbotMessages } = useAppStore();

    // --- Optimized Session Cleanup Logic ---
    useEffect(() => {
        const getActiveToken = () => {
            try {
                const student = sessionStorage.getItem("student_session");
                const vendor = sessionStorage.getItem("vendor_session");
                if (student) return JSON.parse(student).token;
                if (vendor) return JSON.parse(vendor).token;
            } catch (e) {
                return null;
            }
            return null;
        };

        const currentToken = getActiveToken();
        const lastToken = sessionStorage.getItem('last_chatbot_token');

        // If we have a token and it's different from the last one seen by the chatbot
        if (currentToken && currentToken !== lastToken) {
            console.log("🔄 Session changed or re-login detected. Clearing chatbot history.");
            clearChatbotMessages();
            sessionStorage.setItem('last_chatbot_token', currentToken);
        } else if (!currentToken && lastToken) {
            // If they logged out, ensure we're ready for the next login
            sessionStorage.removeItem('last_chatbot_token');
            clearChatbotMessages();
        }
    }, [clearChatbotMessages]);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you today?", sender: 'agent' }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim() === '') return

        const newMessage: Message = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user'
        }

        setMessages([...messages, newMessage])
        setInputMessage('')

        // Simulate agent response
        setTimeout(() => {
            const agentResponse: Message = {
                id: messages.length + 2,
                text: "Thank you for your message. An agent will respond shortly.",
                sender: 'agent'
            }
            setMessages(prevMessages => [...prevMessages, agentResponse])
        }, 1000)
    }

    return (
        <>
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-lg transition-transform duration-300 ease-in-out no-print ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold">Live Chat</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-2 rounded-lg ${message.sender === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            className="flex-grow px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-500 rounded-r hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>

            {/* Support Modals */}
            <AIChatbot isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
            <TicketModal />
            <HotlineModal />
            <FAQModal />

            {/* Original Floating Bar (Legacy Chat) */}
            {showLegacy && (
                <div className="fixed top-[65%] -translate-y-1/2 right-0 z-40 bg-white rounded-l-[2rem] shadow-2xl border-2 border-primary-light no-print hover:bg-gray-50 transition-all duration-300 group flex flex-col items-center py-4 px-6">
                    {/* Upper Row: Chat Label */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="mb-4 w-full bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-md"
                    >
                        {t("chat")}
                    </button>

                    {/* Lower Row: Icons in a single row */}
                    <div className="flex items-center justify-center gap-2">
                        <Link to="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform duration-300">
                            <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6 text-green-600" />
                        </Link>

                        <div className="h-5 w-[1px] bg-gray-200" />

                        <Link to="https://t.me/YOUR_TELEGRAM_USERNAME" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform duration-300">
                            <FontAwesomeIcon icon={faTelegram} className="h-6 w-6 text-blue-500" />
                        </Link>

                        <div className="h-5 w-[1px] bg-gray-200" />

                        <button
                            onClick={() => {
                                const hasToken = sessionStorage.getItem("student_session") || sessionStorage.getItem("vendor_session");
                                if (hasToken) {
                                    setIsTicketModalOpen(true);
                                } else {
                                    toast.info("Please login to create a support ticket");
                                    openLoginModal();
                                }
                            }}
                            className="hover:scale-125 transition-transform duration-300 flex items-center justify-center"
                        >
                            <Wrench className="h-5 w-5 text-[#4d4ee2]" />
                        </button>
                    </div>
                </div>
            )}

            {/* New Bottom Floating Bar (AI Chatbot) - Refined Design */}
            <div className="fixed bottom-24 right-0 z-40 h-auto rounded-l-[40px] bg-white pl-4 pr-2 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(103,172,121,0.2)] border border-[#67AC79]/30 border-r-0 no-print group transition-all duration-300">
                <button
                    onClick={() => setIsAIChatOpen(true)}
                    className="flex flex-col items-start px-2"
                >
                    <span className="text-[9px] font-black text-[#67AC79] uppercase tracking-[0.15em] mb-1 ml-11">{t('chatbot.title')}</span>
                    <div className="flex items-center space-x-3 group-hover:translate-x-[-4px] transition-transform duration-300">
                        <div className="bg-[#67AC79] p-2.5 rounded-full text-white shadow-lg shadow-[#67AC79]/30 group-hover:scale-110 transition-transform">
                            <Bot size={22} />
                        </div>
                        <div className="text-[13px] font-black text-[#1e293b]">{t('chatbot.buttonText', 'Ask AI Chatbot')}</div>
                    </div>
                </button>
            </div>
        </>
    )
}
