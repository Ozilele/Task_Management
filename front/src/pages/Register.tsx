import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DropdownList from '../components/DropdownList';
import axios from 'axios';
import { backend_url, inputsArr, specializationItems, validateEmailAddress, validatePassword } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

type RegisterInputs = {
  name: string,
  email: string,
  password: string
}

const Register = () => {
  const [inputs, setInputs] = useState<RegisterInputs>({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
  });
  const [stack, setStack] = useState<string>("");
  const [dropdownMenuOpen, setDropdownMenu] = useState<boolean>(false);
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
    if(!validateEmailAddress(inputs.email)) {
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
    if(errors.length > 0) {
      return;
    }
    const response = await axios.post(`${backend_url}/auth/register`, {
      name: inputs.name,
      email: inputs.email,
      stack,
      password: inputs.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response);
    if(response.status === 201) {
      navigate("/auth/login", {
        replace: true,
      });
      setInputs({
        name: "",
        email: "",
        password: "",
      });
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
      <div className='w-11/12 sm:w-9/12 max-w-lg md:max-w-xl lg:max-w-2xl bg-slate-300 px-4 py-3 rounded-md shadow-md shadow-gray-100'>
        <h2 className='text-2xl sm:text-3xl text-sky-600 font-serif text-center mb-5 sm:mb-6 mt-4 md:mt-6'>Sign up</h2>
        <form  
          className='flex flex-col justify-center gap-5 sm:gap-6 lg:gap-7 text-black'
          onSubmit={onFormSubmit}
        >
          {inputsArr.map((input, i) => (
            input.type === "email" ? 
              (
                <div 
                  key={i}
                  className='w-full flex flex-col max-w-lg m-auto gap-1'
                >
                  <input
                    className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-blue-500 ${errors.emailError !== "" ? "border-2 border-rose-500" : "border-2 border-transparent"}`}
                    autoComplete="off"
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    onChange={onInputValueChange}
                  /> 
                  <p className='text-sm lg:text-base px-1 text-red-500'>{errors.emailError !== "" ? errors.emailError : null}</p>
                </div>
              ) : (
                <div 
                  key={i}
                  className='w-full flex max-w-lg m-auto gap-1'
                >
                  <input
                    className='w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-blue-500'
                    autoComplete="off"
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    onChange={onInputValueChange}
                  />
                </div>
              )
            ))}
          <div 
            tabIndex={0}
            onBlur={() => setDropdownMenu(false)}
            onClick={() => setDropdownMenu(!dropdownMenuOpen)} 
            className='w-full relative flex justify-between items-center max-w-lg m-auto gap-1 text-lg bg-white h-11 border-2 border-transparent rounded-md focus:border-blue-500'
          >
            <span className='pl-2'>{stack}</span>
            {dropdownMenuOpen && <ExpandMoreIcon onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='absolute right-1 m-auto' />}
            {!dropdownMenuOpen && <ExpandLessIcon onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='absolute right-1 m-auto' />}
            {dropdownMenuOpen && <DropdownList value={stack} setFunc={setStack} items={specializationItems}/> }
          </div>
          <div className='w-full flex flex-col gap-1 max-w-lg m-auto'>
            <input 
              className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-blue-500 ${errors.passwordError !== "" ? "border-2 border-rose-500" : "border-2 border-transparent"}`}
              type='password'
              name='password'
              placeholder='Password'
              onChange={onInputValueChange}
            />
            <p className='text-sm lg:text-base px-1 text-red-500'>{errors.passwordError !== "" ? errors.passwordError : null}</p>
          </div>
          <button className='w-full max-w-md m-auto text-slate-100 bg-blue-500 rounded-md py-2 md:py-3' type='submit'>
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