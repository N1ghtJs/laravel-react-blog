import React, { Component } from 'react';
import { ChartCard, Field, MiniArea } from 'ant-design-pro/lib/Charts';
import { Row, Col, Tooltip, Icon } from 'antd'
import numeral from 'numeral';
import moment from 'moment';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from "./Dashboard.css"

export class Dashboard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      visits_count:0,
      visits_arr:[],
      visits_today:0,
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
        visits_today:response.data.visits_today
      })      
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render(){
    return (
      <div>
        <Row>
          <Col span={6}>
            <ChartCard
              title="访问量"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(this.state.visits_count).format('0,0')}
              footer={<Field label="今日访问量" value={numeral(this.state.visits_today).format('0,0')} />}
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
        
      </div>
    )
  }
}
