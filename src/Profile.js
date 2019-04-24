import React, { Component, Fragment } from 'react';
import { Card, Icon, Table } from "antd";
import { bytesToSize, secondsToDhms } from "./Util";

const columns = [{
    dataIndex: 'name',
    key: 'name',
    width: 200
}, {
    dataIndex: 'value',
    key: 'value',
}];

class Profile extends Component {

    state = {
        data: [],
        loading: false,
    };

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        this.setState({ loading: true });
        fetch('/api/server', {
            credentials: 'include'
        }).then(function (response) {
            return response.json();
        }).then((data) => {
            // Read total count from server
            let osInfo = { key: 0, name: 'OS', value: data.os.arch + "_" + data.os.platform + "_" + data.os.release };
            let cpuInfo = { key: 1, name: "CPU", value: data.cpu.num + " x " + data.cpu.model };
            let memInfo = { key: 2, name: "Memory", value: bytesToSize(data.mem.totle) };
            let nodeInfo = { key: 3, name: "Node.js", value: data.nodejs.version };
            let uptimeInfo = { key: 4, name: "Uptime", value: secondsToDhms(data.nodejs.uptime) };
            let versionInfo = { key: 5, name: "Version", value: data.version };
            this.setState({
                loading: false,
                data: [osInfo, cpuInfo, memInfo, nodeInfo, uptimeInfo, versionInfo],
            });
        }).catch(e => {
            this.setState({
                loading: false,
            });
        });
    }


    render() {
        return (
            <Card title={<Fragment>
                <Icon type="hdd" />
                <span style={{ paddingLeft: "12px", fontSize: "16px" }}>Server Info</span>
            </Fragment>}>

                <Table
                    dataSource={this.state.data}
                    columns={columns}
                    loading={this.state.loading}
                    pagination={false}
                    showHeader={false} />
            </Card>
        );
    }
};

export default Profile;