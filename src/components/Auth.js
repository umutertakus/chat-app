import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      cookies.set("auth-token", response.user.refreshToken);
      setIsAuth(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth">
      <p>Sign In With Google To Continue</p>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
};

export default Auth;
