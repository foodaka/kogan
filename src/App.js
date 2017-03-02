import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import co from 'co';

let test = [];

class App extends Component {
	constructor(props){
		super(props);
		this.state = {answer:null}
	}

	call_API_FirstTime(){
		return axios.get('http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com/api/products/1')
		.then(res => {
			return res.data
		})
		.catch(err => {console.log('err',err);})
	}

	call_API_Next(url){
		return axios.get(url)
		.then(res => {
			return res.data
		})
		.catch(err => {console.log('err2',err);})
	}

	componentWillMount(){
		var that = this;
		var allData = [];
		let filteredData =[];

		 co(function*(){
			var count = 0
			while (count >=0) {
			  var tempData;
			  if (count === 0) {
				tempData = yield that.call_API_FirstTime();
			  } else {
				let lastLoadData = tempData.next;
				tempData = yield that.call_API_Next(`http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com${lastLoadData}`);
			  }

			  allData = allData.concat(tempData ? tempData.objects : []);
			  if (tempData) {
				count += 1;
			  } else {
				break;
			  }
			}
			filteredData = allData
			  .filter(item=> item.category === 'Air Conditioners')
			  .reduce(function (acc, obj) {
				  return (acc + (((obj.size.height /100) * (obj.size.width/100)  * (obj.size.length/100)) * 250)/4) }, 0)
				  //initiate rerender
				  that.setState({answer:filteredData});
		})

	}

	renderSolution(answer){
		return(
			<div>
				{this.state.answer}
			</div>
		)
	}

  render() {
		return (
		  <div className="App">
			<div className="App-header">
			  <h2>Mark Hinschberger's Solution</h2>
			  <h2>{this.renderSolution()}</h2>
			</div>
			<p className="App-intro">
			</p>
		  </div>
		);
  	}
}

export default App;
