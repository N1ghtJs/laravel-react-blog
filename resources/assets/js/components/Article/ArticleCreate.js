import React, { Component } from 'react';
import { Breadcrumb, Icon, message } from 'antd';
import { Link } from 'react-router-dom';
import { ArticleForm } from './ArticleForm';

export class ArticleCreate extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tagsArr:[],
      isMarkdown:false,
    };
  }
  componentDidMount(props) {
    //编辑器类型
    if (this.props.match.params.type == 'markdown') {
      this.setState({isMarkdown:true});
    }
    //获取标签
    axios.get(window.apiURL + 'tags')
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
      axios.post(window.apiURL + 'articles', article)
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
        <ArticleForm tagsArr={this.state.tagsArr} handleSubmit={this.handleSubmit} isMarkdown={this.state.isMarkdown} />
      </div>
    )
  }
}
