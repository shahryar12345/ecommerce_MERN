import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [
    {
      label: 'This Week',
      backgroundColor: 'rgba(79,206,195,0.7)',
      borderColor: 'rgba(79,206,195,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(79,206,195,1)',
      hoverBorderColor: 'rgba(79,206,195,1)',
      //     data: [30, 85, 23, 53, 28, 90, 30]
    },
    {
      label: 'Last Week',
      backgroundColor: 'rgba(27,154,143,0.7)',
      borderColor: 'rgba(27,154,143,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(27,154,143,1)',
      hoverBorderColor: 'rgba(27,154,143,1)',
      //     data: [65, 59, 80, 81, 56, 55, 40]
    },
  ],
};

const dataDaily = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  datasets: [
    {
      label: 'Earning(AUD):',
      backgroundColor: 'rgba(126,52,137,0.5)',
      borderColor: 'rgba(126,52,137,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(126,52,137,1)',
      hoverBorderColor: 'rgba(126,52,137,1)',
      //   data: [30, 85, 45, 53, 35, 66, 37, 57, 45, 39, 53, 35, 60, 30, 45]
    },
  ],
};

const options = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false, //this will remove all the x-axis grid lines
      },
    ],
    yAxes: [
      {
        display: false,
      },
    ],
  },
};

export default class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVariant: 'outlined',
    };
  }

  render() {
    return (
      <div className='root'>
        <Bar
          data={this.props.secondary ? dataDaily : data}
          //   width={100}
          height={this.props.height}
          options={options}
        />
      </div>
    );
  }
}
