/*
 Template Name: Fonik - Responsive Bootstrap 4 Admin Dashboard
 Author: Themesbrand
 File: Dashboard js
 */

declare const $: any, Morris: any, Chart: any;

export const runDashboard = (dashboardData, nibss = true, plotComparisons = false) => {
  // 'use strict';

  const Dashboard = function () {
  };
  //creates Bar chart
  Dashboard.prototype.createBarChart = function (element, data, xkey, ykeys, labels, lineColors) {
    Morris.Bar({
      element: element,
      data: data,
      xkey: xkey,
      ykeys: ykeys,
      labels: labels,
      gridLineColor: 'darkgrey',
      gridTextColor: '#98a6ad',
      barSizeRatio: 0.2,
      resize: true,
      hideHover: 'auto',
      barColors: lineColors
    });
  },

    //creates area chart
    Dashboard.prototype.createAreaChart = function (element, pointSize, lineWidth, data, xkey, ykeys, labels, lineColors) {
      Morris.Area({
        element: element,
        pointSize: 0,
        lineWidth: 0,
        data: data,
        xkey: xkey,
        ykeys: ykeys,
        labels: labels,
        resize: true,
        gridLineColor: '#eee',
        hideHover: 'auto',
        lineColors: lineColors,
        fillOpacity: .6,
        behaveLikeLine: true
      });
    },

    //creates Donut chart
    Dashboard.prototype.createDonutChart = function (element, data, colors) {
      Morris.Donut({
        element: element,
        data: data,
        resize: true,
        colors: colors,
      });
    },

    Dashboard.prototype.init = function () {

      //creating bar chart
      // const $barData = dashboardData['barData'];

      const $barData = [
        { y: 'ECON', a: 100 },
        { y: 'FAML', a: 75 },
        { y: 'PARL', a: 50 },
        { y: 'PGBA', a: 75 },
        { y: 'PGEX', a: 50 },
        { y: 'PGPL', a: 75 },
        { y: 'SCHN', a: 100 },
        { y: 'STCL', a: 90 },
        { y: 'STEC', a: 75 },
        { y: 'STPR', a: 50 },
        { y: 'TRVL', a: 75 }
      ];
      this.createBarChart('morris-bar-example', $barData, 'y', ['a'], ['Volume'], ['#4B708E']);


      //creating area chart
      const $areaData = [
        { y: '2007', a: 0, b: 0, c: 0 },
        { y: '2008', a: 150, b: 45, c: 15 },
        { y: '2009', a: 60, b: 150, c: 195 },
        { y: '2010', a: 180, b: 36, c: 21 },
        { y: '2011', a: 90, b: 60, c: 360 },
        { y: '2012', a: 75, b: 240, c: 120 },
        { y: '2013', a: 30, b: 30, c: 30 }
      ];
      this.createAreaChart('morris-area-example', 0, 0, $areaData, 'y', ['a', 'b', 'c'], ['Series A', 'Series B', 'Series C'], ['#ccc', '#2f8ee0', '#4bbbce']);

      //creating donut chart
      const $donutData = [
        { label: 'Marketing', value: 12 },
        { label: 'Online', value: 42 },
        { label: 'Offline', value: 20 }
      ];
      this.createDonutChart('morris-donut-example', $donutData, ['#f0f1f4', '#2f8ee0', '#4bbbce']);


    },
    //init
    $.Dashboard = new Dashboard, $.Dashboard.Constructor = Dashboard;
  $.Dashboard.init();
};


