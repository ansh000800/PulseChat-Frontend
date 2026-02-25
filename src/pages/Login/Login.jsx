import React, { useState, useEffect } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const Login = ({ setLoggedInUser }) => {
  const [currState, setCurrState] = useState("Sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
    if (loggedInUser) {
      navigate("/chat", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;
      if (currState === "Sign up") {
        ({ data } = await API.post("/auth/register", {
          name,
          email,
          password,
        }));
      } else {
        ({ data } = await API.post("/auth/login", { email, password }));
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoggedInUser(data); // 🔥 IMPORTANT
      navigate("/chat");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{currState}</h2>

        {currState === "Sign up" && (
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {currState === "Sign up" ? "Sign Up" : "Login"}
        </button>

        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Sign up" ? (
          <div className="login-forgot">
            <p className="login-toggle">
              Already have an account?
              <span onClick={() => setCurrState("Login")}> Click here</span>
            </p>
          </div>
        ) : (
          <div className="login-forgot">
            <p className="login-toggle">
              New to ChatApp?
              <span onClick={() => setCurrState("Sign up")}> Click here</span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
