import { useState } from "react"
import api, { authResponseInterceptor, setupAuthInterceptor } from "../api"
import axios from "axios"
import { AuthFormInputsState, AuthInputElement, AuthFormErrors } from "../types/project-types"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { useNavigate } from "react-router-dom"
import { validatePassword, validateEmailAddress } from "../utils/helpers"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type AuthFormProps = {
  method: string;
  inputs: AuthInputElement[],
  route: string
}
const initialInputState = {
  username: "",
  email: "",
  password: "",
  repeat_password: "",
}
const initialErrors = {
  emailError: "",
  passwordError: "",
  repeatedPasswordError: "",
}

const AuthForm = ({ method, inputs, route }: AuthFormProps) => {
  const [input_values, setInputs] = useState<AuthFormInputsState>(initialInputState);
  const [errors, setErrors] = useState<AuthFormErrors>(initialErrors);
  const navigate = useNavigate();
  const name = method === "login" ? "Login" : "Sign up"

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    });
  }

  const validateForm = () => {
    const curr_errors = [];
    if(!validateEmailAddress(input_values.email)) {
      curr_errors.push("emailError");
      setErrors((prev) => ({
        ...prev,
        emailError: "Please provide a valid email address."
      }));
    }
    if(!validatePassword(input_values.password)) {
      curr_errors.push("passwordError");
      setErrors((prev) => ({
        ...prev,
        passwordError: "Invalid password(Password must contain at least 1 digit or special char and be at least 6 chars long)"
      }));
    }
    if(input_values.password !== input_values.repeat_password) {
      curr_errors.push("repeatPasswordError");
      setErrors((prev) => ({
        ...prev,
        repeatedPasswordError: "Passwords do not match"
      }));
    }
    if(curr_errors.length > 0) { // some error occurred
      setInputs(initialInputState);
      return false;
    }
    return true;
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    let response;
    if(!validateForm()) {
      return;
    }
    if(authResponseInterceptor != null) {
      api.interceptors.response.eject(authResponseInterceptor);  
    }
    if(method === "login") {
      try {
        response = await api.post(route, {
          email: input_values.email,
          password: input_values.password
        });
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate("/");
      } catch(error) {
        if(axios.isAxiosError(error)) {
          if(error.response?.status === 401) { // Unauthorized response
            const error_msg = error.response.data.detail;
            toast.error("Unauthorized: " + error_msg, {
              position: "top-center",
              autoClose: 5000,
              theme: "dark",
              closeOnClick: true,
              pauseOnHover: true,
            }); 
          }
          else { // Server err, invalid connection
            toast.error(`An unexpected(${error.response?.status}) error occurred. Please check your internet connection and try again later.`, {
              position: "top-center",
              autoClose: 5000,
              theme: "dark",
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
        } else {
          console.error(error);
        }
      } finally {
        setInputs(initialInputState);
        setupAuthInterceptor(); // setup interceptor again
      }
    } else { // register route
      try {
        response = await api.post(route, {
          username: input_values.username,
          email: input_values.email,
          password: input_values.password,
        });
        if(response.status === 201) {
          setInputs(initialInputState);
          toast.success("Registration successful! Please check your email to confirm your e-mail address.", {
            position: "top-center",
            autoClose: 5000,
            theme: "dark",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate("/auth/login", {
              replace: true,
            });
          }, 5000);
        }
      } catch(error) {
        if(axios.isAxiosError(error)) {
          console.log(error.response);
        } else {
          console.error(error);
        }
      } finally {
        setInputs(initialInputState);
        setupAuthInterceptor();
      }
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
      <div className='w-11/12 sm:w-9/12 max-w-lg md:max-w-xl lg:max-w-2xl bg-slate-300 px-4 py-3 rounded-md shadow-md shadow-gray-100'>
        <form  
          className='flex flex-col justify-center gap-7 sm:gap-7 lg:gap-8 text-black'
          onSubmit={handleSubmit}
        >
          <h2 className='text-2xl sm:text-3xl text-sky-600 font-serif text-center mb-2 sm:mb-1 mt-2 md:mt-3'>{name}</h2>
          {inputs.map((input: AuthInputElement, i: number) => {
            const isEmail = input.name === "email"
            return (
              <div key={i} className='w-full flex flex-col max-w-lg m-auto'>
                <input
                  onBlur={(e) => {
                    if(input["name"] === "email") {
                      if(!validateEmailAddress(e.target.value)) {
                        setErrors((prev) => ({
                          ...prev,
                          emailError: "Please provide a valid email address."
                        }));
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          emailError: ""
                        }));
                      }
                    } else {
                      if(input.error_name !== undefined && errors[input?.error_name] !== "") {
                        const errorName = input.error_name
                        setErrors((prev) => ({
                          ...prev,
                          [errorName]: ""
                        }));
                      }
                    }
                  }}
                  className={`${input["style"]}  ${isEmail && "peer"} focus:input-custom-focus`}
                  type={input["type"]}
                  name={input["name"]}
                  required
                  placeholder={input["placeholder"]}
                  value={input_values[input.name]}
                  onChange={onInputValueChange}
                />
                {input.error_name !== undefined && errors[input?.error_name] !== "" ? <p className={`${input.error?.style} input-email-invalid`}>{errors[input?.error_name]}</p> : null}
              </div>
            )
          })}
          <button className='w-full max-w-lg m-auto mt-3 text-slate-100 bg-blue-500 hover:bg-blue-600 active:bg-blue-600 rounded-md py-2 md:py-3' type='submit'>
            {name}
          </button>
          {method === "login" && <div className='flex justify-center gap-1 mb-3 mb:m-6'>
            <p>Have you not joined us yet?</p>
            <a className='text-blue-500 hover:text-blue-700' href='/auth/register'>Sign Up</a>
          </div>}
          {method === "register" && <div className='flex justify-center gap-1 mb-3 mb:m-6'>
            <p>Already have an account?</p>
            <a className='text-blue-500 hover:text-blue-700' href='/auth/login'>Sign In</a>
          </div>}
        </form>
        <ToastContainer position="top-center"/>
      </div>
    </div>
  )
}

export default AuthForm