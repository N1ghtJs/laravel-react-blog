import React, { Component } from 'react';
import { Breadcrumb, Icon, Spin, Form, Input, Button, Upload } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router-dom';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import styles from "./ArticleCreate.css"

class CoverUploader extends React.Component {
  state={
    cover:'default.jpg'
  }
  uploadCover() {

  }
  render() {
    const props = {
      action: 'upload',
      listType: 'picture',
    };
    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 点此上传
          </Button>
        </Upload>
      </div>
    )
  }
}


class CreactArticleForm extends React.Component {
  state = {
    content: null
  }
  handleChange = (content) => {
    console.log(content)
  }

  handleHTMLChange = (html) => {
    console.log(html)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: { offset: 4, span: 16 },
    };
    const editorProps = {
      height: 300,
      initialContent: this.state.content,
      onChange: this.handleChange,
      onHTMLChange: this.handleHTMLChange,
      extendControls: [{
        type: 'modal',
        text: '封面',
        modal: {
          title: '上传文章封面图片',
          showClose: true,
          showCancel: true,
          showConfirm: true,
          confirmable: true,
          onConfirm: () => console.log(1),
          onCancel: () => console.log(2),
          onClose: () => console.log(3),
          children: (
            <div style={{width: 480, height: 160, padding: 30}}>
              <CoverUploader />
            </div>
          )
        }
      }]
    }
    return (
      <Form>
        <FormItem {...formItemLayout}>
            <Input prefix={<Icon type="info-circle-o" />} placeholder="输入文章标题" />
        </FormItem>
        <FormItem {...formItemLayout}>
            <div  style={{ borderRadius: 5, boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1)'}}>
              <BraftEditor {...editorProps}/>
            </div>
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

        <WrappedCreactArticleForm />
      </div>
    )
  }
}
