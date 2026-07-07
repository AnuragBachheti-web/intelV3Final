import { useEffect, useRef } from "react";
import { useOnboardingStore } from "../store/useOnboardingStore";
import Sidebar from "./Sidebar";
import Step1Auth from "../steps/Step1Auth";
import Step2Business from "../steps/Step2Business";
import Step3Marketplace from "../steps/Step3Marketplace";
import Step4Dashboard from "../steps/Step4Dashboard";
import ConnectionModal from "../modals/ConnectionModal";
import SigninModal from "../modals/SigninModal";
import { motion, AnimatePresence } from "framer-motion";

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

  // Each Next/Back should land on the top of the new step instead of keeping
  // the previous step's scroll position (most noticeable on mobile, where
  // steps are taller than the viewport).
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

  const progress = (step / 4) * 100;

  return (
    <div className="h-screen font-sans selection:bg-gray-200 selection:text-brand overflow-hidden">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-[60]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full bg-brand shadow-[0_0_10px_rgba(56,56,56,0.5)]"
        />
      </div>

      <div className="flex flex-col sm:flex-row h-full pt-1.5">
        {/* LEFT SIDEBAR (Sticky) — becomes a compact top header on mobile, see Sidebar.jsx */}
        <Sidebar />

        {/* RIGHT CONTENT */}
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

      {/* Modals Overlay */}
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

      {/* GLOBAL STYLES FOR ANIMATIONS */}
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

export default OnboardingLayout;
