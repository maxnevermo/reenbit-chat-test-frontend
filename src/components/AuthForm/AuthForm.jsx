import { useState } from "react";

import styles from "./AuthForm.module.css";
import FormInput from "../FormInput/FormInput";
import { ReactSVG } from "react-svg";

import GoogleIcon from "../../assets/icons/google.svg";
import FacebookIcon from "../../assets/icons/facebook.svg";
import { useNavigate } from "react-router";

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegistering
      ? {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }
      : {
          email: form.email,
          password: form.password,
        };

    const res = await fetch(import.meta.env.VITE_API_URL + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Помилка автентифікації");
    } else {
      navigate("/chats");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_API_URL + "/api/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = import.meta.env.VITE_API_URL + "/api/auth/facebook";
  };

  return (
    <div className={styles["auth-container"]}>
      <h1>{isRegistering ? "Sign up" : "Login"}</h1>
      <form className={styles["auth-form"]} onSubmit={handleSubmit}>
        {isRegistering && (
          <>
            <FormInput
              form={form}
              handleChange={handleChange}
              label="First Name"
              name="firstName"
              type="text"
              placeholder="John"
              required
            />
            <FormInput
              form={form}
              handleChange={handleChange}
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Doe"
              required
            />
          </>
        )}
        <FormInput
          form={form}
          handleChange={handleChange}
          label="Email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          required
        />
        <FormInput
          form={form}
          handleChange={handleChange}
          label="Password"
          name="password"
          type="password"
          placeholder="**********"
          required
        />
        <button className={styles["submit-button"]} type="submit">
          {isRegistering ? "Register" : "Sign in"}
        </button>
      </form>
      <p>
        {isRegistering
          ? "Already have an account?"
          : "Don't have an account yet?"}{" "}
        <button
          className={styles["accent-element"]}
          type="button"
          onClick={toggleMode}
        >
          {isRegistering ? "Sign in" : "Register"}
        </button>
      </p>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <div className={styles["social-login-buttons"]}>
        <button title="Login via Google" onClick={handleGoogleLogin}>
          <ReactSVG src={GoogleIcon} />
        </button>
        <button title="Login via Facebook" onClick={handleFacebookLogin}>
          <ReactSVG src={FacebookIcon} />
        </button>
      </div>
    </div>
  );
}
