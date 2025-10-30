import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";

interface Props {
  children?: ReactNode;
}

export default function withAuth(Component: any) {
  return function AuthWrapper(props: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
      // Run only on client
      if (typeof window !== "undefined") {
        const email = localStorage.getItem("email");

        if (!email) {
          // User not logged in → redirect
          router.replace("/login");
        } else {
          setUserEmail(email);
        }

        setLoading(false); // Finished checking
      }
    }, [router]);

    // While checking auth, show loading
    if (loading) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Checking authentication...
        </div>
      );
    }

    // If user not logged in, render nothing (redirect handled)
    if (!userEmail) return null;

    // User is logged in → render wrapped component
    return <Component {...props} />;
  };
}
