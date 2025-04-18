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

const RepsAndWeightGraph = (props) => {
  const { uniqueExercises } = props;
  const [colorMap, setColorMap] = useState({});
  const [legendPayload, setLegendPayload] = useState([]);
  const [data, setData] = useState();
  const [selectedType, setSelectedType] = useState('weight');

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

  if (!data) return <></>;
  return (
    <div
      className='highlight-bar-charts'
      style={{ userSelect: 'none', width: '100%' }}
    >
      <button
        type='button'
        className='
		px-4 py-2
		bg-secondary
		text-white
		font-semibold
		rounded-md
		shadow-md

	'
        onClick={zoomOut}
      >
        Zoom Out
      </button>

      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className='
		px-3 py-2
		bg-secondary
		text-gray-200
		border border-secondary
		rounded-md
		pr-8
		ml-3
	'
      >
        <option value='weight'>Weight</option>
        <option value='reps'>Reps</option>
        <option value='both'>Both</option>
      </select>

      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          width={800}
          height={400}
          data={data}
          onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
          onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
          onMouseUp={() => {
            setRefAreaLeft('');
            setRefAreaRight('');
            zoom();
          }}
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
              yAxisId='weight'
              x1={refAreaLeft}
              x2={refAreaRight}
              stroke='rgba(0, 123, 255, 0.8)'
              fill='rgba(0, 123, 255, 0.2)'
              strokeOpacity={0.5}
              ifOverflow='extendDomain'
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RepsAndWeightGraph;
