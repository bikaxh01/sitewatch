import axios from "axios";
import { useEffect, useState } from "react";

interface user {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  signUpType: string;
}

export function useUser(): [user | null, boolean, boolean] {
  const [user, setUser] = useState<null | user>(null);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/user/get-user`,
          { withCredentials: true }
        );
        setSignedIn(true);
        setUser(res.data.data);
      } catch (error) {
        console.log("🚀 ~ getUser ~ error:", error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);
  return [user, loading, signedIn];
}
