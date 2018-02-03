import React, { Component } from 'react';
import styles from "./Dashboard.css"

export class Dashboard extends React.Component {
  constructor() {
    super();

    axios.post('http://dmmylove.cn:8083/oauth/token', {
      grant_type:'password',
      client_id:2,
      client_secret:'i23guTDwX5sknqlVj6RTbFE6okfEpBM9RXeU9fBJ',
      username:'admin@qq.com',
      password:'quanbang',
      scope:'*'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render(){
    return (
      <div>
        <h2>Dashboard</h2>
      </div>
    )
  }
}
