import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useAuthActions } from '../../hooks/useAuthActions';

const Verify = () => {

    const { token } = useParams<{ token: string }>();


    const [dots, setDots] = useState('');

    const { verifyEmail, loading, error, success } = useAuthActions();

    useEffect(() => {
        let dotCount = 0;
        const interval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            setDots('.'.repeat(dotCount));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const hasCalled = useRef(false);

    useEffect(() => {
        if (!token) return;

        if (!hasCalled.current) {
            hasCalled.current = true;
            verifyEmail(token);
        }
    }, [token]);



    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md w-full">
                {/* Logo */}
                <h1 className="text-4xl font-bold mb-12">
                    <span className="text-gray-800">DINACOM</span>{' '}
                    <span className="text-orange-500">2026</span>
                </h1>

                {loading && (
                    <>
                        {/* Loading Icon */}
                        <div className="flex justify-center items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                <div className="w-1 h-24 bg-gray-400 transform rotate-12"></div>
                            </div>
                        </div>

                        {/* Loading Text */}
                        <p className="text-xl text-gray-800 font-medium">
                            Verifying{dots}
                        </p>
                    </>
                )}

                {success && !error && (
                    <>
                        {/* Success Icon */}
                        <div className="flex justify-center items-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Success Text */}
                        <p className="text-xl text-gray-800 font-medium mb-6">
                            Email Verified
                        </p>
                        <Link to={'/login'} className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors">
                            Continue
                        </Link>
                    </>
                )}

                {error && !success && (
                    <>
                        {/* Error Icon */}
                        <div className="flex justify-center items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                <div className="w-1 h-24 bg-gray-400 transform rotate-12"></div>
                            </div>
                        </div>

                        {/* Error Text */}
                        <p className="text-xl text-gray-800 font-medium">
                            {error}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Verify