import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

const GoogleSignIn = () => {

  const login = useGoogleLogin({
    flow: 'implicit',

    onSuccess: async (tokenResponse) => {
      try {
        console.log("1. Google Login Success. Fetching User Info...");
        
        // 1️⃣ Google se user info lao
        const res = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        )

        const { name, email, sub, picture } = res.data
        console.log("2. Google User Found:", email);

        // --- YAHAN GALTI THI (URL FIX) ---
        // Backend URL sahi kar diya hai: /api/auth/google
        console.log("3. Sending data to Backend...");
        
        const backendRes = await axios.post(
          'http://localhost:5000/api/auth/google', 
          {
            name,
            email,
            googleId: sub,
            picture
          }
        )

        console.log("4. Backend Response:", backendRes.data);

        // 3️⃣ LocalStorage me user save
        localStorage.setItem(
          'user',
          JSON.stringify({
            name,
            email,
            picture,
            role: backendRes.data.role
          })
        )

        // 4️⃣ Alert
        alert(`Success! Check your Email now 📩`)
        // Page reload taaki state update ho jaye
        window.location.reload();

      } catch (error) {
        console.error("❌ ERROR in Login Flow:", error);
        // Agar connection fail hua to ye dikhega
        if (error.code === "ERR_NETWORK") {
            alert("Backend se connect nahi ho pa raha. Check karo Server port 5000 par chal raha hai?");
        } else {
            alert("Login Failed. Inspect Console for details.");
        }
      }
    },

    onError: (err) => {
      console.error("LOGIN ERROR", err)
      alert("Google login failed")
    },
  })

  return (
    <button
      onClick={() => login()}
      className="ml-2 px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg transition hover:scale-105 active:scale-95 bg-white text-black hover:bg-zinc-200"
    >
      Sign in with Google
    </button>
  )
}

export default GoogleSignIn