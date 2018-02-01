import React, { Component } from 'react';
import { Table, Input, Button, Icon } from 'antd';
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
    };
  }
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
  componentWillMount() {
    var that = this
    //获取文章数据
    axios.get('articles')
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
  render(){
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },{
      title: '标题',
      key: 'title',
      render: (text, record) => (
        <span>
            <Link to={'/articles/' + record.id}>
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
      title: '发表时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },{
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },];
    return (
      <div>
        <Table dataSource={this.state.articles} loading={this.state.loading} columns={columns} pagination={{ pageSize: 5 }}/>
      </div>
    )
  }
}
