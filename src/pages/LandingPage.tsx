import React, { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, Plus, Minus } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import HeroImage from "../assets/hero.svg";
import RobotImage from "../assets/Icon-robot.svg";
import DinacomImage from "../assets/logo-navbar.svg";
import AboutImage from "../assets/kotak-about.svg";
import ContactsImage from "../assets/logo-contacts.svg";
import IconTiktok from "../assets/icon-tiktok.svg";
import IconIg from "../assets/icon-ig.svg";
import IconLinkedin from "../assets/icon-linkedin.svg";
import IconGithub from "../assets/icon-github.svg";
import IconWa from "../assets/icon-wa.svg";
import type { MedpartAndSponsor } from "../types/sponsor";
import { useUserProfile } from "../hooks/useUserProfile";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

const LandingPage: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [guidebook, setGuidebook] = useState<string>("");
  const [sponsor, setSponsor] = useState<string[]>([]);
  const [mediapart, setMediapart] = useState<string[]>([]);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;

  const { data, loading } = useUserProfile();

  const { scrollYProgress } = useScroll();

  const xParallax = useTransform(scrollYProgress, [0, 1], [25, -200]);
  const xParallax2 = useTransform(scrollYProgress, [0, 1], [80, -200]);

  const { ref: ref01, inView: inView01 } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { ref: ref02, inView: inView02 } = useInView({ triggerOnce: true, threshold: 0.75 });
  const { ref: ref03, inView: inView03 } = useInView({ triggerOnce: true, threshold: 0.75 });
  const { ref: ref04, inView: inView04 } = useInView({ triggerOnce: true, threshold: 0.75 });
  const { ref: ref05, inView: inView05 } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { ref: ref06, inView: inView06 } = useInView({ triggerOnce: true, threshold: 0.75 });
  const { ref: ref07, inView: inView07 } = useInView({ triggerOnce: true, threshold: 0.75 });
  const { ref: ref08, inView: inView08 } = useInView({ triggerOnce: true, threshold: 0.75 });

  const targetAmount = 10000000;
  const duration = 2000;

  useEffect(() => {
    if (!inView03) return;
    let start = 0;
    const increment = targetAmount / (duration / 16);
    const animate = () => {
      start += increment;
      if (start < targetAmount) {
        setAmount(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setAmount(targetAmount);
      }
    };
    animate();
  }, [inView03]);

  const fetchGuidebook = async () => {
    if (!API_URL) return;
    try {
      const response = await fetch(`${API_URL}/public/competition-info`);
      if (!response.ok) return;
      const result = await response.json();
      if (result?.meta?.success && result.data?.url_guidebook) {
        setGuidebook(result.data.url_guidebook);
      }
    } catch (err: any) {
      console.error("Error fetching Guidebook:", err);
    }
  };

  const fetchFAQs = async () => {
    if (!API_URL) return;
    try {
      const response = await fetch(`${API_URL}/public/faqs`);
      if (!response.ok) {
        setFaqs([]);
        return;
      }
      const result = await response.json();

      if (result?.meta?.success && Array.isArray(result.data)) {
        setFaqs(result.data);
      } else {
        setFaqs([]);
      }
    } catch (err: any) {
      console.error("Error fetching FAQs:", err);
      setFaqs([]);
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    fetchFAQs();
    fetchGuidebook();

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/public/sponsors`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!json || !json.data || !Array.isArray(json.data)) {
          setSponsor([]);
          return;
        }

        const urls = json.data.map((item: MedpartAndSponsor) =>
          `${ADMIN_URL}/${item.photo}`
        );

        setSponsor(urls);
      })
      .catch((err) => {
        console.error("Error fetching sponsors:", err);
        setSponsor([]);
      });
  }, [API_URL, ADMIN_URL]);

  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/public/media-partners`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!json || !json.data || !Array.isArray(json.data)) {
          setMediapart([]);
          return;
        }

        const urls = json.data.map((item: MedpartAndSponsor) =>
          `${ADMIN_URL}/${item.photo}`
        );

        setMediapart(urls);
      })
      .catch((err) => {
        console.error("Error fetching media-partners:", err);
        setMediapart([]);
      });
  }, [API_URL, ADMIN_URL]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatRupiah = (number: number) => {
    return "Rp " + number.toLocaleString("id-ID");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchFAQs}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <>
        {/* Navbar */}
        <header
          className="w-full top-0 fixed z-40 flex items-center justify-center px-6 py-3 md:px-12 lg:px-30 lg:py-8 bg-[#E6E6E6] shadow-md h-fit"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)" }}
        >
          <div className="w-full max-w-7xl flex items-center justify-between">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                scrollToSection("hero");
              }}
              className="cursor-pointer"
            >
              <img
                src={DinacomImage}
                alt="DINACOM 2026"
                className="h-4 md:h-5 lg:h-7"
              />
            </button>

            {/* Mobile */}
            <div className="flex md:hidden flex-row gap-4">
              {
                data && data.id ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-[100px] h-10 bg-[#FF4800] text-white rounded-full text-sm font-semibold hover:bg-[#E03F00] transition duration-300 ease-in-out"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-[100px] h-10 bg-[#FF4800] text-white rounded-full text-sm font-semibold hover:bg-[#E03F00] transition duration-300 ease-in-out"
                  >
                    Register
                  </Link>
                )
              }
              <button
                className="md:hidden text-black"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center md:gap-6 lg:gap-10 text-black font-inter">
              <a
                onClick={() => scrollToSection("about")}
                className="cursor-pointer hover:text-[#FF4800] transition-colors"
              >
                About
              </a>
              <a
                onClick={() => scrollToSection("competition")}
                className="cursor-pointer hover:text-[#FF4800] transition-colors"
              >
                Competition
              </a>
              <a
                onClick={() => scrollToSection("timeline")}
                className="cursor-pointer hover:text-[#FF4800] transition-colors"
              >
                Timeline
              </a>
              <a
                onClick={() => scrollToSection("faq")}
                className="cursor-pointer hover:text-[#FF4800] transition-colors"
              >
                FAQ
              </a>
              <a
                onClick={() => scrollToSection("contacts")}
                className="cursor-pointer hover:text-[#FF4800] transition-colors"
              >
                Contacts
              </a>
            </nav>
            {
              data && data.id ? (
                <Link
                  to="/dashboard"
                  className="hidden md:flex items-center justify-center px-6 h-[45px] bg-[#FF4800] text-white rounded-full hover:bg-[#E03F00] transition duration-300 ease-in-out"
                >
                  <p className={`font-inter font-semibold`}>Dashboard</p>
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="hidden md:flex items-center justify-center px-6 h-[45px] bg-[#FF4800] text-white rounded-full hover:bg-[#E03F00] transition duration-300 ease-in-out"
                >
                  <p className={`font-inter font-semibold`}>Register</p>
                </Link>
              )
            }
          </div>
        </header>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="fixed top-0 left-0 w-full h-screen font-inter bg-[#E6E6E6] flex flex-col items-center justify-center text-black gap-8 z-50">
            <button
              className="absolute top-4 right-5 text-black"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
            <a
              onClick={() => {
                setIsOpen(false);
                scrollToSection("about");
              }}
              className="cursor-pointer text-xl hover:text-[#FF4800] transition-colors"
            >
              About
            </a>
            <a
              onClick={() => {
                setIsOpen(false);
                scrollToSection("competition");
              }}
              className="cursor-pointer text-xl hover:text-[#FF4800] transition-colors"
            >
              Competition
            </a>
            <a
              onClick={() => {
                setIsOpen(false);
                scrollToSection("timeline");
              }}
              className="cursor-pointer text-xl hover:text-[#FF4800] transition-colors"
            >
              Timeline
            </a>
            <a
              onClick={() => {
                setIsOpen(false);
                scrollToSection("faq");
              }}
              className="cursor-pointer text-xl hover:text-[#FF4800] transition-colors"
            >
              FAQ
            </a>
            <a
              onClick={() => {
                setIsOpen(false);
                scrollToSection("contacts");
              }}
              className="cursor-pointer text-xl hover:text-[#FF4800] transition-colors"
            >
              Contacts
            </a>
          </div>
        )}
      </>

      {/* Hero */}
      <div className="w-full h-full flex flex-col bg-[#F9F9F9]">
        <section id="hero" className="py-16 md:py-20">
          <div className="w-full px-5 md:px-11 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="text-left mt-10 md:mt-10">
                <p className="text-[#FF4800] font-semibold text-xs md:text-sm lg:text-xl">
                  AI For Social Impact: Transforming <br />
                  Communities Through Smart Technology
                </p>

                <motion.h1
                  ref={ref01}
                  initial={{ x: -100, opacity: 0 }}
                  animate={inView01 ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 1.2 }}
                  className="font-audiowide text-6xl md:text-7xl lg:text-8xl font-semibold text-[#333333] md:mt-1 lg:mt-3"
                >
                  DINACOM
                </motion.h1>

                <p className="font-inter text-xs md:text-sm lg:text-sm text-[#646464] mt-1 md:mt-2 lg:mt-6 max-w-lg leading-tight">
                  Envisioning a future where technology drives effective
                  government management. Dinacom aims to foster innovative app
                  solutions for
                  <br />
                  societal issues.
                </p>

                <div className="mt-6 md:mt-8 lg:mt-10">
                  <div className="flex gap-2">
                    <a
                      href={guidebook ? guidebook : "#"}
                      target="_blank"
                      className="cursor-pointer inline-flex items-center gap-4 md:gap-7 lg:gap-10 border-2 border-[#FF4800] text-[#FF4800] font-inter text-xs md:text-base lg:text-base md:font-semibold py-2 px-4 md:py-3 md:px-6 lg:py-3 lg:px-6 rounded-full hover:bg-[#FF4800] hover:text-white transition-colors duration-300"
                    >
                      Guidebook
                    </a>
                    <a
                      href="/seminar/choose-category"
                      className="cursor-pointer inline-flex items-center gap-4 md:gap-7 lg:gap-10 border-2 bg-[#FF4800] text-white font-inter text-xs md:text-base lg:text-base md:font-semibold py-2 px-4 md:py-3 md:px-6 lg:py-3 lg:px-6 rounded-full hover:bg-[#FF4800] hover:text-white transition-colors duration-300"
                    >
                      Join Our Seminar
                      <motion.div
                        className="inline-block"
                        animate={{
                          transform: ["translateX(0)", "translateX(10px)", "translateX(0)"],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center md:justify-end -mt-16 md:mt-0">
                <img
                  src={HeroImage}
                  alt="HERO DINACOM 2026"
                  className="w-full h-auto md:max-w-lg z-0"
                />
                <motion.img
                  src={RobotImage}
                  alt="HERO DINACOM 2026"
                  style={{ x: xParallax }}
                  className="md:w-[338px] lg:w-[568px] h-auto md:max-w-lg absolute z-10 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="w-full lg:py-20">
          <div className="w-full px-5 md:px-11 lg:px-16">
            <div className="grid grid-cols-1 items-center">
              <div className="relative">
                <h1 className="font-audiowide font-semibold text-center md:text-start text-2xl md:text-3xl lg:text-5xl text-[#333333] mb-3 md:mb-6 lg:mb-12">
                  About DINACOM
                </h1>

                <motion.h1
                  ref={ref02}
                  initial={{ x: -50, opacity: 0 }}
                  animate={inView02 ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="font-audiowide text-center md:text-start text-black/10 text-5xl md:text-[80px] lg:text-[100px] font-medium -ml-1 mb-8 md:mb-10 lg:mb-16">
                  02
                </motion.h1>

                <p className="font-inter md:ml-16 lg:ml-50 text-[#646464] text-center md:text-start text-sm md:text-base lg:text-xl leading-tight">
                  Dinus Application Competition (DINACOM) is an <br />
                  national information technology competition <br />
                  organized by Dian Nuswantoro Computer Club <br />
                  (DNCC).
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-end mt-10 md:-mt-68 lg:-mt-96">
                <img
                  src={AboutImage}
                  alt="ABOUT DINACOM 2026"
                  className="w-full md:max-w-sm lg:max-w-xl h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Prizepool */}
        <section
          id="prizepool"
          className="w-full px-5 md:px-11 lg:px-16 pt-20 md:pt-20 lg:pt-20"
        >
          <div className="w-full relative rounded-2xl p-8 md:p-12 lg:p-30 bg-[linear-gradient(to_bottom,#282626,#181818)] bg-no-repeat bg-cover text-center text-white shadow-lg overflow-hidden">
            <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
              <img className="w-full h-full" src="/bg-prizepool.png" alt="" />
            </div>

            <div className="absolute w-full h-full md:top-10 md:left-60 lg:top-26 lg:left-100 overflow-hidden">
              <motion.img
                style={{ x: xParallax2 }}
                className="w-full h-full md:opacity-100 opacity-40"
                src="/piala.svg"
                alt=""
              />
            </div>

            <div className="flex relative justify-center md:justify-start gap-4 w-full lg:-mt-16">
              <div className="flex p-2 md:p-4 rounded-full bg-[#FF4800] border-2 border-white">
                <img className="lg:w-full w-5" src="/piala-vector.svg" alt="" />
              </div>
              <div className="flex items-center px-2 md:px-5 lg:px-10 lg:py-2.5 justify-center rounded-full bg-[#FF4800] border-2 border-white">
                <p className="text-lg md:text-xl lg:text-4xl font-medium">
                  Total Prizepool
                </p>
              </div>
            </div>

            <div className="relative flex flex-col md:items-start mt-5 md:mt-10 lg:mt-14 gap-[18px]">
              <motion.h2
                ref={ref03}
                className="text-4xl font-inter md:text-6xl lg:text-8xl text-white font-black">
                {formatRupiah(amount)}
              </motion.h2>
              <p className="md:text-xl font-inter lg:text-2xl text-white font-medium">
                + SERTIFIKAT & BEASISWA UDINUS
              </p>
            </div>

          </div>
        </section>

        {/* Competition */}
        <section
          id="competition"
          className="w-full flex flex-col gap-4 lg:gap-[134px] pt-15 px-5 md:pt-20 md:px-10 lg:px-16 lg:pt-41"
        >
          <div className="flex md:flex-row flex-col-reverse text-center gap-4 md:gap-0 md:text-left justify-between items-center">
            <div className=" flex md:flex-row gap-4 flex-col">
              <h1 className="font-audiowide font-semibold text-2xl md:text-3xl lg:text-5xl text-[#333333]">
                <span className="hidden md:block">
                  Let's liven up our <br />
                  event by <br />
                  participating.
                </span>
                <span className="block md:hidden">
                  Let's liven up our event by participating.
                </span>
              </h1>
              <p className="text-[#646464] font-inter flex md:hidden">
                This decade, with technological developments, we are trying to solve several problems. With AI becoming a partner to humans.
              </p>
            </div>
            <p className="text-[#646464] hidden font-inter md:flex lg:text-lg md:text-sm lg:leading-8 md:leading-6 max-w-lg">
              This decade, with technological developments, <br />
              we are trying to solve several problems. With AI <br />
              becoming a partner to humans.
            </p>

            <motion.h1
              ref={ref04}
              initial={{ x: 50, opacity: 0 }}
              animate={inView04 ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-audiowide text-black/10 text-5xl md:text-[80px] lg:text-[100px] font-medium">
              03
            </motion.h1>

          </div>
          <div className="flex items-center justify-center bg-gray-50 p-4">
            <div className="grid grid-cols-2 w-full gap-6 px-0 my-6 md:px-16 md:gap-10 lg:gap-18 max-w-4xl">
              <motion.div
                ref={ref05}
                initial={{ x: -100, opacity: 0 }}
                animate={inView05 ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative aspect-3/4 w-full">
                <button
                  className="
                  absolute inset-0
                  bg-[#FF4800]
                  [clip-path:polygon(10%_0,100%_0,100%_90%,90%_100%,0_100%,0_10%)]
                "
                ></button>
                <div
                  className="
                  absolute inset-0.5 cursor-pointer          
                  bg-white
                  flex flex-col items-center justify-between
                  p-6 md:p-10 lg:p-12
                  [clip-path:polygon(10%_0,100%_0,100%_90%,90%_100%,0_100%,0_10%)]
                "
                >
                  <div className="flex flex-1 items-center justify-center">
                    <img
                      src="/competition.svg"
                      className="object-contain w-24 h-24 md:w-full md:h-full"
                      alt="Competition"
                      draggable="false"
                    />
                  </div>
                  <p className="text-[#FF4800] text-lg md:text-3xl lg:text-[40px] font-inter leading-none">
                    COMPETITION
                  </p>
                </div>
              </motion.div>
              <motion.div
                ref={ref05}
                initial={{ x: 100, opacity: 0 }}
                animate={inView05 ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative aspect-3/4 w-full">
                <div
                  className="
                  absolute inset-0 
                  bg-[#FF4800]
                  [clip-path:polygon(10%_0,100%_0,100%_90%,90%_100%,0_100%,0_10%)]
                "
                ></div>
                <button
                  onClick={() => {
                    navigate('/seminar/choose-category');
                  }}
                  className="
                  absolute inset-0.5 cursor-pointer          
                  bg-white
                  flex flex-col items-center justify-between
                  p-6 md:p-10 lg:p-12
                  [clip-path:polygon(10%_0,100%_0,100%_90%,90%_100%,0_100%,0_10%)]
                "
                >
                  <div className="flex flex-1 items-center justify-center">
                    <img
                      src="/seminar.svg"
                      className="object-contain w-24 h-24 md:w-full md:h-full"
                      alt="Competition"
                      draggable="false"
                    />
                  </div>
                  <p className="text-[#FF4800] text-lg md:text-3xl lg:text-[40px] font-inter leading-none">
                    SEMINAR
                  </p>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section
          id="timeline"
          className="w-full flex flex-col gap-4 lg:gap-[118px] pt-10 px-5 md:pt-20 md:px-10 lg:px-16 lg:pt-41"
        >
          <div className="flex flex-col gap-4 md:gap-0 md:flex-row w-full items-center justify-between">

            <motion.h1
              ref={ref06}
              initial={{ x: -50, opacity: 0 }}
              animate={inView06 ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-audiowide text-black/10 text-5xl md:text-[80px] lg:text-[100px] font-medium">
              04
            </motion.h1>

            <h1 className="font-audiowide font-semibold text-2xl md:text-3xl lg:text-5xl text-[#333333]">
              This is Our Timeline
            </h1>

          </div>
          <div className="flex w-full pt-10 lg:pt-0">
            <img
              className="w-full block md:hidden"
              src="/timeline.svg"
              alt="timeline"
              draggable="false"
            />
            <img
              className="w-full hidden md:block"
              src="/timeline-md.svg"
              alt="timeline"
              draggable="false"
            />
          </div>
        </section>

        {/* Faq */}
        <section
          id="faq"
          className="w-full flex flex-col gap-4 lg:gap-17 pt-15 px-5 md:pt-20 md:px-10 lg:px-16 lg:pt-41"
        >
          <div className="flex md:flex-row flex-col-reverse text-center gap-4 md:gap-0 md:text-left justify-between items-center">
            <div className=" flex md:flex-row gap-4 flex-col">

              <h1 className="font-audiowide font-semibold text-center text-2xl md:text-3xl lg:text-5xl text-[#333333]">
                FAQ
              </h1>

              <p className="text-[#646464] font-inter flex md:hidden">
                Looking for some related answers?
              </p>
            </div>
            <p className="text-[#646464] font-inter hidden md:flex lg:text-lg md:text-sm lg:leading-8 md:leading-6 max-w-lg md:mr-35 lg:mr-70">
              Looking for some related answers?
            </p>

            <motion.h1
              ref={ref07}
              initial={{ x: 50, opacity: 0 }}
              animate={inView07 ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-audiowide text-black/10 text-5xl md:text-[80px] lg:text-[100px] font-medium">
              05
            </motion.h1>

          </div>
          <div className="space-y-4 mt-10 md:mt-5 lg:mt-0">
            {faqs?.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white shadow-sm border border-none overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-inset cursor-pointer"
                >
                  <span className="text-sm lg:text-xl font-medium text-black pr-8">
                    {faq.question}
                  </span>
                  <span className="shrink-0 ml-4">
                    {openIndex === index ? (
                      <Minus className="w-6 h-6 text-[#FF4800]" />
                    ) : (
                      <Plus className="w-6 h-6 text-[#FF4800]" />
                    )}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-[#646464] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sponsor & Media Partners */}
        <section id="sponsor" className="w-full py-20 lg:mt-20">
          <div className="w-full px-5 md:px-11 lg:px-16">

            <motion.h1
              ref={ref08}
              initial={{ x: -50, opacity: 0 }}
              animate={inView08 ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-audiowide text-black/10 text-5xl md:text-[80px] lg:text-[100px] font-medium text-center md:text-start md:mt-o"
            >
              06
            </motion.h1>

            <h1 className="font-audiowide font-semibold text-center text-2xl md:text-3xl lg:text-5xl text-[#333333] mt-5 md:-mt-18 lg:-mt-24">
              Sponsor & <br /> Media Partners
            </h1>

            <p className="font-inter text-center text-[#646464] text-sm md:text-base lg:text-xl leading-tight mt-6">
              Thank you to our sponsors and media partners who supported our event.
            </p>
          </div>

          <div className="overflow-hidden w-full mt-14 md:mt-18 lg:mt-22">
            <motion.div
              className="flex gap-8 items-center"
              animate={{ x: ["0%", "-200%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {sponsor.concat(sponsor).map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center shrink-0"
                >
                  <img
                    src={logo}
                    alt={`sponsor ${index + 1}`}
                    className="max-h-10 sm:max-h-14 md:max-h-20 lg:max-h-24 object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="overflow-hidden w-full mt-14 md:mt-18 lg:mt-22 lg:mb-10">
            <motion.div
              className="flex gap-8 items-center"
              animate={{ x: ["-200%", "0%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {mediapart.concat(mediapart).map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center shrink-0"
                >
                  <img
                    src={logo}
                    alt={`mediapart ${index + 1}`}
                    className="max-h-10 sm:max-h-14 md:max-h-20 lg:max-h-24 object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>

        </section>

        {/* Contacts */}
        <section id="contacts" className="bg-[#1D1C1C] text-white py-10">
          <div className="w-full w-full px-7 md:px-11 lg:px-34 grid grid-cols-1 md:grid-cols-3 gap-7">
            <div>
              <img
                src={ContactsImage}
                alt="CONTACTS DINACOM 2026"
                className="h-7"
              />

              <div className="flex gap-4 mt-4">
                <div className="w-12 h-12 bg-[#2B2A2A] rounded-full flex items-center justify-center">
                  <a
                    href="https://www.tiktok.com/@dnccsemarang"
                    target="_blank"
                  >
                    <img src={IconTiktok} alt="Icon Tiktok" />
                  </a>
                </div>
                <div className="w-12 h-12 bg-[#2B2A2A] rounded-full flex items-center justify-center">
                  <a
                    href="https://www.instagram.com/dnccsemarang"
                    target="_blank"
                  >
                    <img src={IconIg} alt="Icon Instagram" />
                  </a>
                </div>
                <div className="w-12 h-12 bg-[#2B2A2A] rounded-full flex items-center justify-center">
                  <a 
                    href="https://www.linkedin.com/company/dnccsemarang"
                    target="_blank"
                  >
                    <img src={IconLinkedin} alt="Icon Linkedin" />
                  </a>
                </div>
                <div className="w-12 h-12 bg-[#2B2A2A] rounded-full flex items-center justify-center">
                  <a 
                    href="https://github.com/dnccsemarang"
                    target="_blank"
                  >
                    <img src={IconGithub} alt="Icon Github" />
                  </a>
                </div>
              </div>
            </div>

            <div className="md:ml-22 lg:ml-32">
              <h2 className="text-xl font-bold mb-6">Contact</h2>
              <div className="flex items-center gap-3 mb-6">
                <img src={IconWa} alt="Icon WhatsApp" className="w-9" />
                <div>
                  <p className="font-bold">Zendry</p>
                  <a
                    href="https://wa.me/6289666900321"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#FF4800] transition-colors"
                  >
                    089666900321
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img src={IconWa} alt="Icon WhatsApp" className="w-9" />
                <div>
                  <p className="font-bold">Aldi</p>
                  <a
                    href="https://wa.me/6281392130582"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#FF4800] transition-colors"
                  >
                    081392130582
                  </a>
                </div>
              </div>
            </div>

            <div className="md:ml-30 lg:ml-50">
              <h2 className="text-xl font-bold mb-6">Explore</h2>
              <div className="space-y-3 text-white">
                <a
                  onClick={() => scrollToSection("about")}
                  className="cursor-pointer hover:text-[#FF4800] transition-colors block"
                >
                  About
                </a>
                <a
                  onClick={() => scrollToSection("competition")}
                  className="cursor-pointer hover:text-[#FF4800] transition-colors block"
                >
                  Competition
                </a>
                <a
                  onClick={() => scrollToSection("timeline")}
                  className="cursor-pointer hover:text-[#FF4800] transition-colors block"
                >
                  Timeline
                </a>
                <a
                  onClick={() => scrollToSection("faq")}
                  className="cursor-pointer hover:text-[#FF4800] transition-colors block"
                >
                  FAQ
                </a>
                <a
                  onClick={() => scrollToSection("contacts")}
                  className="cursor-pointer hover:text-[#FF4800] transition-colors block"
                >
                  Contacts
                </a>
              </div>
            </div>
          </div>

          <p className="text-center mt-12 text-sm">
            © 2025 Dinacom, All Rights Reserved
          </p>
        </section>
      </div>
    </>
  );
};

export default LandingPage;