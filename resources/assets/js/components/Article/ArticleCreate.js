import React, { Component } from 'react';
import { Breadcrumb, Icon, Spin, Form, Input, Button } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router-dom';
import styles from "./ArticleCreate.css"

class CreactArticleForm extends React.Component {
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: { offset: 4, span: 16 },
    };
    return (
      <Form>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: '标题不能为空',
            }],
          })(
            <Input prefix={<Icon type="info-circle-o" />} placeholder="输入文章标题" />
          )}
        </FormItem>
      </Form>
    )
  }
}
const WrappedCreactArticleForm = Form.create()(CreactArticleForm);

export class ArticleCreate extends React.Component {
  constructor(props) {
    super();
    this.state = {
      form:[]
    };
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

        <WrappedCreactArticleForm></WrappedCreactArticleForm>
      </div>
    )
  }
}
