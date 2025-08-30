import { toast } from "sonner";
export async function updateProfile(data: {
    user_id: string;
    student_id?: string;
    study_year?: number;  
    program?: string;
    full_name: string;
    email: string;
    bio: string
}) {
     try {
    const res = await fetch("/api/users/" + data.user_id + "/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(data),
    })
    const resData = await res.json()

    if(res.status !== 200) {
        console.error("Update profile failed:", resData);
        toast.error(resData.message || "Failed to update profile");
        return null;
    }

    console.log("Profile updated:", resData);
        toast.success("Profile updated successfully");
        return resData;
    
} catch (error) {
    console.error("Update profile error:", error);
    toast.error("Failed to update profile");
}
}

  export const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch profile');
      }
      const profileData = await response.json();
      console.log("Fetched profile:", profileData);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };