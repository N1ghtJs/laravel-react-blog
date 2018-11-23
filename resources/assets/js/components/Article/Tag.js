import React, { Component } from 'react';
import { Breadcrumb, Icon, Table, Button, Tooltip, Modal, message } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import { Link } from 'react-router-dom';

export class Tag extends React.Component {
  constructor() {
    super();
    this.state = {
      //表格数据
      tags:[],
      loading:true,
    };
  }
  componentWillMount() {
    this.fetchData()
  }
  render (){
    //表格行配置
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },{
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '文章数',
      dataIndex: 'article_num',
      key: 'article_num',
    },{
      title: '搜索热度',
      dataIndex: 'search_num',
      key: 'search_num',
    },{
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record) => (
        <span>
          <ButtonGroup>
            <Tooltip title="删除">
              <Button icon="delete" onClick={this.handleDelete.bind(this, record.id)}/>
            </Tooltip>
          </ButtonGroup>
        </span>
      ),
    },];
    return (
      <div style={{padding:20}}>
        <Breadcrumb style={{ marginBottom:20 }}>
          <Breadcrumb.Item>
            <Link to="/articles">
            <Icon type="home" />
            <span> 文章管理</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            标签管理
          </Breadcrumb.Item>
        </Breadcrumb>
        <Table
          size="small"
          bordered
          dataSource={this.state.tags}
          loading={this.state.loading}
          columns={columns}
          pagination={{
            showSizeChanger:true,
            showQuickJumper:true
          }}/>
      </div>
    )
  }
  //获取数据
  fetchData(){
    this.setState({ loading:true });
    axios.get(window.apiURL + 'tags')
    .then((response) => {
      this.setState({
        tags:response.data.tags,
        loading:false,
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }
  //删除标签
  handleDelete = (id) =>{
    confirm({
      title: '确认删除',
      content: '此操作将会永久删除此标签，确认继续？',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:() => {
        axios.get(window.apiURL + 'tags/delete/' + id)
        .then((response) => {
          if (response.status == 200) {
            this.fetchData()
            message.success(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
        });
      },
      onCancel:() => {
        console.log('取消删除');
      },
    });
  }
  //new function
}
