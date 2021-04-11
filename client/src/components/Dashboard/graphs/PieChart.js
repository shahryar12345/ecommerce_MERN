import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

const data = {
  labels: ['Delivered', 'Pending Delivery', 'Pending Confirmation'],
  datasets: [
    {
      //   data: [123, 241, 24],
      backgroundColor: ['rgb(255,123,0)', 'rgb(254,210,1)', 'rgb(255,163,0)'],
      borderColor: 'transparent',
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

export default class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVariant: 'outlined',
    };
  }

  render() {
    return (
      <div className='root'>
        <Doughnut
          data={data}
          //   width={100}
          height={this.props.height}
          options={options}
        />
      </div>
    );
  }
}
