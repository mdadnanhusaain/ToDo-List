import CheckIcon from "../icons/CheckIcon";

export default function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={
        "flex size-7 items-center justify-center border cursor-pointer border-[#4566EC]"
      }
    >
      {checked && <CheckIcon className="size-5 text-[#4566EC]" />}
    </button>
  );
}
