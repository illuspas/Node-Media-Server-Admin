import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { bytesToBand } from "./Util";
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';


function getOption(name) {
  return {
    title: {
      text: name
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        max: 100,
      }
    ],
    series: [
      {
        name: name,
        type: 'line',
        areaStyle: { normal: {} },
        data: []
      },
    ]
  };
}

function getConnOption() {
  return {
    title: {
      text: "Connections"
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Rtmp', 'Http', 'WebSocket']
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
      }
    ],
    series: [
      {
        name: "Rtmp",
        type: 'line',
        data: []
      },
      {
        name: "Http",
        type: 'line',
        data: []
      },
      {
        name: "WebSocket",
        type: 'line',
        data: []
      },
    ]
  };
}

function getNetOption() {
  return {
    title: {
      text: 'Network Bandwidth',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false
      }
    },
    axisPointer: {
      link: { xAxisIndex: 'all' }
    },
    legend: {
      data: ['Input', 'Output']
    },
    grid: [{
      left: 50,
      right: 50,
      height: '35%'
    }, {
      left: 50,
      right: 50,
      top: '55%',
      height: '35%'
    }],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: [],
        show: false,
      },
      {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: [],
        position: 'bottom'
      }
    ],
    yAxis: [
      {
        name: 'Mbps',
        type: 'value',
      },
      {
        gridIndex: 1,
        type: 'value',
        inverse: true
      }
    ],
    series: [
      {
        name: 'Input',
        type: 'line',
        data: []
      },
      {
        name: 'Output',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: []
      }
    ]
  };
}

class Dashboard extends Component {
  count = 0;
  lastInBytes = 0;
  lastOtBytes = 0;

  state = {
    cpuOption: getOption('CPU Usage'),
    memOption: getOption('Memory Usage'),
    conOption: getConnOption(),
    netOption: getNetOption(),
  };

  componentDidMount() {
    this.fetch();
    this.timer = setInterval(this.fetch, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  fetch = () => {
    fetch('/api/server', {
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then((data) => {
      this.lastInBytes = this.lastInBytes || data.net.inbytes;
      this.lastOtBytes = this.lastOtBytes || data.net.outbytes;

      let now = new Date();
      let axisData = now.toLocaleTimeString().replace(/^\D*/, '');

      let cpuOption = { ...this.state.cpuOption };
      let memOption = { ...this.state.memOption };
      let conOption = { ...this.state.conOption };
      let netOption = { ...this.state.netOption };

      if (this.count++ > 30) {
        cpuOption.xAxis[0].data.shift();
        cpuOption.series[0].data.shift();

        memOption.xAxis[0].data.shift();
        memOption.series[0].data.shift();

        conOption.xAxis[0].data.shift();
        conOption.series[0].data.shift();
        conOption.series[1].data.shift();
        conOption.series[2].data.shift();

        netOption.xAxis[0].data.shift();
        netOption.xAxis[1].data.shift();
        netOption.series[0].data.shift();
        netOption.series[1].data.shift();
      }

      cpuOption.uptime = now;
      cpuOption.xAxis[0].data.push(axisData);
      cpuOption.series[0].data.push(data.cpu.load);

      memOption.uptime = now;
      memOption.xAxis[0].data.push(axisData);
      memOption.series[0].data.push((100 - 100 * data.mem.free / data.mem.totle).toFixed(2));

      conOption.uptime = now;
      conOption.title.text = "Connections " + (data.clients.rtmp + data.clients.http + data.clients.ws);
      conOption.xAxis[0].data.push(axisData);
      conOption.series[0].data.push(data.clients.rtmp);
      conOption.series[1].data.push(data.clients.http);
      conOption.series[2].data.push(data.clients.ws);

      netOption.uptime = now;
      netOption.xAxis[0].data.push(axisData);
      netOption.xAxis[1].data.push(axisData);
      netOption.series[0].data.push(bytesToBand((data.net.inbytes - this.lastInBytes) / 2));
      netOption.series[1].data.push(bytesToBand((data.net.outbytes - this.lastOtBytes) / 2));
      this.lastInBytes = data.net.inbytes;
      this.lastOtBytes = data.net.outbytes;
      this.setState({ cpuOption, memOption, conOption, netOption });
    }).catch(e => {
    });
  }

  render() {

    return (
      <Row style={{ margin: "0 -12px" }}>
        <Col span={12} style={{ padding: "0 12px" }}>
          <Card>
            <ReactEchartsCore
              echarts={echarts}
              ref='echarts_react'
              option={this.state.conOption}
              style={{ height: '348px', width: '100%' }}
            />
          </Card>

        </Col>
        <Col span={12} style={{ padding: "0 12px" }}>
          <Card>
            <ReactEchartsCore
              echarts={echarts}
              ref='echarts_react'
              option={this.state.netOption}
              style={{ height: '348px', width: '100%' }}
            />
          </Card>
        </Col>

        <Col span={12} style={{ padding: "0 12px", marginTop: "16px" }}>
          <Card>
            <ReactEchartsCore
              echarts={echarts}
              ref='echarts_react'
              option={this.state.cpuOption}
              style={{ height: '300px', width: '100%' }}
            />
          </Card>
        </Col>
        <Col span={12} style={{ padding: "0 12px", marginTop: "16px" }}>
          <Card>
            <ReactEchartsCore
              echarts={echarts}
              ref='echarts_react'
              option={this.state.memOption}
              style={{ height: '300px', width: '100%' }}
            />
          </Card>
        </Col>
      </Row>

    );
  }

}

export default Dashboard;
