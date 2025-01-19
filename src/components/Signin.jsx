import { useContext, useRef, useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";
import "./Signin.css";
import axios from "axios";

const Signin = ({ handleSignup }) => {
  const { loginUser, loginGoogleUser } = useContext(AuthContext);
  const emailRef = useRef(null)
  const [showPass, setshowPass] = useState(true)
  const [showForgotSub, setshowForgotSub] = useState(false)
  // var csrf_token = document.cookie.split("=")[1];
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const myPromise = new Promise((resolve, reject) => {
      loginUser(email, password)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });


    toast.promise(myPromise, {
      loading: "Logging you in...",
      success: "Logged in successfully!",
      error: (err) => `${err.toString() == "Unauthorized" ? "Invalid Credentials!" : "Something went wrong!"}`,
    });
  };

  function onGoogleLoginSuccess(res) {
    const userObject = jwt_decode(res.credential);

    const email = userObject.email;
    const given_name = userObject.given_name;

    const myPromise = new Promise((resolve, reject) => {
      loginGoogleUser(email, given_name)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });

    toast.promise(myPromise, {
      pending: "Logging you in...",
      success: "Logged in successfully!",
      error: (err) => `${err == "Bad Request" ? "Please sign up first!" : "Something went wrong!"}`,
    });
  }

  function onGoogleLoginFailure(res) {
    console.log("Failure:", res);
  }
 const handleShowPass=()=>{
  setshowForgotSub(true);
  setshowPass(false)
 }
  const handleForgot = async () => {
    const email = emailRef.current.value;
    if(email==""){
      toast.error("Enter email!")
      return
    }
    emailRef.current.value = ""; // Clear input field
    
    try {
      const response = await axios.post(
        "https://api.prometeo.in/accounts/password-reset/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response.data);

      // Show success notification
      toast.success("Password reset link sent successfully!");
    } catch (error) {
      // Show error notification
      toast.error(
        error.response?.data?.message || "User does not exist"
      );
    }
    
  };

  return (
    <div className="login-container-right">
      <div className="login-container-right-title">LOGIN</div>
      <form className="login-form" onSubmit={handleSubmit}>
        {/* <input type="text" placeholder="Full Name" name="full_name" required /> */}
        <input
          type="email"
          placeholder="Email"
          name="email"
          autoComplete="username"
          ref={emailRef}
          required
        />
        {showPass && <input
          type="password"
          placeholder="Password"
          name="password"
          autoComplete="current-password"
          required
        />}
        <div>
          {showPass && <input type="submit" value="Submit" id="login-form-submit" />}
          {!showForgotSub &&  <button className="ml-3" onClick={()=> handleShowPass()} type="button">
          Forgot password ?
          </button>}
          {showForgotSub && <button className="ml-3 forgot-pass-btn" onClick={()=> handleForgot()} type="button" >
            Submit
          </button>}
        </div>
        <br />
        <br />
        <div className="w-8 h-5 svg-container">
          <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.285645 12.08C0.285645 9.74664 0.413978 7.83331 0.670645 6.33998C0.950645 4.84664 1.41731 3.67998 2.07064 2.83998C2.74731 1.99998 3.68064 1.41664 4.87064 1.08998C6.08398 0.763309 7.63564 0.599976 9.52564 0.599976C11.369 0.599976 12.8973 0.763309 14.1106 1.08998C15.324 1.41664 16.2573 2.01164 16.9106 2.87498C17.5873 3.71498 18.0656 4.88164 18.3456 6.37498C18.6256 7.84498 18.7656 9.74664 18.7656 12.08C18.7656 14.4133 18.6256 16.3266 18.3456 17.82C18.0656 19.29 17.5873 20.445 16.9106 21.285C16.2573 22.125 15.324 22.7083 14.1106 23.035C12.8973 23.3616 11.369 23.525 9.52564 23.525C7.63564 23.525 6.08398 23.3616 4.87064 23.035C3.68064 22.7083 2.74731 22.125 2.07064 21.285C1.41731 20.445 0.950645 19.29 0.670645 17.82C0.413978 16.3266 0.285645 14.4133 0.285645 12.08ZM4.90564 19.85H11.1706C12.2906 19.85 13.0606 19.675 13.4806 19.325C13.924 18.975 14.1456 18.3566 14.1456 17.47V4.27498H7.81065C6.71398 4.27498 5.95564 4.44998 5.53565 4.79998C5.11564 5.14998 4.90564 5.76831 4.90564 6.65498V19.85Z" fill="white" />
            <path d="M25.6467 5.49998L27.0467 8.15998C28.0034 7.24998 28.8667 6.54998 29.6367 6.05998C30.4067 5.56998 31.165 5.20831 31.9117 4.97498L32.2967 9.17498C31.83 9.29164 31.3167 9.46664 30.7567 9.69998C30.1967 9.90998 29.66 10.155 29.1467 10.435C28.6567 10.6916 28.2367 10.96 27.8867 11.24V23H23.5817V5.49998H25.6467Z" fill="white" />
          </svg>

        </div>
        <div id="googleOAuth-login">
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
          >
            <GoogleLogin
              // buttonText="Log In Using Google"
              onSuccess={onGoogleLoginSuccess}
              onFailure={onGoogleLoginFailure}
            />
          </GoogleOAuthProvider>
        </div>
      </form>
      <div className="login-noaccount flex items-center">
        Don't have an account
        <button className="sign-up" onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  );
};

export default Signin;
