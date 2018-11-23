import React, { Component } from 'react';
import { Breadcrumb, Icon, message } from 'antd';
import { Link } from 'react-router-dom';
import { ArticleForm } from './ArticleForm';

export class ArticleCreate extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tagsArr:[]
    };
  }
  componentDidMount(props) {
    //获取标签
    axios.get('z/tags')
    .then((response) => {
      this.setState({
        tagsArr:response.data.tagsArr,
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleSubmit(article) {
    if (article.title == '') {
      message.error('标题不能为空');
    }else {
      //创建文章
      axios.post('z/articles', {
        title:article.title,
        tags:article.tags,
        cover:article.cover,
        content_raw:article.content_raw,
        content_html:article.content_html,
      })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          message.success(response.data.message)
          location.replace('#/articles')
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
  render(){
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
            文章创建
          </Breadcrumb.Item>
        </Breadcrumb>
        <ArticleForm tagsArr={this.state.tagsArr} handleSubmit={this.handleSubmit} />
      </div>
    )
  }
}
