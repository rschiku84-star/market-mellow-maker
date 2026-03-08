import { createContext, useContext, useState, ReactNode } from "react";

interface MockUser {
  id: string;
  email: string;
  user_metadata: { username: string };
}

interface AuthContextType {
  user: MockUser | null;
  session: unknown;
  loading: boolean;
  signOut: () => Promise<void>;
}

const DEMO_USER: MockUser = {
  id: "demo-user-001",
  email: "demo@example.com",
  user_metadata: { username: "DemoUser" },
};

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USER,
  session: {},
  loading: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<MockUser | null>(DEMO_USER);

  const signOut = async () => {
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, session: {}, loading: false, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
