import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ExerciseGraph = ({ data }) => {
  const exerciseCount = {};

  data.forEach((entry) => {
    const exerciseName = entry.forExercise.name;
    exerciseCount[exerciseName] = (exerciseCount[exerciseName] || 0) + 1;
  });

  const chartData = Object.keys(exerciseCount).map((exerciseName) => ({
    name: exerciseName,
    value: exerciseCount[exerciseName],
  }));

  const generateColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const COLORS = chartData.map(() => generateColor());

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    const radius = outerRadius + 50;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text
          x={x}
          y={y}
          fill='white'
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
          fontSize={20}
        >
          {name}
        </text>
        <text
          x={x}
          y={y + 20}
          fill='white'
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
          fontSize={20}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={225}
            fill='#8884d8'
            dataKey='value'
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExerciseGraph;
