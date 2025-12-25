import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

const GoogleSignIn = () => {
  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      console.log("TOKEN:", tokenResponse)

      const res = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      )

      console.log("USER:", res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
      alert(`Welcome ${res.data.name}`)
    },
    onError: (err) => {
      console.error("LOGIN ERROR", err)
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
