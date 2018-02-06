import React, { Component } from 'react';
import { Breadcrumb, Icon, message } from 'antd';
import { Link } from 'react-router-dom';
import { ArticleForm } from './ArticleForm';
import styles from "./ArticleCreate.css"

export class ArticleCreate extends React.Component {
  constructor(props) {
    super();
    this.state = {

    };
  }
  handleSubmit(article) {
    console.log(article);
    var that = this
    if (article.title == '') {
      message.error('标题不能为空');
    }else {
      //创建文章
      axios.post('z/articles', {
        title:article.title,
        cover:article.cover,
        content:article.content,
      })
      .then(function (response) {
        console.log(response);
        if (response.status == 200) {
          message.success(response.data.message)
          location.replace('#/articles')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
  render(){
    return (
      <div>
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
        <ArticleForm handleSubmit={this.handleSubmit} />
      </div>
    )
  }
}
