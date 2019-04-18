import React, { Component } from 'react';
import { Table, Input, Button, Icon, message, Modal, Tooltip, Badge, Avatar, Select, Popover, Dropdown, Menu, Drawer, Form, Row, Col, DatePicker, Alert } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const Option = Select.Option;
const Search = Input.Search;
import { Link } from 'react-router-dom';

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
      order:'created_at_desc',
      status:null,
      top:null,
      key:null,
      loading:true,
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
        <div style={{overflow:'hidden'}}>
          <Select defaultValue="created_at_desc" style={{ width: 120, marginRight: 10 }} onChange={this.handleChangeOrder}>
						<Option value="created_at_desc">最新创建</Option>
            <Option value="created_at">最早创建</Option>
            <Option value="view_desc">最多浏览</Option>
            <Option value="comment_desc">最多留言</Option>
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

          <Dropdown
            placement="bottomRight"
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item>
                  <Link to="/articles/create/richtext">
                    <Icon type="file-word" /> 富文本编辑器
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/articles/create/markdown">
                    <Icon type="file-markdown" /> Markdown编辑器
                  </Link>
                </Menu.Item>
              </Menu>
            }>
            <Button type="primary" icon="edit" style={{float: 'right'}}>写文章</Button>
          </Dropdown>
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
        </div>
        <Table
          size="small"
          bordered
          dataSource={this.state.articles}
          loading={this.state.loading}
          columns={columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          style={{marginTop:10}}/>

        <DrawerImportForm wrappedComponentRef={ref => this.refDrawerImportForm = ref} />
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
      this.refDrawerImportForm.showDrawer();
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
            onClose={this.closeDrawer}
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
                <Col span={24}>
                  <Alert message="仅支持导入当前数据库中其他数据表的数据。导入过程不可逆，请先备份好当前文章数据！" type="warning" showIcon style={{marginBottom:20}} />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="数据表名">
                    {getFieldDecorator('table', {
                      rules: [{ required: true, message: '数据表名不能为空' }],
                    })(<Input placeholder="要导入的数据表名称" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="标题字段">
                    {getFieldDecorator('title', {
                      rules: [{ required: true, message: '标题字段不能为空' }],
                    })(<Input placeholder="存储标题的字段名" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="封面字段" extra={<Badge status="processing" text="不填则保存为默认封面" />}>
                    {getFieldDecorator('cover', {
                    })(<Input placeholder="存储封面的字段名" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="内容字段" extra={<Badge status="processing" text="非纯文本内容可能会破坏格式" />}>
                    {getFieldDecorator('content', {
                    })(<Input placeholder="存储文章正文内容的字段名" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="置顶字段" extra={<Badge status="processing" text="规则：字段名|置顶值，例：is_top|1" />}>
                    {getFieldDecorator('is_top', {
                    })(<Input placeholder="存储文章是否置顶的字段名与规则" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="隐藏字段" extra={<Badge status="processing" text="规则：字段名|隐藏值，例：is_hidden|1" />}>
                    {getFieldDecorator('is_hidden', {
                    })(<Input placeholder="存储文章是否隐藏的字段名与规则" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="浏览量字段" extra={<Badge status="processing" text="不填则保存为 0" />}>
                    {getFieldDecorator('view', {
                    })(<Input placeholder="存储文章浏览量的字段名" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="评论量字段" extra={<Badge status="processing" text="不填则保存为 0" />}>
                    {getFieldDecorator('comment', {
                    })(<Input placeholder="存储文章评论量的字段名" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="创建时间字段" extra={<Badge status="processing" text="不填则保存为 now" />}>
                    {getFieldDecorator('created_at', {
                    })(<Input placeholder="存储文章创建时间的字段名" />)}
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
                onClick={this.closeDrawer}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={this.handleSubmit}>Submit</Button>
            </div>
          </Drawer>
        </div>
      );
    }
    showDrawer = () => {
      this.setState({visible: true});
    }
    closeDrawer = () => {
      this.setState({visible: false});
    }
    //表单提交
    handleSubmit = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          axios.post(window.apiURL + 'import', values)
          .then((response) => {
            message.success(response.data.message);
            this.closeDrawer();
            location.reload();
          })
          .catch((error) => {
            console.log(error);
            message.error('error');
          });
        }
      });
    }
  }
)
