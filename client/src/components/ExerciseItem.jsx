import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { ContextLocalExercises } from './ContextLocalExercises';

const ExerciseItem = ({ item, addOrDelete }) => {
  const { _id, name, type, difficulty, muscle, equipment, instructions } = item;
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleInstructions = () => setExpanded(!expanded);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const { localExercises, setLocalExercises } = useContext(
    ContextLocalExercises
  );

  return (
    <div className='bg-secondary p-6 rounded-2xl shadow-lg border border-primary mb-4 flex-1 min-w-[250px] max-w-xs'>
      <h3 className='text-2xl font-bold text-primary mb-2'>{name}</h3>
      <p className='text-accent font-semibold'>
        Type: <span className='text-white'>{type}</span>
      </p>
      <p className='text-accent font-semibold'>
        Difficulty: <span className='text-white'>{difficulty}</span>
      </p>
      <p className='text-accent font-semibold'>
        Muscle: <span className='text-white'>{muscle}</span>
      </p>
      <p className='text-accent font-semibold'>
        Equipment: <span className='text-white'>{equipment}</span>
      </p>

      {/* Instructions with popup */}
      <div className='mt-3'>
        <p className='text-white'>
          <button
            onClick={openModal}
            className='text-primary font-semibold hover:underline'
          >
            Show Instructions
          </button>
        </p>
      </div>
      {addOrDelete == 'delete' ? (
        <button
          onClick={() => {
            setLocalExercises(localExercises.filter((e) => e._id != _id));
            // toast.info('Exercise removed');
          }}
        >
          🗑️
        </button>
      ) : (
        <button
          onClick={() => {
            setLocalExercises([...localExercises, item]);
            // toast.success('Exercise added');
          }}
        >
          ➕
        </button>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
        <div className='m-6 fixed inset-0 backdrop-blur-lg flex justify-center items-center'>
          <div className='bg-secondary p-6 rounded-2xl max-w-3xl w-full sm:max-w-4xl md:max-w-5xl'>
            <h3 className='text-xl text-primary font-bold mb-4'>
              Instructions
            </h3>
            <p className='text-white text-lg'>{instructions}</p>
            <button
              onClick={closeModal}
              className='mt-4 bg-accent text-white px-4 py-2 rounded-lg hover:bg-primary-dark'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
