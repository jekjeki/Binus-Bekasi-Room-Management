import { useState } from "react";
import logo from "../images/LogoBinus.png";
import { useNavigate } from "react-router-dom";
import "../style/background.css";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // const [getToken, setToken] = useState("");
  const [role, setRole] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:${process.env.PORT}/admin/login`, {
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
          console.log(data.result[0].AdminRole)
          setRole(data.result[0].AdminRole);

          sessionStorage.setItem("jwt", data.token);
          

          if (role === "LSC") {
            navigate("/home-lsc");
          } else if (role === "SPV") {
            navigate("/manager-dashboard");
          }
          else if(role == "BM"){
            navigate("/home-lsc")
          }
        } else {
          setErrMsg(data.msg);
        }
      });
  };

  return (
    <div className="h-screen my-bg ">
      <div className="my-bg-img w-[100%] h-[100%] flex justify-center items-center"> 
      <div className="container w-[400px]  p-[40px]  bg-container ">
        <form onSubmit={login}>
          <div className="flex justify-center">
            <img src={logo} alt="image login" />
          </div>
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-[#0098E2] rounded-[10px] w-full px-4 py-2 text-black"
            />
          </div>
          <div className="px-4 py-2 ">
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-[#0098E2] rounded-[10px] w-full px-4 py-2 text-black"
            />
          </div>
          <div className="px-4 py-2 flex justify-center">
            <button onClick={(e)=>login(e)} className="flex justify-center bg-[#F08700] w-[140px]  py-2 rounded-[30px] text-[#ffff] font-medium">
              Login
            </button>
          </div>
          <div
            className={
              errMsg != "" &&
              `mx-4 my-2 py-1 text-center bg-red-500 text-black rounded`
            }
          >
            {errMsg != "" && <p>{errMsg}</p>}
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}

export default Login;
