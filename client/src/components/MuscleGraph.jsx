import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const MuscleGraph = ({ data }) => {
  const muscles = {};

  data.forEach((item) => {
    const muscle = item.forExercise.muscle;
    if (!muscles[muscle]) {
      muscles[muscle] = { muscle, count: 0 };
    }
    muscles[muscle].count += 1;
  });

  const chartData = Object.values(muscles).map((muscle) => ({
    subject: muscle.muscle,
    A: muscle.count,
    fullMark: 150,
  }));

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ResponsiveContainer width='100%' height='100%'>
        <RadarChart cx='50%' cy='50%' outerRadius='80%' data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey='subject' />
          {/* <PolarRadiusAxis angle={-30} /> */}
          <Radar
            name='Muscle Data'
            dataKey='A'
            stroke='#8884d8'
            fill='#8884d8'
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleGraph;
