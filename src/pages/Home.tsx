import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Code, Cpu } from 'lucide-react';
import { Helmet } from "react-helmet";


const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Dinacom</title>
        <meta
          name="description"
          content="Dinus Application Competition (DINACOM) adalah kompetisi teknologi informasi nasional yang diselenggarakan oleh Dian Nuswantoro Computer Club."
        />
        <meta
          name="keywords"
          content="Dinacom, Dinus Application Competition, kompetisi teknologi informasi, lomba IT, universitas dian nuswantoro, dcc udinus"
        />
        <meta name="author" content="Dian Nuswantoro Computer Club (DNCC)" />
      </Helmet>
      <div className="h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Code className="w-12 h-12 text-orange-400 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed">
          <Cpu className="w-16 h-16 text-orange-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float">
          <Sparkles className="w-10 h-10 text-orange-400 opacity-20" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Logo/Title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-2">
                DINACOM
                <span className="block text-6xl md:text-8xl text-orange-500 mt-2">2026</span>
              </h1>
            </div>

            {/* Subtitle with animation */}
            <div className="mb-12 space-y-4">
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-6">
                <Calendar className="w-6 h-6 animate-pulse" />
                <p className="text-xl md:text-2xl font-semibold">
                  Coming Soon{dots}
                </p>
              </div>
            </div>
          </div>

          {/* Subtitle for development environment */}
          <div className="absolute bottom-4 text-sm text-gray-500">
            You are in development mode.
          </div>
        </div>

        {/* Custom Animations */}
        <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
      </div>
    </>
  );
}

export default Home