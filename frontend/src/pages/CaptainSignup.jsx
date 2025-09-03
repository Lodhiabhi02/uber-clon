import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../Context/CaptainContext';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';


const CaptainSignup = () =>
{

  const navigate = useNavigate();


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userData, setUserData] = useState({})
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const { setCaptain, updateCaptain } = React.useContext(CaptainDataContext);




  const submitHandler = async (e) =>
  {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,

      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: (Number(vehicleCapacity)),
        vehicleType: vehicleType
      }
    }
    const url = `${import.meta.env.VITE_BASE_URL}/captains/register`; // ✅ fixed env
    const response = await axios.post(url, newUser);

    if (response.status === 201) {
      console.log(response.data);
      const data = response.data;
      setCaptain(data);
      localStorage.setItem('token', data.token);
      console.log("✅ Signup successful move to home");
      navigate("/captain-home") // Navigate to captain home after successful signup
    }

    console.log("✅ API Response:", response);

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }
  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

          <form onSubmit={(e) =>
          {
            submitHandler(e)
          }}>

            <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) =>
                {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) =>
                {
                  setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) =>
              {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) =>
              {
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />

            <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
            <div className='mb-7'>
              <input
                required
                className='bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                type="text"
                placeholder='Vehicle Color'
                value={vehicleColor}
                onChange={(e) =>
                {
                  setVehicleColor(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                type="text"
                placeholder='Vehicle Plate Number'
                value={vehiclePlate}
                onChange={(e) =>
                {
                  setVehiclePlate(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                type="number"
                placeholder='Vehicle Capacity'
                value={vehicleCapacity}
                onChange={(e) =>
                {
                  setVehicleCapacity(e.target.value)
                }}
              />
              <select
                required
                className='bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                value={vehicleType}
                onChange={(e) =>
                {
                  setVehicleType(e.target.value)
                }}
              >
                <option value="" disabled>Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="motorcycle">Bike</option>
              </select>
            </div>

            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Create Captain Account</button>

          </form>
          <p className='text-center'>Already have a account? <Link to='/captionlogin' className='text-blue-600'>Login here</Link></p>
        </div>
        <div>
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div >
  )
}

export default CaptainSignup;