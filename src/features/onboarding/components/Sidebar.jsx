import { useOnboardingStore } from "../store/useOnboardingStore";
import fullLogoDark from "../../../assets/fulllogo_Dark.png";

const steps = [
  {
    num: 1,
    title: "Create your Account",
    desc: "Sign up with email, phone, or social login to get started on your intelligence journey.",
  },
  {
    num: 2,
    title: "Business Profile",
    desc: "Tell us about your store, revenue scale, and marketplace channels to personalize your experience.",
  },
  {
    num: 3,
    title: "Connect Marketplace",
    desc: "Link your Amazon, Shopify, eBay, and other sales channels to start syncing your data.",
  },
  {
    num: 4,
    title: "Welcome to your Dashboard",
    desc: "Your command center is ready with powerful tools and AI-driven insights.",
  },
];

function Sidebar() {
  const currentStep = useOnboardingStore((s) => s.step);
  const setStep = useOnboardingStore((s) => s.setStep);

  const completedCount = Math.max(currentStep - 1, 0);

  return (
    <div className="w-[300px] min-w-[260px] bg-white border-r border-gray-200 px-8 py-10 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar">
      <div>
        {/* Logo */}
        <div className="mb-6">
          <img src={fullLogoDark} alt="Realify" className="h-8 object-contain" />
        </div>

        {/* Progress text */}
        <p className="text-sm text-gray-500 mb-8">
          {completedCount} Out of 4 Steps Completed.
        </p>

        {/* Steps */}
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <div key={step.num} className="flex gap-3">
                {/* Left: circle + connector */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => isCompleted && setStep(step.num)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : isCompleted
                          ? 'bg-emerald-500 text-white cursor-pointer'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted
                      ? <i className="fa-solid fa-check text-xs" />
                      : step.num}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-px flex-1 my-1 ${isCompleted ? 'bg-emerald-300' : 'bg-gray-200'}`} style={{ minHeight: '24px' }} />
                  )}
                </div>

                {/* Right: text content */}
                <div
                  className={`flex-1 mb-5 rounded-xl transition-colors ${
                    isActive ? 'bg-gray-50 px-3 py-2' : 'pt-1'
                  }`}
                >
                  <h3 className={`font-semibold text-sm leading-tight ${
                    isActive ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs leading-relaxed mt-1 ${
                    isActive ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">SUPPORT</p>
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <i className="fa-regular fa-circle-question text-base" />
          <span>Help Center</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
