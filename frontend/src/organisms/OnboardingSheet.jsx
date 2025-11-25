import BottomSheet from "../atoms/BottomSheet";
import Button from "../atoms/Button";

export default function OnboardingSheet({ isOpen, onClose }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} full>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-400">Onboarding</p>
        </div>

        {/* Blue section with decorative patterns */}
        <div className="flex-1 bg-indigo-600 rounded-3xl mb-6 relative overflow-hidden">
          {/* Top-left chevron patterns */}
          <div className="absolute top-4 left-4 space-y-1">
            <div className="w-12 h-1 bg-indigo-700 rounded-full transform rotate-12"></div>
            <div className="w-10 h-1 bg-indigo-700 rounded-full transform -rotate-6"></div>
            <div className="w-8 h-1 bg-indigo-700 rounded-full transform rotate-12"></div>
          </div>

          {/* Top-right arc */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-700 rounded-full -mr-16 -mt-16"></div>

          {/* Bottom-right chevron patterns */}
          <div className="absolute bottom-8 right-6 space-y-1">
            <div className="w-12 h-1 bg-indigo-700 rounded-full transform -rotate-12"></div>
            <div className="w-10 h-1 bg-indigo-700 rounded-full transform rotate-6"></div>
            <div className="w-8 h-1 bg-indigo-700 rounded-full transform -rotate-12"></div>
          </div>
        </div>

        {/* Content section */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Manage What To Do
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            The best way to manage what you have to do, don&apos;t forget your
            plans.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <Button
            className="w-full justify-center"
            onClick={() => {
              localStorage.setItem("todo_onboarding_seen", "1");
              onClose();
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
