import React, { Component } from 'react';
import { Table, Input, Button, Icon, message, Modal, Tooltip, Badge, Avatar, Select, Popover, Dropdown, Menu, Drawer, Form, Row, Col, DatePicker } from 'antd';
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
      top:null,
      key:null,
      loading:true,

      //抽屉
      visibleDrawerImport:false,
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
        <Popover content={<img src={record.cover? imageURL(record.cover) : 'default.jpg'} style={{maxWidth:500}}/>} placement="right">
          <Avatar shape="square" src={record.cover? imageURL(record.cover) : 'default.jpg'} style={{ cursor:'pointer' }}/>
        </Popover>
      )
    },{
      title: '标题',
      key: 'title',
      render: (text, record) => (
        <span>
            <Link to={'/articles/update/' + record.id}>
              {record.title}
            </Link>
        </span>
      )
    },{
      title: '内容',
      dataIndex: 'content_html',
      key: 'content_html',
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
          <Option value="created_at">最新创建</Option>
          <Option value="view">最多浏览</Option>
          <Option value="comment">最多留言</Option>
        </Select>
        <Select placeholder="按发表状态筛选" style={{ width: 140, marginRight: 10 }} onChange={this.handleChangeStatus} allowClear>
          <Option value={0}>已发表</Option>
          <Option value={1}>笔记</Option>
        </Select>
        <Select placeholder="按置顶状态筛选" style={{ width: 140, marginRight: 10 }} onChange={this.handleChangeTop} allowClear>
          <Option value={0}>未置顶</Option>
          <Option value={1}>置顶</Option>
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
        <Dropdown
          placement="bottomCenter"
          trigger={['click']}
          overlay={
            <Menu onClick={this.handleMenuClick}>
              <Menu.Item key="import"><Icon type="select" />从数据库导入文章</Menu.Item>
            </Menu>
          }>
          <Button style={{float: 'right', marginRight: 10}}>
            <Icon type="ellipsis" />
          </Button>
        </Dropdown>
        <Table
          size="small"
          bordered
          dataSource={this.state.articles}
          loading={this.state.loading}
          columns={columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          style={{marginTop:10}}/>

        <DrawerImportForm visible={this.state.visibleDrawerImport} />
      </div>
    )
  }
  //获取数据
  fetchData = (currentPage=null, pageSize=null) =>{
    const pager = { ...this.state.pagination };
    if (!currentPage) {
      currentPage = pager.current ? pager.current : pager.defaultCurrent;
    }
    if (!pageSize) {
      pageSize = pager.pageSize ? pager.pageSize : pager.defaultPageSize;
    }
    this.setState({ loading:true });
    let url = window.apiURL + 'articles?order=' + this.state.order + '&pagesize=' + pageSize + '&page=' + currentPage;
    if (this.state.status != null) {
      url = url + '&status=' + this.state.status;
    }
    if (this.state.top != null) {
      url = url + '&top=' + this.state.top;
    }
    if (this.state.search != null) {
      url = url + '&search=' + this.state.search;
    }
    axios.get(url)
    .then((response) => {
      const pager = { ...this.state.pagination };
      pager.total = response.data.total;
      pager.current = response.data.current_page;
      pager.pageSize = Number(response.data.per_page);
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
  //文章预览
  handleView = (id) =>{
    window.open('/articles/' + id)
  }
  //文章发表
  handlePublish = (id) =>{
    var that = this
    axios.get(window.apiURL + 'articles/publish/' + id)
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
  //文章置顶
  handleTop = (id) =>{
    var that = this
    axios.get(window.apiURL + 'articles/top/' + id)
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
  //文章删除
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
        axios.get(window.apiURL + 'articles/delete/' + id)
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
  //文章排序
  handleChangeOrder = (value) =>{
    this.setState({ order:value }, () => this.fetchData());
  }
  //文章按发表状态筛选
  handleChangeStatus = (value) =>{
    this.setState({ status:value }, () => this.fetchData());
  }
  //文章按置顶状态筛选
  handleChangeTop = (value) =>{
    this.setState({ top:value }, () => this.fetchData());
  }
  //文章搜索
  handleSearch = (value) => {
    this.setState({ search:value }, () => this.fetchData());
  }
  //操作表格触发函数
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchData(pagination.current, pagination.pageSize);
  }
  //更多功能菜单处理
  handleMenuClick = (e) => {
    if (e.key == 'import') {
      this.setState({visibleDrawerImport: true});
    }
  }
  // new function
}

const DrawerImportForm  = Form.create()(
  class extends React.Component {
    state = { visible: false };

    componentWillReceiveProps(nextProps) {
      this.setState({visible:nextProps.visible});
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div>
          <Drawer
            title="从数据库导入文章"
            width={720}
            placement="right"
            onClose={this.onClose}
            maskClosable={false}
            visible={this.state.visible}
            style={{
              height: 'calc(100% - 55px)',
              overflow: 'auto',
              paddingBottom: 53,
            }}
          >
            <Form layout="vertical" >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Name">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: 'please enter user name' }],
                    })(<Input placeholder="please enter user name" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Url">
                    {getFieldDecorator('url', {
                      rules: [{ required: true, message: 'please enter url' }],
                    })(
                      <Input
                        style={{ width: '100%' }}
                        addonBefore="http://"
                        addonAfter=".com"
                        placeholder="please enter url"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Owner">
                    {getFieldDecorator('owner', {
                      rules: [{ required: true, message: 'Please select an owner' }],
                    })(
                      <Select placeholder="Please select an owner">
                        <Option value="xiao">Xiaoxiao Fu</Option>
                        <Option value="mao">Maomao Zhou</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Type">
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: 'Please choose the type' }],
                    })(
                      <Select placeholder="Please choose the type">
                        <Option value="private">Private</Option>
                        <Option value="public">Public</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Approver">
                    {getFieldDecorator('approver', {
                      rules: [{ required: true, message: 'Please choose the approver' }],
                    })(
                      <Select placeholder="Please choose the approver">
                        <Option value="jack">Jack Ma</Option>
                        <Option value="tom">Tom Liu</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="DateTime">
                    {getFieldDecorator('dateTime', {
                      rules: [{ required: true, message: 'Please choose the dateTime' }],
                    })(
                      <DatePicker.RangePicker
                        style={{ width: '100%' }}
                        getPopupContainer={trigger => trigger.parentNode}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Description">
                    {getFieldDecorator('description', {
                      rules: [
                        {
                          required: true,
                          message: 'please enter url description',
                        },
                      ],
                    })(<Input.TextArea rows={4} placeholder="please enter url description" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }}
            >
              <Button
                style={{
                  marginRight: 8,
                }}
                onClick={this.onClose}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={this.handleSubmit}>Submit</Button>
            </div>
          </Drawer>
        </div>
      );
    }
    onClose = () => {
      this.setState({visible: false});
    }
    //表单提交
    handleSubmit = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          axios.post(window.apiURL + 'import', {})
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
            message.error('error');
          });
        }
      });
    }
  }
)
