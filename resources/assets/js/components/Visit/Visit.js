import React, { Comeponent } from 'react';
import { Table } from 'antd';
import styles from "./Visit.css"

export class Visit extends React.Component {
  constructor() {
    super()
    this.state = {
      //访问数据
      visits:[],
      visits_back:[],
      loading:true
    }
  }
  componentWillMount() {
    this.fetchData()
  }
  fetchData(){
    var that = this
    //获取文章数据
    axios.get('z/visits')
    .then(function (response) {
      console.log(response.data);
      that.setState({
        visits:response.data,
        visits_back:response.data,
        loading:false,
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render(){
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },{
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 80
    },{
      title: '页面',
      dataIndex: 'page',
      key: 'page',
    },{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },{
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },{
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },{
      title: '客户端',
      key: 'client',
      render:(text, record)=>(
        <p title={record.client}>{ record.client_limit }</p>
      )
    },{
      title: 'USER_ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },{
      title: '访问时间',
      dataIndex: 'created_at',
      key: 'created_at',
    }];
    return (
      <div>
        <Table
          size="middle"
          dataSource={this.state.visits}
          loading={this.state.loading}
          columns={columns}
          pagination={{ pageSize: 5 }}/>
      </div>
    )
  }
}
