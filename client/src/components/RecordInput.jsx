import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { callPost } from '../util/external-api.service';
import { ToastContainer, toast } from 'react-toastify';

export default function RecordInput({ name, id }) {
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const { user, getAccessTokenSilently } = useAuth0();

  const uploadRecord = async () => {
    const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
    const token = await getAccessTokenSilently();
    const res = await callPost({
      url: `${apiServerUrl}/api/addRecord`,
      body: {
        reps: reps,
        weight: weight,
        forExercise: id,
        userEmail: user?.email,
      },
      token: token,
    });
    if (res.status === 200) {
      setWeight(0);
      setReps(0);
    }
    toast.success('Record added');
  };

  return (
    <div
      key={name}
      className='bg-gray-700 p-4 md:p-6 rounded-lg shadow-lg mb-4'
    >
      {' '}
      <h4 className='text-lg font-semibold text-gray-100 mb-4'>{name}</h4>{' '}
      <div className='flex flex-wrap items-end gap-4'>
        <div className='flex-grow min-w-[80px]'>
          <label
            htmlFor={`${name}-weight`}
            className='block text-sm font-medium text-gray-300 mb-1'
          >
            Weight (kg/lb)
          </label>
          <input
            id={`${name}-weight`}
            type='number'
            placeholder='0'
            className='w-full px-3 py-2 border border-gray-500 bg-gray-600 text-gray-100 rounded-md shadow-sm focus:ring-accent focus:border-accent focus:bg-gray-500'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className='flex-grow min-w-[80px]'>
          <label
            htmlFor={`${name}-reps`}
            className='block text-sm font-medium text-gray-300 mb-1'
          >
            Reps
          </label>
          <input
            id={`${name}-reps`}
            type='number'
            placeholder='0'
            className='w-full px-3 py-2 border border-gray-500 bg-gray-600 text-gray-100 rounded-md shadow-sm focus:ring-accent focus:border-accent focus:bg-gray-500'
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </div>

        <button
          onClick={uploadRecord}
          className='px-4 py-2 bg-primary text-white rounded-md font-semibold shadow-sm hover:bg-opacity-85 transition duration-150 ease-in-out whitespace-nowrap'
        >
          Record Set
        </button>
      </div>
    </div>
  );
}
