import React from 'react';

const ErrorPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[#FAC12B]">Oops!</h1>
                <p className="mt-4 text-xl text-gray-700">Something went wrong.</p>
                <p className="mt-2 text-gray-600">We're sorry for the inconvenience.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-[#FAC12B] text-white px-4 py-2 rounded hover:bg-yellow-500 transition duration-300"
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
