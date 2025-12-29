import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import config from './config'; 

const GoogleSignIn = () => {

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        console.log("1. Google Login Success. Fetching User Info...");
        
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const { name, email, sub, picture } = res.data;
        console.log("2. Google User Found:", email);
        
        const backendRes = await axios.post(
          `${config.API_URL}/api/auth/google`,
          { name, email, googleId: sub, picture }
        );

        console.log("4. Backend Response:", backendRes.data);

        // ⭐⭐⭐ MAIN FIX HERE: TOKEN SAVE KARO ⭐⭐⭐
        if (backendRes.data.token) {
            localStorage.setItem('token', backendRes.data.token);
            console.log("🔑 Token Saved via Custom Button");
        }
        
        localStorage.setItem('user', JSON.stringify({
            name, email, picture, role: backendRes.data.role || 'user'
        }));

        alert(`Success! Check your Email now 📩`);
        window.location.reload();

      } catch (error) {
        console.error("❌ ERROR in Login Flow:", error);
        alert("Login Failed. Check Console.");
      }
    },
    onError: (err) => {
      console.error("LOGIN ERROR", err);
      alert("Google login failed");
    },
  });

  return (
    <button onClick={() => login()} className="ml-2 px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg transition hover:scale-105 active:scale-95 bg-white text-black hover:bg-zinc-200">
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;