export const plotPie = (pieData = { fraud: '', cbn: '' }, nibss = true) => {
  /*
 Template Name: Fonik - Responsive Bootstrap 4 Admin Dashboard
 Author: Themesbrand
 File: Chart js
 */

  const ChartJs = function () {
  };

  ChartJs.prototype.respChart = function (selector, types, data, options) {
    // get selector by context
    // const selector = $('#pie');
    const type = 'Pie';
    const ctx = selector.get(0).getContext('2d');
    // pointing parent container to make chart js inherit its width
    const container = $(selector).parent();

    // enable resizing matter
    $(window).resize(generateChart);

    // this function produce the responsive Chart JS
    function generateChart() {
      // make chart width fit with its container
      // const ww = selector.attr('width', $(container).width());
      switch (type) {
        // case 'Line':
        //     new Chart(ctx, {type: 'line', data: data, options: options});
        //     break;
        // case 'Doughnut':
        //     new Chart(ctx, {type: 'doughnut', data: data, options: options});
        //     break;
        case 'Pie':
          new Chart(ctx, { type: 'pie', data: data, options: options });
          break;
        // case 'Bar':
        //     new Chart(ctx, {type: 'bar', data: data, options: options});
        //     break;
        // case 'Radar':
        //     new Chart(ctx, {type: 'radar', data: data, options: options});
        //     break;
        // case 'PolarArea':
        //     new Chart(ctx, {data: data, type: 'polarArea', options: options});
        //     break;
        default:
          return;
      }
      // Initiate new chart or Redraw

    };
    // run function - render chart at first load
    generateChart();
  },
    //init
    ChartJs.prototype.init = function () {
      //creating lineChart
      const lineChart = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
        datasets: [
          {
            label: 'Sales Analytics',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'rgba(51, 141, 221, 0.2)',
            borderColor: '#2f8ee0',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#2f8ee0',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#2f8ee0',
            pointHoverBorderColor: '#eef0f2',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 55, 30, 80]
          },
          {
            label: 'Monthly Earnings',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'rgba(235, 239, 242, 0.2)',
            borderColor: '#ebeff2',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ebeff2',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ebeff2',
            pointHoverBorderColor: '#eef0f2',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [80, 23, 56, 65, 23, 35, 85, 25, 92, 36]
          }
        ]
      };

      const lineOpts = {
        scales: {
          yAxes: [{
            ticks: {
              max: 100,
              min: 20,
              stepSize: 10
            }
          }]
        }
      };

      // this.respChart($("#lineChart"),'Line',lineChart, lineOpts);

      //donut chart
      const donutChart = {
        labels: [
          'Desktops',
          'Tablets'
        ],
        datasets: [
          {
            data: [300, 210],
            backgroundColor: [
              '#6fd08b',
              '#ebeff2'
            ],
            hoverBackgroundColor: [
              '#6fd08b',
              '#ebeff2'
            ],
            hoverBorderColor: '#fff'
          }]
      };
      // this.respChart($("#doughnut"),'Doughnut',donutChart);


      //Pie chart
      const pieCBN = {
        labels: [
          'Total Amount Involved',
          'Total Actual Loss'
        ],
        datasets: [
          {
            data: pieData.cbn,
            backgroundColor: [
              'red',
              'orange'
            ],
            hoverBackgroundColor: [
              'red',
              'orange'
            ],
            hoverBorderColor: '#fff'
          }]
      };
      const pieFraud = {
        labels: [
          'Total Attempted Value',
          'Total Actual Loss to Bank',
          'Total Actual Loss to Customer'

        ],
        datasets: [
          {
            data: pieData.fraud,
            backgroundColor: [
              'purple',
              'pink',
              'indigo'

            ],
            hoverBackgroundColor: [
              'purple',
              'pink',
              'indigo',
            ],
            hoverBorderColor: '#fff'
          }]
      };

      // if (nibss) {
      //   this.respChart($('#pie'), 'Pie', pieCBN);
      //   this.respChart($('#pie_fraud'), 'Pie', pieFraud);
      // } else {
      //   this.respChart($('#ofiPie'), 'Pie', pieCBN);
      //   this.respChart($('#ofiPieFraud'), 'Pie', pieFraud);
      // }


      //barchart
      const barChart = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Sales Analytics',
            backgroundColor: '#4bbbce',
            borderColor: '#4bbbce',
            borderWidth: 1,
            hoverBackgroundColor: '#4bbbce',
            hoverBorderColor: '#4bbbce',
            data: [65, 59, 81, 45, 56, 80, 50, 20]
          }
        ]
      };
      // this.respChart($("#bar"),'Bar',barChart);


      //radar chart
      const radarChart = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
          {
            label: 'Desktops',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: [65, 59, 90, 81, 56, 55, 40]
          },
          {
            label: 'Tablets',
            backgroundColor: 'rgba(103, 168, 228, 0.2)',
            borderColor: '#67a8e4',
            pointBackgroundColor: '#67a8e4',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#67a8e4',
            data: [28, 48, 40, 19, 96, 27, 100]
          }
        ]
      };
      // this.respChart($("#radar"),'Radar',radarChart);

      //Polar area  chart
      const polarChart = {
        datasets: [{
          data: [
            11,
            16,
            7,
            18
          ],
          backgroundColor: [
            '#77c949',
            '#0097a7',
            '#ffbb44',
            '#f32f53'
          ],
          label: 'My dataset', // for legend
          hoverBorderColor: '#fff'
        }],
        labels: [
          'Series 1',
          'Series 2',
          'Series 3',
          'Series 4'
        ]
      };
      // this.respChart($("#polarArea"),'PolarArea',polarChart);
    },
    $.ChartJs = new ChartJs, $.ChartJs.Constructor = ChartJs;
  $.ChartJs.init();

};


// (window['jQuery']),

//initializing
//   function ($) {
//     'use strict';
//
//   }(window['jQuery']);
