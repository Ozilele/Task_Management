import React, { useState } from 'react'
import api from '../api';
import { inputsArr, validateEmailAddress, validatePassword } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

type RegisterInputs = {
  username: string,
  email: string,
  password: string,
  repeat_password: string
}
const Register = () => {
  const [inputs, setInputs] = useState<RegisterInputs>({
    username: '',
    email: '',
    password: '',
    repeat_password: '',
  });
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    repeatedPasswordError: "",
  });
  const navigate = useNavigate();

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    });
  }

  const onFormSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = [];
    if(!validateEmailAddress(inputs.email)) { // first form check
      errors.push("emailError");
      setErrors((prev) => ({
        ...prev,
        emailError: "Invalid email address"
      }));
    }
    if(!validatePassword(inputs.password)) {
      errors.push("passwordError");
      setErrors((prev) => ({
        ...prev,
        passwordError: "Invalid password(Password must contain at least 1 digit or special char and be at least 6 chars long)"
      }));
    }
    if(inputs.password !== inputs.repeat_password) {
      errors.push("repeatPasswordError");
      setErrors((prev) => ({
        ...prev,
        repeatedPasswordError: "Passwords do not match"
      }));
    }
    if(errors.length > 0) {
      return;
    }
    const response = await api.post("/api/auth/register/", {
      username: inputs.username,
      email: inputs.email,
      password: inputs.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response);
    if(response.status === 201) { // successful response from server
      navigate("/auth/login", {
        replace: true,
      });
      setInputs({
        username: "",
        email: "",
        password: "",
        repeat_password: "",
      });
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
      <div className='w-11/12 sm:w-9/12 max-w-lg md:max-w-xl lg:max-w-2xl bg-slate-300 px-4 py-3 rounded-md shadow-md shadow-gray-100'>
        <form  
          className='flex flex-col justify-center gap-7 sm:gap-7 lg:gap-8 text-black'
          onSubmit={onFormSubmit}
        >
          <h2 className='text-2xl sm:text-3xl text-sky-600 font-serif text-center mb-2 sm:mb-1 mt-2 md:mt-3'>Sign up</h2>
          {inputsArr.map((input, i) => {
            const isEmailInput = input.type === "email";
            const commonInputClass = `w-full px-1.5 sm:px-2 py-1.5 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-none !important focus:border-sky-500 !important focus:ring-1 focus:ring-sky-500 ${isEmailInput ? 'peer invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500' : ''}`;
            return (
              <div key={i} className='w-full flex flex-col max-w-lg m-auto'>
                <input
                  className={`${commonInputClass}`}
                  autoComplete="off"
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  onChange={onInputValueChange}
                />
                {isEmailInput && (
                  <p className='text-sm invisible peer-invalid:visible lg:text-base px-1 text-red-500'>Please provide a valid email address.</p>
                )}
              </div>
            )
          })}
          <div className='w-full flex flex-col gap-1 max-w-lg m-auto'>
            <input 
              className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${errors.passwordError !== "" ? "border-2 border-rose-500" : "border-2 border-transparent"}`}
              type='password'
              name='password'
              placeholder='Password'
              onChange={onInputValueChange}
            />
            <p className='text-sm lg:text-base px-1 text-red-500'>{errors.passwordError !== "" && errors.passwordError}</p>
          </div>
          <div className='w-full flex flex-col gap-1 max-w-lg m-auto'>
            <input 
              className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${errors.repeatedPasswordError !== "" ? "border-2 border-rose-500" : "border-2 border-transparent"}`}
              type='password'
              name='repeat_password'
              placeholder='Repeat Password'
              onChange={onInputValueChange}
            />
            <p className='text-sm lg:text-base px-1 text-red-500'>{errors.repeatedPasswordError !== "" && errors.repeatedPasswordError}</p>
          </div>
          <button className='w-full max-w-lg m-auto mt-3 text-slate-100 bg-blue-500 hover:bg-blue-600 rounded-md py-2 md:py-3' type='submit'>
            Sign Up
          </button>
          <div className='flex justify-center gap-1 mb-3 mb:m-6'>
            <p>Already have an account?</p>
            <a className='text-blue-500 hover:text-blue-700' href='/auth/login'>Sign In</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register