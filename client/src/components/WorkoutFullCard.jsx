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

	console.log('SELECTED', selected, uniqueExercises);
	return (
		<div key={name} className='m-2 p-6 bg-gray-400'>
			<h4>{name}</h4>
			{exercises.map((e) => (
				<div key={`${name}-${e.name}`}>
					<input
						id={`${name}-${e.name}`}
						type='checkbox'
						checked={selected[e.name]}
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
					<label htmlFor={`${name}-${e.name}`}>{e.name}</label>
				</div>
			))}
		</div>
	);
}
