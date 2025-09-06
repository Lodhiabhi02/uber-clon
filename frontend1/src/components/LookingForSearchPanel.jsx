import React from "react";

const LocationSearchPanel = ({
  setVehiclePanel,
  suggestions,
  setPanelOpen,
  setDestination,
  setPickup,
  activeField,
}) =>
{

  const handleSuggestionClick = (suggestion) =>
  {
    // Extract the actual text from suggestion object or use as string
    let locationText = '';

    if (typeof suggestion === 'string') {
      locationText = suggestion;
    } else if (suggestion.description) {
      locationText = suggestion.description;
    } else if (suggestion.place_name) {
      locationText = suggestion.place_name;
    } else if (suggestion.formatted_address) {
      locationText = suggestion.formatted_address;
    } else if (suggestion.display_name) {
      locationText = suggestion.display_name;
    } else {
      // Fallback: stringify the object
      locationText = JSON.stringify(suggestion);
    }

    if (activeField === "pickup") {
      setPickup(locationText);
    } else if (activeField === "destination") {
      setDestination(locationText);
    }

    // setVehiclePanel(true);
    // setPanelOpen(false);
  };

  const renderSuggestion = (suggestion) =>
  {
    if (typeof suggestion === 'string') {
      return suggestion;
    } else if (suggestion.description) {
      return suggestion.description;
    } else if (suggestion.place_name) {
      return suggestion.place_name;
    } else if (suggestion.formatted_address) {
      return suggestion.formatted_address;
    } else if (suggestion.display_name) {
      return suggestion.display_name;
    } else {
      return JSON.stringify(suggestion);
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {activeField === "pickup"
          ? "Start typing to search for pickup locations..."
          : "Start typing to search for destinations..."
        }
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 text-gray-700">
        {activeField === "pickup" ? "Pickup Locations" : "Destinations"}
      </h3>

      {suggestions.map((suggestion, index) => (
        <div
          key={`${activeField}-${index}`}
          onClick={() => handleSuggestionClick(suggestion)}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black hover:border-gray-300 rounded-xl items-center my-2 justify-start cursor-pointer transition-all duration-200"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill text-gray-600"></i>
          </h2>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">
              {renderSuggestion(suggestion)}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;