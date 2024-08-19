import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function CompletionChart({ percentage }) {
  const data = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ['#8e7ab5', '#aea0ca'],
        hoverBackgroundColor: ['#9c8abe', '#b9add1'],
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ': ' + context.raw.toFixed(2) + '%';
          },
        },
      },
    },
  };

  return (
    <div className="w-64 h-64 mx-auto">
      <Doughnut data={data} options={options} />
      <div className="text-center mt-4 font-semibold">
        {percentage.toFixed(2)}% Completed
      </div>
    </div>
  );
}

export default CompletionChart;
