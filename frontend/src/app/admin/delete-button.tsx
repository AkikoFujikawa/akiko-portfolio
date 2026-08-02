"use client";

type DeleteButtonProps = {
  confirmationMessage: string;
  children: React.ReactNode;
};

export default function DeleteButton({
  confirmationMessage,
  children,
}: DeleteButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmationMessage)) {
          event.preventDefault();
        }
      }}
      className="w-fit rounded-full border border-red-300 bg-white px-7 py-3 font-medium text-red-700 transition hover:bg-red-50"
    >
      {children}
    </button>
  );
}
