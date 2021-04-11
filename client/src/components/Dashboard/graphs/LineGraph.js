import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(83,189,229,0.4)',
      borderColor: 'rgba(83,189,229,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(83,189,229,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(83,189,229,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      // data: [65, 59, 80, 81, 56, 55, 40]
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: 'Products',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(244,66,54,0.4)',
      borderColor: 'rgba(244,66,54,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(244,66,54,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(244,66,54,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      // data: [3, 5, 8, 15, 13, 17, 25]
    },
  ],
};

const options = {
  legend: {
    display: false,
  },
};

export default class LineGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVariant: 'outlined',
    };
  }

  render() {
    return (
      <div className='root'>
        <Line data={data} options={options} height={this.props.height} />
      </div>
    );
  }
}
