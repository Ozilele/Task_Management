import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DropdownList from '../components/DropdownList';
import axios from 'axios';
import { backend_url } from '../utils/helpers';

type RegisterInputs = {
  name: string,
  email: string,
  password: string
}

const inputsArr = [
  {
    name: "name",
    placeholder: "Name",
    type: 'text'
  },
  {
    name: "email",
    placeholder: "Email",
    type: "email"
  }
]

const specializationItems = [
  "Frontend", "Backend", "UX/UI", "DevOps"
];

const Register = () => {
  const [inputs, setInputs] = useState<RegisterInputs>({
    name: '',
    email: '',
    password: ''
  });
  const [stack, setStack] = useState<string>("");
  const [dropdownMenuOpen, setDropdownMenu] = useState<boolean>(false);

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
    const response = axios.post(`${backend_url}/auth/register`, {
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
  }

  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
      <div className='w-11/12 sm:w-9/12 max-w-lg md:max-w-xl lg:max-w-2xl bg-slate-200 px-4 py-3 rounded-md shadow-md shadow-gray-100'>
        <h2 className='text-2xl sm:text-3xl text-sky-600 font-serif text-center mb-5 sm:mb-6 mt-4 md:mt-6'>Sign up</h2>
        <form  
          className='flex flex-col justify-center gap-5 sm:gap-6 lg:gap-7 text-black'
          onSubmit={onFormSubmit}
        >
          {inputsArr.map((input) => {
            return (
              <div className='w-full flex max-w-lg m-auto gap-1'>
                <input
                  className='w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-blue-500'
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  onChange={onInputValueChange}
                />
              </div>
            )
          })}
          <div onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='w-full relative flex justify-between items-center max-w-lg m-auto gap-1'>
            <input 
              className='w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-blue-500'
              type='text'
              name='stack'
              placeholder='Stack'
              value={stack}
            />
            {dropdownMenuOpen && <ExpandMoreIcon onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='absolute right-1 m-auto' />}
            {!dropdownMenuOpen && <ExpandLessIcon onClick={() => setDropdownMenu(!dropdownMenuOpen)} className='absolute right-1 m-auto' />}
            {dropdownMenuOpen && <DropdownList isOpen={dropdownMenuOpen} setFunc={setStack} items={specializationItems} />}
          </div>
          <div className='w-full flex gap-1 max-w-lg m-auto'>
            <input 
              className='w-full px-1.5 sm:px-2 py-1.5 sm:py-2 lg:py-2.5 lg:px-2.5 rounded-md text-lg focus:outline-blue-500'
              type='password'
              name='password'
              placeholder='Password'
              onChange={onInputValueChange}
            />
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