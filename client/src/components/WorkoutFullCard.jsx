export default function WorkoutFullCard({ workout }) {
	const { exercises, name } = workout;
	return (
		<div key={name} className='m-2 p-6 bg-gray-400'>
			<h4>{name}</h4>
			{exercises.map((e) => (
				<div key={`${name}-${e.name}`}>
					<input id={`${name}-${e.name}`} type='checkbox' />
					<label htmlFor={`${name}-${e.name}`}>{e.name}</label>
				</div>
			))}
		</div>
	);
}
