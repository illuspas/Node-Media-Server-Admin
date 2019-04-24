import React, { Component } from 'react';
import { Card, Table } from "antd";
import { secondsToDhmsSimple } from "./Util";

const columns = [{
  title: 'App',
  dataIndex: 'app',
  key: 'app',
}, {
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
}, {
  title: 'IP',
  dataIndex: 'ip',
  key: 'ip',
}, {
  title: 'Audio',
  children: [{
    title: 'codec',
    dataIndex: 'ac',
    key: 'ac',
  }, {
    title: 'freq',
    dataIndex: 'freq',
    key: 'freq',
  }, {
    title: 'chan',
    dataIndex: 'chan',
    key: 'chan',
  },
  ]
}, {
  title: 'Video',
  children: [{
    title: 'codec',
    dataIndex: 'vc',
    key: 'vc',
  }, {
    title: 'size',
    dataIndex: 'size',
    key: 'size',
  }, {
    title: 'fps',
    dataIndex: 'fps',
    key: 'fps',
  },]
},
{
  title: 'Time',
  dataIndex: 'time',
  key: 'time',
}, {
  title: 'Clients',
  dataIndex: 'clients',
  key: 'clients',
}];

class Streams extends Component {

  state = {
    streamsData: [],
    loading: false,
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    this.setState({ loading: true });
    fetch('/api/streams', {
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then((data) => {
      // Read total count from server
      let streamsData = [];
      let index = 0;
      for (let app in data) {
        for (let name in data[app]) {
          let stream = data[app][name].publisher;
          let clients = data[app][name].subscribers;
          if (stream) {
            let now = new Date().getTime() / 1000;
            let str = new Date(stream.connectCreated).getTime() / 1000;
            let streamData = {
              key: index++,
              app,
              name,
              id: stream.clientId,
              ip: stream.ip,
              ac: stream.audio ? stream.audio.codec + " " + stream.audio.profile : "",
              freq: stream.audio ? stream.audio.samplerate : "",
              chan: stream.audio ? stream.audio.channels : "",
              vc: stream.video ? stream.video.codec + " " + stream.video.profile : "",
              size: stream.video ? stream.video.width + "x" + stream.video.height : "",
              fps: stream.video ? Math.floor(stream.video.fps) : "",
              time: secondsToDhmsSimple(now - str),
              clients: clients.length
            };
            streamsData.push(streamData);
          }

        }


      }

      this.setState({
        loading: false,
        streamsData,
      });
    }).catch(e => {
      this.setState({
        loading: false,
      });
    });
  }


  render() {
    return (
      <Card>
        <Table dataSource={this.state.streamsData} columns={columns} bordered small pagination={false} />
      </Card>
    );
  }
};

export default Streams;