import React from 'react'
const LocataionSearchPanel = () =>
{
  const locations = [
    { id: 1, name: '24B , Near Kapoor\'s cafe, chemic inductires area' },
    { id: 2, name: 'Sector 18, Noida area north' },
    { id: 3, name: 'Noida Expressway  this is lorem' },
    { id: 4, name: 'Film City, Noida this also lore,' },
    { id: 5, name: 'Sector 11, Noida it is alos lorem' },
  ]

  return (
    <div>

      {
        locations.map((location) => (
          <div key={location.id} className="flex gap-4  items-center my-2 justify-center">
            <h2 className="bg-[#eee] h-8 flex items-center justify=center w-11 "></h2>
            <h4 className="font-medium">{location.name}</h4>
          </div>
        ))
      }

    </div>
  )
}

export default LocataionSearchPanel;
