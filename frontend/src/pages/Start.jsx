import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div>
      <div
        className="h-screen pt-8 flex justify-between w-full flex-col bg-red-400 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0BdhNNQETh0wa3sZPTgFptFDfM7X9IojAuA&s')",
        }}
      >
        <img
          className="w-16 ml-8"
          src="https://www.logo.wine/a/logo/Uber/Uber-Logo.wine.svg"
          alt="Uber"
        />

        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-3xl font-bold">Get Started With Uber</h2>

          <Link
            to="/userlogin"
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-7"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
