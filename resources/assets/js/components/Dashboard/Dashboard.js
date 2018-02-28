import React, { Component } from 'react';
import { ChartCard, Field, MiniArea } from 'ant-design-pro/lib/Charts';
import { Row, Col, Tooltip, Icon, Spin } from 'antd'
import numeral from 'numeral';
import moment from 'moment';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from "./Dashboard.css"

export class Dashboard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading:true,
      visits_count:0,
      visits_arr:[],
      visits_today:0,
      visits_day_max:0,
    };
  }
  componentDidMount(props) {
    var that = this
    //获取文章数据
    axios.get('z/dashboard')
    .then(function (response) {
      console.log(response.data);
      that.setState({
        visits_count:response.data.visits_count,
        visits_arr:response.data.visits_arr,
        visits_today:response.data.visits_today,
        visits_day_max:response.data.visits_day_max,
        loading:false,
      })      
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render(){
    return (
      <Spin spinning={this.state.loading}>
        <Row>
          <Col span={6}>
            <ChartCard
              title="访问量统计"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(this.state.visits_count).format('0,0')}
              footer={
                <Row>
                  <Col span={12}><Field label="今日访问" value={numeral(this.state.visits_today).format('0,0')} /></Col>
                  <Col span={12}><Field label="单日最高" value={numeral(this.state.visits_day_max).format('0,0')} /></Col>
                </Row>
              }
              contentHeight={46}
            >
              <MiniArea
                line
                color="#cceafe"
                height={45}
                data={this.state.visits_arr}
              />
            </ChartCard>
          </Col>
          <Col span={6}>
          
          </Col>
        </Row>
      </Spin>
    )
  }
}
