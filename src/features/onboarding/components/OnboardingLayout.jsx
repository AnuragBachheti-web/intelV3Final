import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnboardingStore } from "../store/useOnboardingStore";
import Sidebar from "./Sidebar";
import Step1Auth from "../steps/Step1Auth";
import Step2Business from "../steps/Step2Business";
import Step3Marketplace from "../steps/Step3Marketplace";
import Step4Dashboard from "../steps/Step4Dashboard";
import Step5Connect from "../steps/Step5Connect";
import ConnectionModal from "../modals/ConnectionModal";
import SigninModal from "../modals/SigninModal";
import { motion, AnimatePresence } from "framer-motion";
import fullLogoDark from "../../../assets/fulllogo_Dark.png";

function OnboardingLayout() {
  const { step, setStep, activeModal, addConnectedMarketplace } = useOnboardingStore();

  // Handle redirect params from OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('step');
    const statusParam = urlParams.get('status');
    const shopParam = urlParams.get('shop');

    if (statusParam === 'connected' && shopParam) {
      const platform = urlParams.get('platform') || 'shopify';

      // 🔹 Store connection data for future API calls
      localStorage.setItem('active_shop', shopParam);
      localStorage.setItem('active_platform', platform);

      // Keep legacy keys for backward compatibility if needed
      localStorage.setItem(`${platform}_shop`, shopParam);
      localStorage.setItem(`${platform}_status`, 'connected');

      addConnectedMarketplace(platform);

      if (stepParam) {
        setStep(parseInt(stepParam));
      }
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [addConnectedMarketplace, setStep]);

  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Auth />;
      case 2: return <Step2Business />;
      case 3: return <Step3Marketplace />;
      case 4: return <Step4Dashboard />;
      default: return <Step1Auth />;
    }
  };

  const progress = (step / 5) * 100;

  if (step === 5) {
    return <Step5Layout setStep={setStep} progress={progress} />;
  }

  return (
    <div className="h-screen font-sans selection:bg-gray-200 selection:text-brand overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-[60]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full bg-brand shadow-[0_0_10px_rgba(56,56,56,0.5)]"
        />
      </div>

      <div className="flex flex-col sm:flex-row h-full pt-1.5">
        <Sidebar />

        <main ref={mainRef} className="flex-1 bg-white h-full flex flex-col px-5 py-6 sm:px-12 sm:py-10 lg:px-20 lg:py-14 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {activeModal === "connection" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConnectionModal />
          </motion.div>
        )}
        {activeModal === "signin" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SigninModal />
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .anim-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
          .anim-scale-up {
            animation: scale-up 0.3s ease-out forwards;
          }
          @keyframes scale-up {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .custom-scrollbar::-webkit-scrollbar,
          .sidebar-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track,
          .sidebar-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
          }
          .sidebar-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .sidebar-scrollbar:hover::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
          }
        `}} />
    </div>
  );
}

const ONBOARDING_STEPS = [
  { num: 1, title: "Create your Account", desc: "Sign up with email, phone, or social login to get started on your intelligence journey." },
  { num: 2, title: "Business Profile", desc: "Tell us about your store, revenue scale, and marketplace channels to personalize your experience." },
  { num: 3, title: "Connect Marketplace", desc: "Link your Amazon, Shopify, eBay, and other sales channels to start syncing your data." },
  { num: 4, title: "Welcome to your Dashboard", desc: "Your command center is ready with powerful tools and AI-driven insights." },
  { num: 5, title: "Connect your Data", desc: "Upload reports or set up with a guided wizard to start seeing real insights immediately." },
];

const ONBOARDING_FAQS = [
  { q: "I sell on Amazon, Shopify, Walmart, and more. How does Realify help me?", a: "Realify unifies all your marketplace data into a single intelligence layer. We automatically detect profit leaks, inventory risks, pricing opportunities, and growth signals across every channel simultaneously. Most sellers find their first insight worth 5–10x the cost within week 1." },
  { q: "How does Realify work?", a: "You upload your marketplace reports (CSV), Realify maps the data automatically, and within seconds you see your full P&L, inventory health, ad performance, and AI-driven insights. No coding or data team required." },
  { q: "How is Realify different from the others?", a: "Unlike dashboards that just display data, Realify is an intelligence layer that proactively surfaces what matters — flagging issues before they become problems and surfacing opportunities you'd otherwise miss." },
  { q: "How do I try Realify before onboarding my real data?", a: "Simply sign up, choose synthesized data on step 2, and you'll see a full insights feed in seconds. You can wipe and start over anytime." },
  { q: "Is my data private and secure?", a: "Yes — your data is encrypted at rest and in transit. We never share your data with third parties, and you can delete everything at any time." },
  { q: "Does Realify scrape Amazon or risk my marketplace account?", a: "Never. Realify only reads report files you choose to upload. We do not access your seller account directly, and nothing we do violates marketplace terms of service." },
  { q: "What do I need to get started?", a: "Just your email and one CSV export from your marketplace. We handle the rest — column detection, categorization, and insight generation are all automatic." },
];

const DAD_JOKES = [
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
  { setup: "What do you call a fake noodle?", punchline: "An impasta!" },
  { setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field!" },
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "What do you call cheese that isn't yours?", punchline: "Nacho cheese!" },
  { setup: "Why can't you give Elsa a balloon?", punchline: "Because she'll let it go!" },
  { setup: "What's a skeleton's least favourite room?", punchline: "The living room." },
];

function Step5Layout({ setStep, progress }) {
  const [_openFAQs, setOpenFAQs] = useState({});
  const [jokeIdx, setJokeIdx] = useState(() => Math.floor(Math.random() * DAD_JOKES.length));
  const currentJoke = DAD_JOKES[jokeIdx];
  const location = useLocation();
  const navigate = useNavigate();
  
  const fromIntel = new URLSearchParams(location.search).get('fromIntel') === 'true';

  const _toggleFAQ = (i) => setOpenFAQs(prev => ({ ...prev, [i]: !prev[i] }));
  const nextJoke = () => { setJokeIdx(i => (i + 1) % DAD_JOKES.length); };

  useEffect(() => {
    const interval = setInterval(() => {
      setJokeIdx(i => (i + 1) % DAD_JOKES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen font-sans selection:bg-gray-200 overflow-hidden flex flex-col">
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-[60]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full bg-brand shadow-[0_0_10px_rgba(56,56,56,0.5)]"
        />
      </div>

      <div className="flex flex-1 min-h-0 pt-1.5">
        <div className="hidden md:flex w-[380px] min-w-[320px] flex-shrink-0 bg-white border-r border-gray-200 flex-col px-6 py-8 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <img src={fullLogoDark} alt="Realify" className="h-8 object-contain" />
          </div>
          <p className="text-sm text-gray-500 mb-7">4 Out of 5 Steps Completed.</p>
          <div className="flex flex-col">
            {ONBOARDING_STEPS.map((s, index) => {
              const isActive = s.num === 5;
              const isCompleted = s.num < 5;
              return (
                <div key={s.num} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      onClick={() => isCompleted && setStep(s.num)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold transition-colors ${isActive ? 'bg-gray-900 text-white'
                        : isCompleted ? 'bg-emerald-500 text-white cursor-pointer'
                          : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      {isCompleted ? <i className="fa-solid fa-check text-xs" /> : s.num}
                    </div>
                    {index < ONBOARDING_STEPS.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${isCompleted ? 'bg-emerald-300' : 'bg-gray-200'}`} style={{ minHeight: '24px' }} />
                    )}
                  </div>
                  <div className={`flex-1 mb-5 rounded-xl transition-colors ${isActive ? 'bg-gray-50 px-3 py-2' : 'pt-1'}`}>
                    <h3 className={`font-semibold text-sm leading-tight ${isActive ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {s.title}
                    </h3>
                    <p className={`text-xs leading-relaxed mt-1 ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center flex-shrink-0 mt-10 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-sans tracking-widest text-gray-400 uppercase">* WHILE THAT UPLOADS... A DAD JOKE</span>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-6 leading-snug">
              {currentJoke.setup} {currentJoke.punchline}
            </p>
            <button
              onClick={nextJoke}
              className="px-4 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-brand text-xs font-semibold rounded-lg transition-colors"
            >
              Another one →
            </button>
          </div>


          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">SUPPORT</p>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <i className="fa-regular fa-circle-question text-base" />
              <span>Help Center</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 bg-white overflow-y-auto custom-scrollbar px-6 py-8 md:px-10 border-r border-gray-200 flex flex-col items-center relative">
          {fromIntel && (
            <div className="absolute top-8 left-8">
              <button
                onClick={() => navigate('/intel')}
                className="text-[14.5px] font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                &larr; Cancel &middot; back to dashboard
              </button>
            </div>
          )}
          
          <div className="w-full max-w-[520px] mt-12">
            <Step5Connect />
          </div>
        </div>

        {/* <div className="hidden lg:flex w-[340px] xl:w-[380px] flex-shrink-0 bg-gray-50 flex-col overflow-y-auto custom-scrollbar px-6 py-8">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-1">FAQs (Frequently Asked Questions)</h3>
            <p className="text-xs text-gray-500 mb-5">What Realify does, how it works, and how to try it before you commit your data.</p>
            <div className="space-y-2">
              {ONBOARDING_FAQS.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(i)}
                    className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-800 leading-snug">{faq.q}</span>
                    <i className={`fa-solid ${openFAQs[i] ? 'fa-minus' : 'fa-plus'} text-brand font-bold text-xs mt-0.5 flex-shrink-0`} />
                  </button>
                  {openFAQs[i] && (
                    <div className="px-4 pb-4">
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{faq.a}</p>

                      {i === 0 && (
                        <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-2.5">
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center justify-between px-3 py-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span className="text-[11px] font-bold text-gray-800">Losing Buy Box on SKU-A24</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-sans tracking-tighter">72% → 41%</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                <span className="text-[11px] font-bold text-gray-800">Margin below floor · 3 SKUs</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-sans tracking-tighter">8.1% net</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                <span className="text-[11px] font-bold text-gray-800">Stockout in ~9 days</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-sans tracking-tighter">cover 9d</span>
                            </div>
                          </div>
                          <p className="text-[9px] font-sans tracking-widest text-center text-gray-400 uppercase">
                            A Prioritized Feed — Most Material Issue First
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-sans tracking-widest text-gray-400 uppercase">* WHILE THAT UPLOADS... A DAD JOKE</span>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-6 leading-snug">
              {currentJoke.setup} {currentJoke.punchline}
            </p>
            <button
              onClick={nextJoke}
              className="px-4 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-brand text-xs font-semibold rounded-lg transition-colors"
            >
              Another one →
            </button>
          </div>
        </div> */}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .anim-fade-in { animation: fade-in 0.5s ease-out forwards; }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
        `}} />
    </div>
  );
}

export default OnboardingLayout;
