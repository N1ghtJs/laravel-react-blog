import React, { Component } from 'react';
import { Table, Input, Button, Icon, Divider, message, Modal, Tooltip, Badge, Avatar, Select } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const Option = Select.Option;
const Search = Input.Search;
import { Link } from 'react-router-dom';
import styles from "./Article.css"

export class Article extends React.Component {
  constructor() {
    super();
    this.state = {
      //表格数据
      articles:[],
      pagination: {
        showSizeChanger:true,
        showQuickJumper:true,
        defaultCurrent:1,
        defaultPageSize:10
      },
      order:'created_at',
      status:null,
      loading:true,

      //Model
      coverModelVisible: false,
    };
  }
  componentWillMount() {
    this.fetchData();
  }
  render(){
    //表格行配置
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },{
      title: '封面',
      key: 'cover',
      render: (text, record) => (
        <div>
          <Avatar shape="square" src={record.cover || 'default.jpg'} onClick={this.showCover} style={{ cursor:'pointer' }}/>
          <Modal
            title="封面图片"
            visible={this.state.coverModelVisible}
            onCancel={this.handleCancelCoverModel}
            footer={null}
            width="80%"
            style={{ textAlign:'center' }}
          >
            <img src={record.cover || 'default.jpg'} style={{ maxWidth:'100%' }}/>
          </Modal>
        </div>
      )
    },{
      title: '标题',
      key: 'title',
      render: (text, record) => (
        <span>
            <Link to={'/articles/show/' + record.id}>
              {record.title}
            </Link>
        </span>
      )
    },{
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },{
      title: '状态',
      key: 'is_hidden',
      width: 80,
      render: (text, record) => {
        if (record.is_hidden)
          return <Badge status="warning" text="笔记" />
        else
          return <Badge status="processing" text="已发表" />
      }
    },{
      title: '浏览量',
      dataIndex: 'view',
      key: 'view',
      width:60
    },{
      title: '最后访问',
      dataIndex: 'updated_at_diff',
      key: 'updated_at',
      width:80
    },{
      title: '发表时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width:90
    },{
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record) => (
        <span>
          <ButtonGroup>
            <Tooltip title="预览">
              <Button icon="link" onClick={this.handleView.bind(this, record.id)}/>
            </Tooltip>
            <Tooltip title="发表">
              <Button icon="book" onClick={this.handlePublish.bind(this, record.id)}/>
            </Tooltip>
            <Tooltip title="置顶">
              <Button style={{ backgroundColor: record.is_top?'gray':'white'}} icon="up-square" onClick={this.handleTop.bind(this, record.id)}/>
            </Tooltip>
            <Tooltip title="删除">
              <Button icon="delete" onClick={this.handleDelete.bind(this, record.id)}/>
            </Tooltip>
          </ButtonGroup>
        </span>
      ),
    },];
    return (
      <div style={{padding:20}}>
        <Select defaultValue="created_at" style={{ width: 120, marginRight: 10 }} onChange={this.handleChangeOrder}>
          <Option value="created_at">最新发表</Option>
          <Option value="view">最多浏览</Option>
          <Option value="comment">最多留言</Option>
        </Select>
        <Select placeholder="按状态筛选" style={{ width: 120, marginRight: 10 }} onChange={this.handleChangeStatus} allowClear>
          <Option value={0}>已发表</Option>
          <Option value={1}>笔记</Option>
        </Select>
        <Search
          placeholder="搜索标题"
          onSearch={this.handleSearch}
          style={{ width: 200, marginRight: 10 }}
        />

        <Link to={'/articles/create'}>
          <Button type="primary" icon="edit" style={{float: 'right'}}>写文章</Button>
        </Link>
        <Link to={'/tags'}>
          <Button icon="tag" style={{float: 'right', marginRight: 10}}>标签管理</Button>
        </Link>
        <Table
          size="small"
          bordered
          dataSource={this.state.articles}
          loading={this.state.loading}
          columns={columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          style={{marginTop:10}}/>
      </div>
    )
  }
  fetchData = (currentPage=this.state.pagination.defaultCurrent, pageSize=this.state.pagination.defaultPageSize) =>{
    this.setState({ loading:true });
    let url = 'z/articles?order=' + this.state.order + '&pagesize=' + pageSize + '&page=' + currentPage;
    if (this.state.status) {
      url = url + '&status=' + this.state.status;
    }
    if (this.state.search) {
      url = url + '&search=' + this.state.search;
    }
    axios.get(url)
    .then((response) => {
      console.log(response.data);
      const pager = { ...this.state.pagination };
      pager.total = response.data.total;
      this.setState({
        articles:response.data.data,
        pagination: pager,
        loading:false,
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }
  showCover = () =>{
    this.setState({
      coverModelVisible: true,
    });
  }
  handleCancelCoverModel = () =>{
    this.setState({
      coverModelVisible: false,
    });
  }
  handleView = (id) =>{
    window.open('/articles/' + id)
  }
  handlePublish = (id) =>{
    var that = this
    axios.get('z/articles/publish/' + id)
    .then(function (response) {
      if (response.status == 200) {
        that.fetchData()
        message.success(response.data.message)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleTop = (id) =>{
    var that = this
    axios.get('z/articles/top/' + id)
    .then(function (response) {
      if (response.status == 200) {
        that.fetchData()
        message.success(response.data.message)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleDelete = (id) =>{
    var that = this
    confirm({
      title: '确认删除',
      content: '此操作将会永久删除此文章，确认继续？',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        //获取文章数据
        axios.get('z/articles/delete/' + id)
        .then(function (response) {
          if (response.status == 200) {
            that.fetchData()
            message.success(response.data.message)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  }
  handleChangeOrder = (value) =>{
    this.setState({ order:value }, () => this.fetchData());
  }
  handleChangeStatus = (value) =>{
    this.setState({ status:value }, () => this.fetchData());
  }
  handleSearch = (value) => {
    this.setState({ search:value }, () => this.fetchData());
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchData(pagination.current, pagination.pageSize);
  }
  // new function
}
