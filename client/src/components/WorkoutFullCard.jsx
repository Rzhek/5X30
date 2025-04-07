import { useEffect, useState } from 'react';

export default function WorkoutFullCard({
  workout,
  uniqueExercises,
  setUniqueExercises,
}) {
  const { exercises, name } = workout;
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (exercises) {
      setSelected((prevSelected) => {
        const newSelected = { ...prevSelected };
        exercises.forEach((e) => {
          newSelected[e.name] = false;
        });
        return newSelected;
      });
    }
  }, [exercises]);

  return (
    <div key={name} className='p-4 bg-secondary rounded-lg shadow-md mb-5 mt-3'>
      <h4 className='text-lg font-semibold text-gray-100 mb-3 border-b border-gray-600 pb-2'>
        {name}
      </h4>
      {exercises.map((e) => (
        <div key={`${name}-${e.name}`} className='flex items-center group'>
          <input
            id={`${name}-${e.name}`}
            type='checkbox'
            checked={selected[e.name]}
            className='h-4 w-4 rounded border-gray-500 bg-gray-600 cursor-pointer'
            onChange={() => {
              setSelected((prev) => ({
                ...prev,
                [e.name]: !prev[e.name],
              }));
              setUniqueExercises((prev) =>
                selected[e.name]
                  ? prev.filter((ex) => ex !== e.name)
                  : [...prev, e.name]
              );
            }}
          />
          <label
            className='ml-3 text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-150 cursor-pointer'
            htmlFor={`${name}-${e.name}`}
          >
            {e.name}
          </label>
        </div>
      ))}
    </div>
  );
}
