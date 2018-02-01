import React, { Component } from 'react';
import { Breadcrumb, Icon, Spin } from 'antd';
import { Link } from 'react-router-dom';
import styles from "./ArticleDetail.css"

export class ArticleDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      //文章相关
      id:props.match.params.id,
      article:{},
      loading:true,
    };
  }
  componentWillMount(props) {
    var that = this
    //获取文章数据
    axios.get('articles/' + this.state.id)
    .then(function (response) {
      that.setState({
        article:response.data,
        loading:false,
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render(){
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/articles">
            <Icon type="home" />
            <span> 文章管理</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            文章详情
          </Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <div className="content">
            <h4>{this.state.article.title}</h4>
            <hr/>
            <p>发布时间：{this.state.article.created_at}</p>
            <p>更新时间：{this.state.article.updated_at}</p>
            <p>{this.state.article.content}</p>
          </div>
        </Spin>
      </div>
    )
  }
}
