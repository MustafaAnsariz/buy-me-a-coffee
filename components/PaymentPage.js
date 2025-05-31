"use client"

import React, { useState, useEffect } from 'react'; // Corrected import
import Script from 'next/script';
import { initiate, fetchuser } from "@/actions/useractions"; // Combined imports
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation'; // Combined imports

const PaymentPage = ({ username }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [payments, setPayments] = useState([]);
  const [currentUser, setCurrentUser] = useState({}); // Keeping your initialization
  const [paymentform, setPaymentform] = useState({
    name: "",
    message: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const getData = async () => {
      if (!username) return;
      try {
        let u = await fetchuser(username);
        if (u) {
          setCurrentUser(u);
          setNotFound(false);
        } else {
          setNotFound(true);
          setCurrentUser({}); // Or null if you prefer
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setNotFound(true);
        setCurrentUser({}); // Or null
      }
    };

    const fetchPaymentsForUser = async () => {
      if (!username) return;
      try {
        const res = await fetch(`/api/payments?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          // Check if API returns { payments: [] } or just []
          setPayments(data.payments || data || []);
        } else {
          console.error("Failed to fetch payments:", res.statusText);
          setPayments([]);
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPayments([]);
      }
    };

    getData();
    fetchPaymentsForUser();
    // console.log(currentUser) // This might log the initial empty state due to async nature
  }, [username]); // Effect depends only on username

  useEffect(() => {
    // Check if the searchParams contain paymentdone=true 
    if (searchParams && searchParams.get("paymentdone") === "true") {
      toast.success(`Payment successful!`, { // Use toast.success
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true, // User can click to dismiss
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      // Remove the query parameter to prevent toast on refresh/back, without full reload
      router.replace(`/${username}`, undefined, { shallow: true });
    }
  }, [searchParams, username, router]); // Dependencies for this effect

  const handlechange = (e) => {
    setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
    setError(""); // Clear error on change
  };

  const pay = async (presetAmount) => {
    let amountToPay = presetAmount;
    const isPresetPayment = (typeof presetAmount === 'number');

    if (!isPresetPayment) {
      amountToPay = paymentform.amount;
    }

    // Check if Razorpay credentials exist
    if (!currentUser.RazorpayId || !currentUser.RazorpaySecret) {
      toast.warning(`${username} needs to set up their payment credentials in dashboard.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    // Validate Razorpay Key ID format (they typically start with 'rzp_')
    if (!currentUser.RazorpayId.startsWith('rzp_')) {
      toast.error('Invalid Razorpay credentials. Please check the Key ID format.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    // Rest of your validation
    if (!isPresetPayment && !paymentform.name && !session?.user?.name) {
      setError("Name is required.");
      return;
    }

    if (!amountToPay) {
      setError("Amount is required.");
      return;
    }
    const amountValue = Number(amountToPay);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("Amount must be a valid positive number.");
      return;
    }
    setError(""); 

    const nameForPayment = paymentform.name || (session?.user?.name || "Anonymous"); 
    
    if (!currentUser || !currentUser.RazorpayId) {
        setError("Recipient's Razorpay Key ID is not configured or user data not loaded.");
        console.error("currentUser or RazorpayId is missing:", currentUser);
        return;
    }

    try {
      // Pass only name and message in the third argument object for 'initiate'
      let a = await initiate(amountValue, username, { name: nameForPayment, message: paymentform.message });
      if (!a || !a.id) {
        console.error("Failed to initiate payment or get order ID. Response from initiate:", a);
        setError("Could not initiate payment. Please try again.");
        return;
      }
      let orderId = a.id;
      
      const options = {
        "key": currentUser.RazorpayId,
        "amount": amountValue * 100, 
        "currency": 'INR',
        "name": 'Buy Me a Coffee',
        "description": 'Support Transaction',
        "order_id": orderId,
        "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay?username=${username}`,
        "prefill": {
          "name": nameForPayment,
          "email": session?.user?.email || '',
          "contact": ''
        },
        "notes": {
          "message": paymentform.message || "Enjoy your coffee!",
        },
        "theme": {
          "color": '#3B82F6'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
          toast.error(`Payment Failed: ${response.error.description || 'Unknown Razorpay error.'}`, {
              position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "dark", transition: Bounce,
          });
          console.error("Payment Failed (Razorpay event):", response);
      });
      rzp1.open();
    } catch (err) {
        console.error("Error in pay function:", err);
        setError("An unexpected error occurred during payment initiation.");
        toast.error("An unexpected error occurred. Please try again.", {
            position: "top-right", autoClose: 5000, theme: "dark", transition: Bounce,
        });
    }
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <svg className="w-24 h-24 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10a3 3 0 11-6 0 3 3 0 016 0zM9.172 16.172a4 4 0 015.656 0"></path></svg>
        <h1 className="text-3xl font-bold text-red-400">User Not Found</h1>
        <p className="text-gray-400 mt-2">The user profile you are looking for does not exist.</p>
        <button 
          onClick={() => router.push('/')} 
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors">
          Go to Homepage
        </button>
      </div>
    );
  }
  
  // Conditional rendering for loading state for currentUser (using your existing check)
  if (Object.keys(currentUser).length === 0 && !notFound) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            <p className="mt-4 text-xl">Loading Profile...</p>
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
        closeOnClick={true} 
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <div className="cover relative">
        <img
          className="object-cover w-full h-[300px] md:h-[400px]"
          src={currentUser?.coverPicture || "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/7784493/0160fc50007d43b9a1a2bf3d92cffb69/eyJoIjozNjAsInciOjM2MH0%3D/1.jpeg?token-hash=2mPBirHLyB6VsPhMoWw7I5sZjTko3lwDQUjF0ynM45s%3D&token-time=1749081600"}
          alt="Cover"
        />
         <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
      <div className="relative flex justify-center -mt-[50px] md:-mt-[75px] z-10">
        <img
          className="rounded-full h-[100px] w-[100px] md:h-[150px] md:w-[150px] object-cover border-4 border-slate-800 shadow-xl"
          src={currentUser?.profilePicture || "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/7784493/0160fc50007d43b9a1a2bf3d92cffb69/eyJoIjozNjAsInciOjM2MH0%3D/1.jpeg?token-hash=2mPBirHLyB6VsPhMoWw7I5sZjTko3lwDQUjF0ynM45s%3D&token-time=1749081600"}
          alt="Profile"
        />
      </div>
      
      <div className="flex flex-col items-center justify-center gap-2 pt-8 pb-12 bg-slate-950 text-white">
        <div className="info font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          @{username}
        </div>
        <div className="info text-md text-slate-300 px-4 text-center max-w-lg">Help {username} to create more amazing content and achieve their goals!</div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-slate-300 text-sm bg-slate-800 px-4 py-2 rounded-full shadow-md"> 
            <span className="font-bold text-purple-400">{payments.length}</span> Supporters 
          </span>
          <span className="text-slate-600"> &middot; </span>
          <span className="text-slate-300 text-sm bg-slate-800 px-4 py-2 rounded-full shadow-md"> 
            Total <span className="font-bold text-green-400">₹{payments.reduce((acc, payment) => acc + Number(payment.amount || 0), 0)}</span> 
          </span>
        </div>

        <div className="pay flex w-full max-w-6xl mx-auto flex-col-reverse md:flex-row items-start md:items-stretch mt-12 gap-6 px-4">
          <div className="supporters md:w-1/2 w-full bg-slate-900 text-white p-6 rounded-xl shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Recent Supporters</h2>
            
            <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {!payments.length && (
                <div className="text-center py-10 px-4">
                  <svg className="mx-auto h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M15.75 18L8.25 6M21 12H3" />
                  </svg>
                  <h3 className="mt-4 text-xl font-semibold text-slate-400">Be the First Supporter!</h3>
                  <p className="mt-2 text-sm text-slate-500">Your contribution will make a big difference.</p>
                </div>
              )}

              {payments.map((payment) => (
                <li key={payment._id} className="bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-purple-500/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-700 hover:border-purple-500">
                  <div className="flex items-start gap-4">
                    <img 
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-400 shadow-md" 
                      src={payment.supporterAvatar || "/user.gif"} 
                      alt={`${payment.name}'s avatar`} 
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                        <p className="text-lg font-semibold text-purple-300 break-all">{payment.name}</p>
                        <p className="text-xl font-bold text-green-400 mt-1 sm:mt-0 whitespace-nowrap">₹{payment.amount}</p>
                      </div>
                      {payment.message && (
                        <p className="text-sm text-slate-300 italic bg-slate-700/50 p-3 rounded-md mt-2 shadow-inner">"{payment.message}"</p>
                      )}
                       <p className="text-xs text-slate-500 mt-2 text-right">{new Date(payment.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-1/2 w-full bg-slate-900 text-white p-6 rounded-xl shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-green-400">Make a Contribution</h2>
            <div className="flex items-center gap-4 flex-col mt-6">
              {error && <div className="w-full md:w-3/4 bg-red-700/30 text-red-300 p-3 rounded-lg text-sm text-center border border-red-600">{error}</div>}
              <input onChange={handlechange}
                value={paymentform.name}
                className="w-full md:w-3/4 bg-slate-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-sky-500 outline-none transition-shadow shadow-sm"
                placeholder="Your Name"
                name='name'
                type="text"
              />
              <input onChange={handlechange}
                value={paymentform.message}
                className="w-full md:w-3/4 bg-slate-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-sky-500 outline-none transition-shadow shadow-sm"
                placeholder="Your Message (optional)"
                name='message'
                type="text"
              />
              <input onChange={handlechange}
                value={paymentform.amount}
                className="w-full md:w-3/4 bg-slate-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-sky-500 outline-none transition-shadow shadow-sm"
                placeholder="Enter Amount (e.g., 100)"
                name='amount'
                type="number" 
              />
              <button 
                onClick={() => pay()} 
                className="w-full md:w-3/4 text-white bg-gradient-to-br from-purple-600 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-800 font-bold rounded-lg text-md px-10 py-3 text-center transition-transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(!paymentform.name && !session?.user?.name && !paymentform.amount) || !paymentform.amount || Number(paymentform.amount) <= 0}
              >
                Support with ₹{paymentform.amount || '...'}
              </button>

              <div className="w-full md:w-3/4 border-t border-slate-700 my-4"></div>
              
              <p className="text-sm text-slate-400 mb-2">Or choose a quick amount:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[10, 25, 50, 100].map(amount => ( 
                  <button 
                    key={amount}
                    onClick={() => pay(amount)} 
                    className="text-white bg-gradient-to-br from-slate-700 to-sky-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-slate-600 dark:focus:ring-sky-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-transform hover:scale-105 shadow-md"
                  >
                    Pay ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b; /* slate-800 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568; /* slate-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096; /* slate-500 */
        }
      `}</style>
    </>
  )
}
export default PaymentPage;