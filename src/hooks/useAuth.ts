// import { useEffect, useState } from "react";
// import { User, Session } from "@supabase/supabase-js";
// import { supabase } from "@/src/integrations/supabase/client";
// import { useToast } from "@/src/hooks/use-toast";

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState<any>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Set up auth state listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null);
        
//         // Fetch profile when user logs in
//         if (session?.user) {
//           setTimeout(() => {
//             fetchProfile(session.user.id);
//           }, 0);
//         } else {
//           setProfile(null);
//         }
        
//         setLoading(false);
//       }
//     );

//     // Check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
      
//       if (session?.user) {
//         fetchProfile(session.user.id);
//       }
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const fetchProfile = async (userId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('user_id', userId)
//         .single();

//       if (error) throw error;
//       setProfile(data);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     }
//   };

//   const signUp = async (email: string, password: string, fullName: string, role: string = 'student') => {
//     try {
//       const redirectUrl = `${window.location.origin}/`;
      
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: redirectUrl,
//           data: {
//             full_name: fullName,
//             role: role
//           }
//         }
//       });

//       if (error) throw error;

//       toast({
//         title: "Sign up successful!",
//         description: "Please check your email to verify your account.",
//       });

//       return { error: null };
//     } catch (error: any) {
//       toast({
//         title: "Sign up failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       return { error };
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       toast({
//         title: "Sign in successful!",
//         description: "Welcome back!",
//       });

//       return { error: null };
//     } catch (error: any) {
//       toast({
//         title: "Sign in failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       return { error };
//     }
//   };

//   const signOut = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;

//       toast({
//         title: "Signed out successfully",
//         description: "See you next time!",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Sign out failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   return {
//     user,
//     session,
//     profile,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//     fetchProfile
//   };
// }

import { useEffect, useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";

// Types for your user/session data
interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: Date;
}

interface Session {
  token: string;
  user: User;
  expiresAt: Date;
}

interface Profile {
  userId: string;
  full_name: string;
  bio?: string;
  avatar?: string;
  preferences?: any;
  // Add other profile fields as needed
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with your API
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const { user, session } = await response.json();
        setUser(user);
        setSession(session);
        
        // Fetch profile data
        // if (user?.id) {
          // await fetchProfile(user.id);
        // }
      } else {
        // Invalid token, clear it
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  // const fetchProfile = async (userId: string) => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(`/api/users/${userId}/profile`, {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  //       },
  //     });

  //     if (response.status !== 200) {
  //       throw new Error('Failed to fetch profile');
  //     }
  //     const profileData = await response.json();
  //     console.log("Fetched profile:", profileData);
  //     setProfile(profileData.profile);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching profile:', error);
  //   }
  // };

  const signUp = async (email: string, password: string, fullName: string, role: string = 'student') => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      toast({
        title: "Sign up successful!",
        description: "Please check your email to verify your account.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (response.status > 400 ) {
        throw new Error(data.message || 'Sign in failed');
      }

      // Store token and set auth state
      const { token, user, session } = data;
      localStorage.setItem('auth_token', token);
      setUser(user);
      setSession(session);

      // Fetch profile
      // if (user?.id) {
        // await fetchProfile(user?.id);
      // }

      toast({
        title: "Sign in successful!",
        description: "Welcome back!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      // Clear local state regardless of API response
      localStorage.removeItem('auth_token');
      setUser(null);
      setSession(null);
      setProfile(null);

      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      router.push("/auth");
    } catch (error: any) {
      // Still clear local state even if API call fails
      localStorage.removeItem('auth_token');
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out locally.",
      });
      router.push("/auth");
    }
  };

   useEffect(() => {
    // Check for existing session on mount
    checkExistingSession();
    // fetchProfile(user?.id as string);
  }, []);
console.log("Auth State:", { user, session, profile, loading });
  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    // fetchProfile
  };
}