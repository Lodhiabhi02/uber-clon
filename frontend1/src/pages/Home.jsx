import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";

import LookingForSearchPanel from "../components/LookingForSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const Home = () =>
{
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState(""); // added
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [driverRidePanel, setDriverRidePanel] = useState(false);

  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const confirmRideRef = useRef(null);
  const driverRideRef = useRef(null);

  const submitHandler = (e) => e.preventDefault();

  // Search panel
  useGSAP(
    () =>
    {
      if (panelOpen) {
        gsap.to(panelRef.current, { height: "70%", padding: 20 });
        gsap.to(panelCloseRef.current, { opacity: 1 });
      } else {
        gsap.to(panelRef.current, { height: "0%", padding: 0 });
        gsap.to(panelCloseRef.current, { opacity: 0 });
      }
    },
    [panelOpen]
  );

  // Vehicle panel
  useGSAP(
    () =>
    {
      if (vehiclePanelOpen) {
        gsap.to(vehiclePanelRef.current, {
          y: "0%",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          y: "100%",
          duration: 0.5,
          ease: "power2.in",
        });
      }
    },
    [vehiclePanelOpen]
  );

  // Confirm ride panel
  useGSAP(
    () =>
    {
      if (confirmRidePanel) {
        gsap.to(confirmRideRef.current, {
          y: "0%",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(confirmRideRef.current, {
          y: "100%",
          duration: 0.5,
          ease: "power2.in",
        });
      }
    },
    [confirmRidePanel]
  );

  // Driver searching panel
  useGSAP(
    () =>
    {
      if (driverRidePanel) {
        gsap.to(driverRideRef.current, {
          y: "0%",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(driverRideRef.current, {
          y: "100%",
          duration: 0.5,
          ease: "power2.in",
        });
      }
    },
    [driverRidePanel]
  );

  // Ride creation API
  async function createRide()
  {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Ride created:", response.data);
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Logo */}
      <img
        className="w-16 absolute left-5 top-5"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2O8wUs3nqWEqeyv2pgoS5IVjRdop5vpGTr43cu6eTGRgFRtoZFzaLg3pgWMLXZUlmt10&usqp=CAU"
        alt="logo"
      />

      {/* Background */}
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
          alt="background"
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col justify-end absolute h-screen top-0 w-full">
        {/* Top form */}
        <div className="h-[30%] p-5 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 right-6 top-1 text-2xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-fill"></i>
          </h5>

          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <form onSubmit={submitHandler}>
            <div className="line absolute h-16 w-1 bg-gray-700 left-10 rounded-full top-[47%]"></div>

            <input
              onClick={() => setPanelOpen(true)}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="bg-[#eee] px-12 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pick up location"
            />

            <input
              onClick={() => setPanelOpen(true)}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-[#eee] px-12 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
        </div>

        {/* Search panel */}
        <div ref={panelRef} className="h-[0%] bg-white p-5 overflow-auto">
          <LookingForSearchPanel setVehiclePanel={setVehiclePanelOpen} />
        </div>
      </div>

      {/* Vehicle panel */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bg-white px-3 py-8 bottom-0 translate-y-full"
      >
        <VehiclePanel
          setVehiclePanel={setVehiclePanelOpen}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleType={setVehicleType}
        />
      </div>

      {/* Confirm ride panel */}
      <div
        ref={confirmRideRef}
        className="fixed w-full z-20 bg-white px-3 py-8 bottom-0 translate-y-full"
      >
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setDriverRidePanel={setDriverRidePanel}
          createRide={createRide}
        />
      </div>

      {/* Looking for driver panel */}
      <div
        ref={driverRideRef}
        className="fixed w-full z-30 bg-white px-3 py-8 bottom-0 translate-y-full"
      >
        <LookingForDriver setDriverRidePanel={setDriverRidePanel} />
      </div>
    </div>
  );
};

export default Home;


