// components/withAuth.tsx
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";

interface Props {
  children: ReactNode;
}

export default function withAuth(Component: any) {
  return function AuthWrapper(props: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [redirectMessage, setRedirectMessage] = useState("");

    useEffect(() => {
      const email = localStorage.getItem("email");

      if (!email) {
        setRedirectMessage("Please login first to access this page...");
        // Redirect after a short delay so user can see the message
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) return <Component {...props} />;

    // Show message if user not logged in
    if (redirectMessage) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f8f8",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {redirectMessage}
        </div>
      );
    }

    return <Component {...props} />;
  };
}
