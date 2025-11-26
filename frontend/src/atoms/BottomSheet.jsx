import { useRef } from "react";

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  full = false,
}) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/25"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-[390px] mx-auto" ref={modalRef}>
        <div
          className={
            "pointer-events-auto relative w-full bg-white shadow-xl transition-transform " +
            (full ? "h-screen rounded-b-none" : "h-[70vh]")
          }
        >
          <div
            className={
              "overflow-y-auto scrollbar-hide " +
              (full ? "px-5 pb-6 pt-6 h-full" : "px-5 pb-6 pt-6 h-[70vh]")
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
