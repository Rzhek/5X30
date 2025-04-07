import React, { useState, useCallback, useEffect } from 'react';
import {
	Label,
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ReferenceArea,
	ResponsiveContainer,
	Legend,
} from 'recharts';

const getAxisYDomain = (data, from, to, ref, offset) => {
	const refData = data.slice(from - 1, to);
	let [bottom, top] = [refData[0][ref], refData[0][ref]];
	refData.forEach((d) => {
		if (d[ref] > top) top = d[ref];
		if (d[ref] < bottom) bottom = d[ref];
	});
	return [(bottom | 0) - offset, (top | 0) + offset];
};

const parseData = (data, uniqueExercises) => {
	const res = [];
	for (let rec of data) {
		const {
			createdAt,
			weight,
			reps,
			forExercise: { name },
		} = rec;
		if (!uniqueExercises.find((e) => e == name)) continue;
		res.push({
			date: new Date(createdAt).getTime(),
			[`${name} (Weight)`]: weight,
			[`${name} (Reps)`]: reps,
		});
	}
	return res;
};

// const groupByExercise = (data) => {
// 	const res = [];
// 	for (let rec of data) {
// 		if (!res.find((x) => x == rec.forExercise.name)) {
// 			res.push(rec.forExercise.name);
// 		}
// 	}
// 	return res;
// };

const getRandomColor = () => {
	return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`; // Generates a random color
};

const Chart = (props) => {
	const { uniqueExercises, selectedType } = props;
	const [colorMap, setColorMap] = useState({});
	const [legendPayload, setLegendPayload] = useState([]);
	const [data, setData] = useState();

	// useEffect(() => {
	// 	if (props.uniqueExercises && props.uniqueExercises.length > 0) {
	// 		setUniqueExercises(props.uniqueExercises);
	// 	}
	// }, [props.uniqueExercises]);

	useEffect(() => {
		setData(parseData(props.data, uniqueExercises));
	}, [uniqueExercises]);

	useEffect(() => {
		const newColorMap = {};
		uniqueExercises.forEach((exercise) => {
			newColorMap[exercise] = getRandomColor();
		});
		setColorMap(newColorMap);

		setLegendPayload(
			uniqueExercises.map((ex) => ({
				value: ex, // Exercise name
				type: 'square', // Legend marker shape
				color: newColorMap[ex], // Assigned color
			}))
		);
	}, [uniqueExercises]);

	const [left, setLeft] = useState('dataMin');
	const [right, setRight] = useState(new Date().getTime() + 10000000);
	const [refAreaLeft, setRefAreaLeft] = useState('');
	const [refAreaRight, setRefAreaRight] = useState('');
	const [top, setTop] = useState('dataMax+50');
	const [bottom, setBottom] = useState('dataMin-1');
	const [top2, setTop2] = useState('dataMax+20');
	const [bottom2, setBottom2] = useState('dataMin-20');

	console.log(uniqueExercises);
	console.log(data);

	const zoom = useCallback(() => {
		if (!refAreaLeft || !refAreaRight || refAreaLeft === refAreaRight) {
			setRefAreaLeft('');
			setRefAreaRight('');
			return;
		}

		let newLeft = Math.min(refAreaLeft, refAreaRight);
		let newRight = Math.max(refAreaLeft, refAreaRight);
		// const [newBottom, newTop] = getAxisYDomain(
		// 	data,
		// 	newLeft,
		// 	newRight,
		// 	'weight',
		// 	1
		// );
		// const [newBottom2, newTop2] = getAxisYDomain(
		// 	data,
		// 	newLeft,
		// 	newRight,
		// 	'reps',
		// 	50
		// );

		setLeft(newLeft);
		setRight(newRight);
		// setBottom(newBottom);
		setTop(newTop);
		// setBottom2(newBottom2);
		setTop2(newTop2);
		setRefAreaLeft('');
		setRefAreaRight('');
	}, [refAreaLeft, refAreaRight]);

	const zoomOut = useCallback(() => {
		setLeft('dataMin');
		setRight('dataMax');
		setTop('dataMax+1');
		setBottom('dataMin-1');
		setTop2('dataMax+20');
		setBottom2('dataMin-20');
		setRefAreaLeft('');
		setRefAreaRight('');
	}, []);

	console.log('??????????!!', uniqueExercises);
	if (!data) return <></>;
	console.log(data);
	return (
		<div
			className='highlight-bar-charts'
			style={{ userSelect: 'none', width: '100%' }}
		>
			<button type='button' className='btn update' onClick={zoomOut}>
				Zoom Out
			</button>

			<ResponsiveContainer width='100%' height={400}>
				<LineChart
					width={800}
					height={400}
					data={data}
					onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
					onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
					onMouseUp={zoom}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis
						allowDataOverflow
						dataKey='date'
						domain={[left, right]}
						type='number'
						tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
					/>
					<YAxis
						allowDataOverflow
						domain={[bottom, top]}
						type='number'
						yAxisId='weight'
					/>
					<YAxis
						orientation='right'
						allowDataOverflow
						domain={[bottom2, top2]}
						type='number'
						yAxisId='reps'
					/>
					<Tooltip />
					<Legend payload={legendPayload} />

					{selectedType === 'reps'
						? ''
						: uniqueExercises.map((group) => (
								<Line
									yAxisId='weight'
									type='monotone'
									dataKey={`${group} (Weight)`}
									animationDuration={300}
									connectNulls={true}
									stroke={colorMap[group]}
								/>
						  ))}
					{selectedType === 'weight'
						? ''
						: uniqueExercises.map((group) => (
								<Line
									yAxisId='reps'
									type='monotone'
									dataKey={`${group} (Reps)`}
									animationDuration={300}
									connectNulls={true}
									stroke={colorMap[group]}
								/>
						  ))}

					{refAreaLeft && refAreaRight ? (
						<ReferenceArea
							yAxisId='1'
							x1={refAreaLeft}
							x2={refAreaRight}
							strokeOpacity={0.3}
						/>
					) : null}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default Chart;
