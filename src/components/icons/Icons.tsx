import { LucideProps } from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-radio-tower"
      >
        <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9" />
        <path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" />
        <circle cx="12" cy="9" r="2" />
        <path d="M16.2 4.8c2 2 2.26 5.11.8 7.47" />
        <path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1" />
        <path d="M9.5 18h5" />
        <path d="m8 22 4-11 4 11" />
      </svg>
    );
  },
  Back: (props: LucideProps) => {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-chevron-left"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    );
  },
};
