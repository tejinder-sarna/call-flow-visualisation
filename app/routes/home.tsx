import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [showOptInForm, setShowOptInForm] = useState(true);
  const optInFormLink =
    "https://engage-staging.fieldpulse.com/KEZTD8N4SkcUZp1c2Vi7J1L9HjLwZh9Czn6JWp90/opt-in-form";
  const privacyPolicyLink =
    "https://engage-staging.fieldpulse.com/KEZTD8N4SkcUZp1c2Vi7J1L9HjLwZh9Czn6JWp90/privacy-policy-and-terms";
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <div>
        <button
          className="bg-gray-600 hover:bg-gray-300  py-1 px-2 rounded cursor-pointer text-white"
          type="button"
          onClick={() => setShowOptInForm(true)}
        >
          Opt-In Form
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-300  py-1 px-2 rounded cursor-pointer text-white"
          type="button"
          onClick={() => setShowOptInForm(false)}
        >
          Privacy Policy & Terms
        </button>
      </div>
      <iframe
        src={showOptInForm ? optInFormLink : privacyPolicyLink}
        width="100%"
        height="1000"
        frameborder="0"
      ></iframe>
    </div>
  );
}
