import React, { useState } from "react";
import logo from "../images/LogoBinus.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [getToken, setToken] = useState("");
  const [role, setRole] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8080/admin/login", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        password: password,
      }),
      headers: {
        "Content-type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setRole(data.result[0].AdminRole);

          setToken();
          sessionStorage.setItem("jwt", data.token);

          if (role == "LSC") {
            navigate("/home-lsc");
          } else if (role == "SPV") {
            navigate("/manager-dashboard");
          }
        } else {
          setErrMsg(data.msg);
        }
      });
  };

  return (
    <div className="h-screen bg-gradient-to-r from-[#57CDFF] to-[#038ACA] flex justify-center items-center">
      <div className="container w-[300px] bg-white rounded">
        <form onSubmit={login}>
          <div className="flex justify-center">
            <img src={logo} alt="image login" />
          </div>
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-[#0098E2] rounded w-full px-2 py-1"
            />
          </div>
          <div className="px-4 py-2">
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-[#0098E2] rounded w-full px-2 py-1"
            />
          </div>
          <div className="px-4 py-2 flex justify-center">
            <button className="flex justify-center bg-[#F08700] w-[100px] py-1 rounded text-[#ffff] font-bold">
              Login
            </button>
          </div>
          <div
            className={
              errMsg != "" &&
              `mx-4 my-2 py-1 text-center bg-red-500 text-white rounded`
            }
          >
            {errMsg != "" && <p>{errMsg}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
