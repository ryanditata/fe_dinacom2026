import { useEffect } from 'react';
import { Link } from 'react-router-dom'

const SuccessRegisterSeminar = () => {

    useEffect(() => {
        document.title = 'Registration Successful - DINACOM 2026';
        const isRegistered = localStorage.getItem('seminarRegistered');
        if (!isRegistered) {
            window.location.href = '/';
        }
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md w-full">
                {/* Logo */}
                <h1 className="text-4xl font-bold mb-12">
                    <span className="text-gray-800">DINACOM</span>{' '}
                    <span className="text-orange-500">2026</span>
                </h1>

                <div className="flex justify-center items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>

                {/* Success Text */}
                <p className="text-xl text-gray-800 font-medium mb-6">
                    Registration Successful
                </p>
                <p className="text-gray-600 mb-8">
                    Thank you for registering for the seminar. We look forward to your participation!
                </p>
                {/* Join Whatsapp Group */}
                <div className="mb-3"> 
                    <a
                        href="https://chat.whatsapp.com/GjIn7nfPPLMBDIqfbtjPPv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors w-full block"
                    >
                        Join WhatsApp Group
                    </a>
                </div>

                {/* Back to Home Button */}
                <Link to={'/'} className="mt-4 inline-block text-orange-500 hover:underline">
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default SuccessRegisterSeminar