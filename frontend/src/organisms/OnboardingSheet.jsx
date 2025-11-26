import { useState } from "react";
import Button from "../atoms/Button";

export default function OnboardingSheet({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem("todo_onboarding_seen", "1");
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center transition-transform duration-300 ease-in-out ${
        isClosing ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="absolute inset-0 bg-gray-200" />
      <div className="relative w-full max-w-[390px] h-full mx-auto bg-white flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Onboarding.png')" }}
        />
        <div className="relative w-full h-full flex flex-col">
          <div className="flex-1 min-h-[60%]" />
          <div className="bg-white px-6 pt-6 pb-8">
            <div className="space-y-3 mb-24">
              <h1 className="text-2xl font-semibold text-gray-900">
                Manage What To Do
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                The best way to manage what you have to do, don&apos;t forget
                your plans.
              </p>
            </div>
            <Button
              className="w-full justify-center bg-[#4566EC] cursor-pointer"
              onClick={handleClose}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
