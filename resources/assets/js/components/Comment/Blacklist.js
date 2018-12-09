import React, { Component } from 'react';
import { Breadcrumb, Icon, Table, Button, Tooltip, Modal, message } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import { Link } from 'react-router-dom';

export class Blacklist extends React.Component {
  constructor() {
    super();
    this.state = {
      //表格数据
      blacks:[],
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
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },{
      title: '拉黑时间',
      dataIndex: 'created_at',
      key: 'created_at',
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
            <Link to="/comments">
            <Icon type="home" />
            <span> 留言管理</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            黑名单管理
          </Breadcrumb.Item>
        </Breadcrumb>
        <Table
          size="small"
          bordered
          dataSource={this.state.blacks}
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
    axios.get(window.apiURL + 'blacklist')
    .then((response) => {
      this.setState({
        blacks:response.data.blacks,
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
      content: '此操作将从黑名单中移除此IP地址，确认继续？',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:() => {
        axios.get(window.apiURL + 'blacklist/delete/' + id)
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
