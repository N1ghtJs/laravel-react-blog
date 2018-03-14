import React, { Component } from 'react';
import { Table, Input, Button, Icon, Divider, message, Modal, Tooltip, Badge, Avatar } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import { Link } from 'react-router-dom';
import styles from "./Article.css"

export class Article extends React.Component {
  constructor() {
    super();
    this.state = {
      //文章数据
      articles:[],
      articles_back:[],
      loading:true,
      //标题搜索
      filterDropdownVisible: false,
      searchText: '',
      filtered: false,
      //Model
      coverModelVisible: false,
    };
  }
  componentWillMount() {
    this.fetchData()
  }
  fetchData(){
    var that = this
    //获取文章数据
    axios.get('z/articles')
    .then(function (response) {
      //console.log(response.data);
      that.setState({
        articles:response.data,
        articles_back:response.data,
        loading:false,
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  //标题搜索
  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }
  onSearch = () => {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      articles: this.state.articles_back.map((record) => {
        const match = record.title.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          title: (
            <span>
              {record.title.split(reg).map((text, i) => (
                i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
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
  render(){
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
      ),
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInput = ele}
            placeholder="Search name"
            value={this.state.searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>搜索</Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        }, () => this.searchInput && this.searchInput.focus());
      },
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
              <Button icon={record.is_top?"up-square":"up-square-o"} onClick={this.handleTop.bind(this, record.id)}/>
            </Tooltip>
            <Tooltip title="删除">
              <Button icon="delete" onClick={this.handleDelete.bind(this, record.id)}/>
            </Tooltip>
          </ButtonGroup>
        </span>
      ),
    },];
    return (
      <div>
        <Link to={'/articles/create'}>
          <Button type="primary" icon="edit" style={{marginBottom:20}}>有事没事来一篇</Button>
        </Link>
        <Link to={'/tags'}>
          <Button type="primary" icon="tag" style={{marginBottom:20}} style={{float:'right'}}>标签管理</Button>
        </Link>
        <Table size="middle" dataSource={this.state.articles} loading={this.state.loading} columns={columns} pagination={{ pageSize: 5 }}/>
      </div>
    )
  }
}
