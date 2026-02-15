import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Stats } from '../types';

interface StatsRadarProps {
  stats: Stats;
}

const StatsRadar: React.FC<StatsRadarProps> = ({ stats }) => {
  const data = [
    { subject: 'STR', A: stats.strength, fullMark: 100 },
    { subject: 'AGI', A: stats.agility, fullMark: 100 },
    { subject: 'DEF', A: stats.defense, fullMark: 100 },
    { subject: 'TEC', A: stats.tech, fullMark: 100 },
    { subject: 'PWR', A: stats.energy, fullMark: 100 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Rings */}
      <div className="absolute inset-0 border border-fuchsia-900/20 rounded-full scale-90" />
      <div className="absolute inset-0 border border-dashed border-cyan-900/20 rounded-full scale-75 animate-[spin_60s_linear_infinite]" />

      <div className="w-full h-full font-mono-tech z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke="#701a75" strokeOpacity={0.3} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#d946ef', fontSize: 10, fontFamily: 'Share Tech Mono' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Stats"
              dataKey="A"
              stroke="#d946ef"
              strokeWidth={2}
              fill="#d946ef"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsRadar;