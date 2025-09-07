import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";

import LookingForSearchPanel from "../components/LookingForSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext";
import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";



const Home = () =>
{
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState(""); // added
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [driverRidePanel, setDriverRidePanel] = useState(false);
  const [waitingfordriver, setWaitingForDriver] = useState(false);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [DistanceAndTime, setDistanceAndTime] = useState({});
  const [vechicleType, setVechicleType] = useState({});
  const [createRideData, setCreateRideData] = useState({});

  const { sendMessage, recievedMessage } = useContext(SocketContext);

  const { user } = useContext(UserDataContext);

  useEffect(() =>
  {
    console.log("User:", user);
    if (user) {
      sendMessage("join", {
        userId: user._id,   
        userType: "user",
      });
    }
  }, [user, sendMessage]);


  const handlePickupChange = async (e) =>
  {
    const value = e.target.value;
    console.log("Input changed:", value); // log input value

    setPickup(value);
    setActiveField("pickup");
    setPanelOpen(true);

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: value },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });



      setPickupSuggestions(res.data.suggestions); // use the suggestions array

    } catch (err) {
      console.error("Pickup suggestions error:", err);
    }
  };


  const handleDestinationChange = async (e) =>
  {
    const value = e.target.value;
    setDestination(value);
    setActiveField("destination");
    setPanelOpen(true);

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: value },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setDestinationSuggestions(res.data.suggestions); // <-- use the suggestions array
    } catch (err) {
      console.error("Destination suggestions error:", err);
    }
  };




  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const confirmRideRef = useRef(null);
  const driverRideRef = useRef(null);
  const waitingfordriverRef = useRef(null);

  const submitHandler = (e) => e.preventDefault();

  // Search panel
  useGSAP(
    () =>
    {
      if (!panelRef.current || !panelCloseRef.current) return;
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
      if (!vehiclePanelRef.current) return;
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
      if (!confirmRideRef.current) return;

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
      if (!driverRideRef.current) return;

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

  useGSAP(
    () =>
    {
      if (!waitingfordriverRef.current) return;

      if (waitingfordriver) {
        gsap.to(driverRideRef.current, {
          y: "0%",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(waitingfordriverRef.current, {
          y: "100%",
          duration: 0.5,
          ease: "power2.in",
        });
      }
    },
    [waitingfordriver]
  );

  async function Findtrip()
  {
    try {
      console.log("🚖 Starting Findtrip function...");

      setVehiclePanelOpen(true);
      setPanelOpen(false);

      const token = localStorage.getItem("token");

      const [fareRes, distanceRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
          params: { pickup, destination },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
          params: { origin: pickup, destination },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setFare(fareRes.data.fare);
      setDistanceAndTime(distanceRes.data);
      console.log("🚖 Fare:", fareRes.data.fare);
      console.log("🚖 Distance and Time:", distanceRes.data);

    } catch (error) {
      console.error("❌ Error in Findtrip:", error.response?.data || error.message);
    }
  }

  async function createRide(vehicleType)
  {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType, // ✅ Fixed typo: "vechicleType" → "vehicleType"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Ride created:", response.data);
      console.log(vechicleType);
      setCreateRideData(response.data.ride);
    } catch (error) {
      console.error("Error creating ride:", error.response?.data || error.message);
    }
  }



  return (
    <div className="h-screen relative overflow-hidden">
      {/* Logo */}
      <img
        className="w-16 absolute left-5 top-5"
        src="https://www.logo.wine/a/logo/Uber/Uber-Logo.wine.svg"
        alt="logo"
      />

      {/* Background */}
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
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
            <div className="line absolute h-16 w-1 bg-gray-700 left-10 rounded-full top-[37%]"></div>

            <input
              onClick={() =>
              {
                setActiveField('pickup');  // mark pickup as active
                setPanelOpen(true);        // open search panel
              }}
              value={pickup}
              onChange={handlePickupChange} // fetch suggestions
              className="bg-[#eee] px-12 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pick up location"
            />

            <input
              onClick={() =>
              {
                setActiveField('destination');  // mark destination as active
                setPanelOpen(true);             // open search panel
              }}
              value={destination}
              onChange={handleDestinationChange} // fetch suggestions
              className="bg-[#eee] px-12 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />

          </form>

          <button onClick={Findtrip} className="bg-black text-white px-3 py-2 rounded-lg w-full mt-4">Find Trip</button>
        </div>

        {/* Search panel */}
        <div ref={panelRef} className="h-[0%] bg-white p-5 overflow-auto">
          {/* <div>{JSON.stringify(activeField === "pickup" ? pickupSuggestions : destinationSuggestions)}</div> */}

          <LookingForSearchPanel
            setVehiclePanel={setVehiclePanelOpen}

            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}

            setPanelOpen={setPanelOpen}

            setPickup={setPickup}

            setDestination={setDestination}

            activeField={activeField}

          />
        </div>
      </div>

      {/* Vehicle panel */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bg-white px-3 py-8 bottom-0 "
      >
        <VehiclePanel
          setVehiclePanel={setVehiclePanelOpen}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleType={setVehicleType}
          fare={fare}
          distanceAndTime={DistanceAndTime}
          createRide={createRide}

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
          vehicleType={vehicleType}
          pickup={pickup}
          destination={destination}
          fare={fare}
        />
      </div>

      {/* Looking for driver panel */}
      <div
        ref={driverRideRef}
        className="fixed w-full z-30 bg-white px-3 py-8 bottom-0 translate-y-full"
      >
        <LookingForDriver
          setDriverRidePanel={setDriverRidePanel}
          vehicleType={vehicleType}
          pickup={pickup}
          destination={destination}
          fare={fare[vehicleType]}   // ✅ only the chosen vehicle fare
        />
      </div>
    </div>
  );
};

export default Home;


