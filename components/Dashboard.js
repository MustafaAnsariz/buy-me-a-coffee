"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useractions"; // Assuming this path is correct
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";


const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 inline-block">
    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
  </svg>
);
const PaintBrushIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 inline-block">
      <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 3Zm-3.001 7.003A.75.75 0 0 1 6.25 9.25h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.751-.752Zm1.623-4.425a2.25 2.25 0 0 1 3.248 0l.217.217a1.875 1.875 0 0 1 0 2.652L9.11 14.39a.75.75 0 0 1-1.06 0L3.667 9.947a1.875 1.875 0 0 1 0-2.652l.217-.217Zm1.041 2.458L9.25 9.58l4.138-4.137a.375.375 0 0 0 0-.53l-.217-.217a.75.75 0 0 0-1.06 0L8.662 7.046ZM14.25 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
);
const CreditCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 inline-block">
        <path d="M2.5 4A1.5 1.5 0 0 0 1 5.5v2h18v-2A1.5 1.5 0 0 0 17.5 4h-15Z" />
        <path d="M1 9v5.5A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5V9H1Z" />
    </svg>
);

const Dashboard = () => {
  const { data: session, status, update } = useSession(); // 'update' is correctly destructured
  const router = useRouter();
  const initialFormData = {
    name: "",
    username: "",
    email: "",
    profilePicture: "",
    coverPicture: "",
    RazorpayId: "",
    RazorpaySecret: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user && session.user.name) {
      getData(session.user.name);
    }
  }, [session, status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getData = async (usernameToFetch) => {
    if (!usernameToFetch) {
      console.warn("getData called without a username.");
      return;
    }
    try {
      let u = await fetchuser(usernameToFetch);
      setFormData({
        ...initialFormData, // Reset to initial then apply fetched data
        ...u,
      });
    } catch (error) {
      console.error("Error fetching user data in getData:", error);
      toast.error("Failed to load profile: " + error.message, { theme: "dark", transition: Bounce });
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session || !session.user) {
      toast.error("Session not found. Please log in.", { theme: "dark", transition: Bounce });
      return;
    }
    // Get the username from the session *before* attempting an update.
    const oldUsernameFromSession = session.user.name;

    try {
      // updateProfile should return the full updated user object from the DB
      const updatedData = await updateProfile(oldUsernameFromSession, formData);

      if (formData.username !== oldUsernameFromSession) {
        // Username was changed successfully in the backend
        toast.success("Profile updated! Username has been changed.", { theme: "dark", transition: Bounce });
        toast.info("Please log in again for the changes to take full effect.", { autoClose: 4000, theme: "dark", transition: Bounce });
        
        // Sign out to force re-login, which will refresh the session with the new username.
        setTimeout(() => {
          signOut({ callbackUrl: "/login" }); // Redirect to login after sign out
        }, 4500); // Give user time to see the toasts

      } else {
        // Username did not change, other profile info updated.
        // 'updatedData' from updateProfile is the full, fresh user object from the database.
        setFormData({ ...initialFormData, ...updatedData }); // Update form with latest data from DB
        toast.success("Profile updated successfully!", { theme: "dark", transition: Bounce });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // This will display errors from updateProfile (e.g., "Username already exists", "Original user profile not found")
      toast.error(error.message || "Failed to update profile.", { theme: "dark", transition: Bounce });
    }
  };  

  if (status === "loading" || !session) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick 
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
        transition={Bounce} 
      />
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
        <div className="container mx-auto max-w-3xl">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Manage Your Profile
            </h1>
            <p className="text-slate-400 mt-2">Keep your information up to date.</p>
          </header>

          <form 
            onSubmit={handleSubmit} 
            className="bg-slate-900 shadow-2xl rounded-xl p-6 md:p-10 space-y-8 border border-slate-700"
          >
            
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-700 pb-3 flex items-center">
                <UserIcon /> Basic Information
              </h2>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 p-3 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="Your Display Name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">
                  Username <span className="text-xs text-slate-500">(URL: yoursite.com/username)</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 p-3 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="your_unique_username"
                  value={formData.username || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Email <span className="text-xs text-slate-500">(Cannot be changed)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-3 w-full bg-slate-700 border border-slate-600 rounded-lg shadow-sm text-slate-400 cursor-not-allowed"
                  placeholder="your_email@example.com"
                  value={formData.email || ""}
                  onChange={handleChange} 
                  readOnly
                />
              </div>
            </section>

           
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-700 pb-3 flex items-center">
                <PaintBrushIcon /> Appearance
              </h2>
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-slate-300 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  id="profilePicture"
                  name="profilePicture"
                  className="mt-1 p-3 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="https://example.com/profile.jpg"
                  value={formData.profilePicture || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="coverPicture" className="block text-sm font-medium text-slate-300 mb-1">
                  Cover Picture URL
                </label>
                <input
                  type="text"
                  id="coverPicture"
                  name="coverPicture"
                  className="mt-1 p-3 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="https://example.com/cover.jpg"
                  value={formData.coverPicture || ""}
                  onChange={handleChange}
                />
              </div>
            </section>

           
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-200 border-b border-slate-700 pb-3 flex items-center">
                <CreditCardIcon /> Payment Integration
              </h2>
              <div>
                <label htmlFor="RazorpayId" className="block text-sm font-medium text-slate-300 mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="password"
                  id="RazorpayId"
                  name="RazorpayId"
                  className="mt-1 p-3 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="rzp_live_..."
                  value={formData.RazorpayId || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="RazorpaySecret" className="block text-sm font-medium text-slate-300 mb-1">
                  Razorpay Key Secret
                </label>
                <input
                  type="password"
                  id="RazorpaySecret"
                  name="RazorpaySecret"
                  className="mt-1 p-3 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="Enter your Razorpay secret"
                  value={formData.RazorpaySecret || ""}
                  onChange={handleChange}
                />
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-bold rounded-lg text-md px-5 py-3.5 text-center transition-transform hover:scale-105 shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
