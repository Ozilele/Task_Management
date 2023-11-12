import axios from "axios";
import { useState } from "react";
import { backend_url } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(inputs.email === "" || inputs.password === "") {
      return;
    }
    try {
      const response = await axios.post(`${backend_url}/auth/login`, {
        email: inputs.email,
        password: inputs.password
      });
      console.log(response);
      if(response.status === 200) {
        console.log(response.data);
        setInputs({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch(err) {
      console.log("Error ", err);
      if(err.response.status === 401) {
        setError("Invalid data");
      }
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
      <form
        className="w-11/12 sm:w-8/12 max-w-[650px] min-h-[450px] flex flex-col gap-1.5 justify-center px-3 md:px-4 py-2.5 md:py-3.5 bg-zinc-200 rounded-md"
        onSubmit={(e) => onLogin(e)}
      >
        <h2 className="text-2xl text-sky-600 font-serif text-center mb-4 sm:mb-5 mt-3.5 md:mt-5">Login</h2>
        <div className="w-full flex max-w-xl mx-auto flex-col gap-1.5 mb-2.5 text-black">
          <label>Email</label>
          <input 
            type='email'
            name="email"
            className='w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-blue-500'
            onChange={onInputChange}
          />
        </div>
        <div className="w-full flex max-w-xl mx-auto flex-col gap-1.5 mb-2.5 text-black">
          <label>Password</label>
          <input 
            type='password'
            name="password"
            className='w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-blue-500'
            onChange={onInputChange}
          />
        </div>
        <p className="text-rose-500 text-base px-1">{error ? error : ""}</p>
        <button 
          className="w-full mt-auto max-w-md mx-auto px-1.5 py-2 bg-slate-950 rounded-md hover:opacity-90"
          type="submit"
        >
          Login
        </button> 
        <div className="flex justify-center gap-1 mt-2.5 mb-3 text-black">
          <p>Didn't have an account?</p>
          <a className='text-blue-500 hover:text-blue-700' href='/auth/register'>Sign Up</a>
        </div>
      </form>
    </div>
  )
}

export default Login