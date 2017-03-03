import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import co from 'co';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {answer:null}
	}

	componentWillMount(){
		var that = this;
		var allData = [];
		let filteredData =[];

		 co(function*(){
			//use co library to handle async
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
			//filter category, reduce array to single avg value
			filteredData = allData
			  .filter(item=> item.category === 'Air Conditioners')
			  .reduce(function (acc, obj) {
				  const { height, width, length } = obj.size
				  return (acc + (((height /100) * (width/100)  * (length/100)) * 250)/4) }, 0)
				  //initiate rerender
			that.setState({answer:filteredData});
		})
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

	renderSolution(answer){
		return(
			<div>
				The avg cubic weight of all products in air conditioner category {this.state.answer}
			</div>
		)
	}

  render() {
		return (
		  <div className="App">
			<div className="App-header">
			  <h2>Mark Hinschberger's Solution</h2>
			</div>
			<p className="App-intro">
				{this.renderSolution()}
			</p>
		  </div>
		);
  	}
}

export default App;
