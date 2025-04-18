import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin4321") {
      navigate("/manage-maills");
    } else {
      setError("ชื่อผู้ใช้หรือรหัสผ่านผิด");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="justify-center items-center flex mt-28">
      <div className="card  bg-base-100 shadow-sm p-5">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs mt-2">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-full mt-4" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
