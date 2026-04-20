import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PhoneIcon, MailIcon, Fingerprint } from 'lucide-react';

interface LoginOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPhoneLogin: () => void;
    onEmailLogin: () => void;
}

const LoginOptionsModal: React.FC<LoginOptionsModalProps> = ({ isOpen, onClose, onPhoneLogin, onEmailLogin }) => {
    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            Choose Login Method
                                        </Dialog.Title>
                                        <div className="mt-5">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center items-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default mb-3"
                                                onClick={onPhoneLogin}
                                            >
                                                <PhoneIcon className="mr-2 h-5 w-5" />
                                                Login with Phone
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center items-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default"
                                                onClick={onEmailLogin}
                                            >
                                                <Fingerprint className="mr-2 h-5 w-5" />
                                                Login with User & Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default LoginOptionsModal;

