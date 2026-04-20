'use client';

import React, { useState } from "react";
import { Wallet, CreditCard, Banknote } from 'lucide-react';

const WalletAmount: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>("E-Wallet");

    const options = [
        { name: "Boucher", amount: 103040, icon: Wallet },
        { name: "Earning", amount: 203454, icon: CreditCard },
        { name: "Recharge", amount: 502356, icon: Banknote },
    ];

    const handleButtonClick = (name: string) => {
        setSelectedOption(name);
    };

    return (
        <div className="flex flex-col items-center p-2">
            <div className="flex flex-wrap gap-4 justify-center max-w-screen-lg">
                {options.map(({ name, amount, icon: Icon }) => (
                    <button
                        key={name}
                        onClick={() => handleButtonClick(name)}
                        className={`flex flex-col items-center justify-center w-full sm:w-48 md:w-52 h-24 rounded-lg border-2 transition-all duration-300 ${selectedOption === name
                                ? "bg-primary text-white border-primary shadow-md scale-95"
                                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                            }`}
                    >
                        <span className="text-lg sm:text-xl">{name}</span>
                        <span className="text-xl sm:text-2xl font-bold">
                            ${amount.toFixed(0)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WalletAmount;
