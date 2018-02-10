import React, { Component } from 'react';
import { Table } from 'antd';
import styles from "./Comment.css"

export class Comment extends React.Component {
  constructor() {
    super();
    this.state = {
      //评论数据
      comments:[],
      loading:true,
    };
  }
  componentWillMount() {
    this.fetchData()
  }
  fetchData(){
    var that = this
    //获取文章数据
    axios.get('z/comments')
    .then(function (response) {
      //console.log(response.data);
      that.setState({
        comments:response.data,
        comments_back:response.data,
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
      width: 50,
    },{
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },{
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },{
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },{
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },{
      title: '评论时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },{
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record) => (
        <span>
        </span>
      ),
    },];
    return (
      <div>
        <Table size="middle" dataSource={this.state.comments} loading={this.state.loading} columns={columns} pagination={{ pageSize: 5 }}/>
      </div>
    )
  }
}
