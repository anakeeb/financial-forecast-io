import React from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import * as tf from '@tensorflow/tfjs'
import Fade from 'react-bootstrap/Fade'
import CanvasJSReact from '../canvasjs.react'
import styled from 'styled-components'
import calendarIcon from '../img/calendarIcon.png'
import companyIcon from '../img/companyIcon.png'
import epochIcon from '../img/epochIcon.png'
import resultsIcon from '../img/resultsIcon.png'
import loadingSpinner from '../img/loadingSpin.gif'
import mainBackground from '../img/mainBackground.png'
import customBar0 from '../img/customBar0.png'
import customBar1 from '../img/customBar1.png'
import customBar2 from '../img/customBar2.png'
import customBar3 from '../img/customBar3.png'
import customBar4 from '../img/customBar4.png'






var CanvasJS = CanvasJSReact.CanvasJS
var CanvasJSChart = CanvasJSReact.CanvasJSChart


class Main extends React.Component {
	constructor() {
		super()
		this.state={
			predicted: null,
			finishedTraining: false,
			epochIteration: 0,
			epochs: 100,
			timePortion: 7,
			customizationStep: 0
		}
		this.arrOfClosePrice = this.arrOfClosePrice.bind(this)
		this.testModel = this.testModel.bind(this)
		this.handleStartClick = this.handleStartClick.bind(this)
		this.handleEpochPlusClick = this.handleEpochPlusClick.bind(this)
		this.handleEpochMinusClick = this.handleEpochMinusClick.bind(this)
		this.handleTimePlusClick = this.handleTimePlusClick.bind(this)
		this.handleTimeMinusClick = this.handleTimeMinusClick.bind(this)
		this.handleNextCustom = this.handleNextCustom.bind(this)
		this.handlePrevCustom = this.handlePrevCustom.bind(this)
	}

	arrOfClosePrice() {
		let selectedId = -1
		if (this.props.panels[0].selected === true) {
			selectedId = 0
		}
		else if (this.props.panels[1].selected === true) {
			selectedId = 1
		}
		else if (this.props.panels[2].selected === true) {
			selectedId = 2
		}
		else {
			selectedId = -1
		}
		if ((selectedId < 0) || (this.props.panels[selectedId].timeSeries === null)) {
			console.log('returning')
			return null
		}
		var keys = Object.keys(this.props.panels[selectedId].timeSeries)
		var closes = new Array(keys.length)
		for (let i = 0; i < keys.length; i++) {
			closes[i] = parseInt(this.props.panels[selectedId].timeSeries[`${ keys[i] }`]['4. close'], 10)
		}
		return closes
	}

	handleStartClick() {

		let prices = this.arrOfClosePrice()
		let thisVar = this
		this.setState(prevState => {
			return {
				predicted: prevState.predicted,
				finishedTraining: true,
				epochIteration: prevState.epochIteration,
				epochs: prevState.epochs,
				customizationStep: prevState.customizationStep + 1
			}
		})

		this.testModel(prices).then(function (result) {
			console.log(result)
			console.log(thisVar.state)
			thisVar.setState(prevState => {
				return {
					predicted: result,
					finishedTraining: true,
					epochIteration: prevState.epochIteration,
					epochs: prevState.epochs,
					customizationStep: prevState.customizationStep
				}
			})
		})

	}

	handleEpochPlusClick() {
		this.setState(prevState => {
			return {
				predicted: prevState.predicted,
				finishedTraining: prevState.finishedTraining,
				epochIteration: prevState.epochIteration,
				epochs: prevState.epochs + 1,
				timePortion: prevState.timePortion,
				customizationStep: prevState.customizationStep
			}
		})
	}

	handleEpochMinusClick() {
		this.setState(prevState => {
			let epoch = prevState.epochs
			if (epoch > 1) {
				epoch -= 1
			}
			return {
				predicted: prevState.predicted,
				finishedTraining: prevState.finishedTraining,
				epochIteration: prevState.epochIteration,
				epochs: epoch,
				timePortion: prevState.timePortion,
				customizationStep: prevState.customizationStep
			}
		})
	}

	handleTimePlusClick() {
		this.setState(prevState => {
			return {
				predicted: prevState.predicted,
				finishedTraining: prevState.finishedTraining,
				epochIteration: prevState.epochIteration,
				epochs: prevState.epochs,
				timePortion: prevState.timePortion + 1,
				customizationStep: prevState.customizationStep
			}
		})
	}

	handleTimeMinusClick() {
		this.setState(prevState => {
			let time = prevState.timePortion
			if (time > 1) {
				time -= 1
			}
			return {
				predicted: prevState.predicted,
				finishedTraining: prevState.finishedTraining,
				epochIteration: prevState.epochIteration,
				epochs: prevState.epochs,
				timePortion: time,
				customizationStep: prevState.customizationStep
			}
		})
	}

	handleNextCustom() {
		this.setState(prevState => {
			return {
				predicted: prevState.predicted,
				finishedTraining: prevState.finishedTraining,
				epochIteration: prevState.epochIteration,
				epochs: prevState.epochs,
				timePortion: prevState.timePortion,
				customizationStep: prevState.customizationStep + 1
			}
		})
	}

	handlePrevCustom() {
		this.setState(prevState => {
			return {
				predicted: prevState.predicted,
				finishedTraining: prevState.finishedTraining,
				epochIteration: prevState.epochIteration,
				epochs: prevState.epochs,
				timePortion: prevState.timePortion,
				customizationStep: prevState.customizationStep - 1
			}
		})
	}

	//start of ml functions

	testModel(prices) {
		console.log(prices)
		let epochs = this.state.epochs
		let timePortion = this.state.timePortion
		this.setState(prevState => {
			return {
				predicted: null,
				finishedTraining: false,
				epochIteration: 0,
				epochs: epochs,
				timePortion: timePortion,
				customizationStep: prevState.customizationStep
			}
		})
		let thisVar = this
		return new Promise(function (resolve, reject) {
			console.log('in testModel promise')
			console.log(thisVar.state)
			try {
				let predictedForState


				//below are helper functions to manipulate data/implement the neural network

				//next two functions normalize data
				const minMaxScalar = function (data, min, max) {
				    let scaledData = data.map((value) => {
				        return (value - min) / (max - min)
				    })
				    return {
				    	data: scaledData,
				    	min: min,
				    	max: max
				    }
				}

				const minMaxInverseScalar = function (data, min, max) {
					console.log('minMaxInverseScalar')
					console.log(data)
				    let scaledData = data.map(value => {
				        return value * (max - min) + min
				    })

				    return {
				        data: scaledData,
				        min: min,
				        max: max
				    }
				}

				//finds last timePortion days of the array
				const lastTimePortionDays = function (data, timePortion) {
				    let size = data.length
				    let features = []

				    for (let i = (size - timePortion); i < size; i++) {
				        features.push(data[i])
				    }
				    
				    return features
				}

				//processes the data
				const processData = function (prices, timePortion) {
					console.log('processData')
					let min = Number.MAX_SAFE_INTEGER
					let max = 0
				    for(let i = 0; i < prices.length; i++) {
				    	if (prices[i] >= max) {
				    		max = prices[i]
				    	}
				    	if (prices[i] <= min) {
				    		min = prices[i]
				    	}
				    }
					let scaled = minMaxScalar(prices, min, max)
					let size = prices.length
					let trainX = []
					let trainY = []

				    try {
				        for (let i = timePortion; i < size; i++) {
				            for (let j = (i - timePortion); j < i; j++) {
				                trainX.push(scaled.data[j])
				            }
				            trainY.push(scaled.data[i])
				        }
				    }
				    catch (ex) {
				        console.log(ex)
				    }

				    return {
				    	size: (size - timePortion),
				        timePortion: timePortion,
				        trainX: trainX,
				        trainY: trainY,
				        min: scaled.min,
				        max: scaled.max,
				        originalData: prices
				    }
				}

				//gets the model
				const getModel = function (data) {
				    return new Promise(function (resolve, reject) {

				        // Linear (sequential) stack of layers
				        const model = tf.sequential()

				        // Define input layer
				        model.add(tf.layers.inputLayer({
				            inputShape: [timePortion, 1],
				        }))

				        // Add the first convolutional layer
				        model.add(tf.layers.conv1d({
				            kernelSize: 2,
				            filters: 128,
				            strides: 1,
				            use_bias: true,
				            activation: 'relu',
				            kernelInitializer: 'VarianceScaling'
				        }))

				        // Add the Average Pooling layer
				        model.add(tf.layers.averagePooling1d({
				            poolSize: [2],
				            strides: [1]
				        }))

				        // Add the second convolutional layer
				        model.add(tf.layers.conv1d({
				            kernelSize: 2,
				            filters: 64,
				            strides: 1,
				            use_bias: true,
				            activation: 'relu',
				            kernelInitializer: 'VarianceScaling'
				        }))

				        // Add the Average Pooling layer
				        model.add(tf.layers.averagePooling1d({
				            poolSize: [2],
				            strides: [1]
				        }))

				        // Add Flatten layer, reshape input to (number of samples, number of features)
				        model.add(tf.layers.flatten({

				        }))

				        // Add Dense layer, 
				        model.add(tf.layers.dense({
				            units: 1,
				            kernelInitializer: 'VarianceScaling',
				            activation: 'linear'
				        }))
				        console.log('getModel returning')
				        return resolve({
				            'model': model,
				            'data': data
				        })
				    })
				}

				//trains model
				const train = function (model, data, epochs) {
				    console.log("MODEL SUMMARY: ")
				    model.summary()

				    const epochFunc = function () {
				    	thisVar.setState(prevState => {
				    		return {
				    			predicted: prevState.predicted,
				    			finishedTraining: prevState.finishedTraining,
				    			epochIteration: prevState.epochIteration + 1,
				    			epochs: prevState.epochs,
				    			customizationStep: prevState.customizationStep
				    		}
				    	})
				    }
				    return new Promise(function (resolve, reject) {
				        console.log('in promise')
				        try {
				            // Optimize using adam (adaptive moment estimation) algorithm
				            model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })

				            // Train the model
				            model.fit(data.tensorTrainX, data.tensorTrainY, {
				                epochs: epochs,
				                callbacks: {
				                	onEpochEnd: epochFunc
				                }
				            }).then(function (result) {
				                for (let i = 0; i < result.epoch.length; ++i) {
				                    console.log("Loss after Epoch " + i + " : " + result.history.loss[i])
				                }
				                console.log("Loss after last Epoch (" + result.epoch.length + ") is: " + result.history.loss[result.epoch.length-1])
				                resolve(model)
				            })
				        }
				        catch (ex) {
				            reject(ex)
				        }
				    })
				}

				

				//function continues
				

				let data = processData(prices, timePortion)
				let nextDayPrediction = lastTimePortionDays(prices, timePortion)

				getModel(data).then(function (built) {
					let tensorData = {
				        tensorTrainX: tf.tensor1d(built.data.trainX).reshape([built.data.size, built.data.timePortion, 1]),
				    	tensorTrainY: tf.tensor1d(built.data.trainY)
					}
					let max = built.data.max
		            let min = built.data.min
		            console.log(built)
					train(built.model, tensorData, epochs).then(function (model) {
						// Predict for the same train data
		                // We gonna show the both (original, predicted) sets on the graph 
		                // so we can see how well our model fits the data
		                var predictedX = model.predict(tensorData.tensorTrainX)
		                        
		                // Scale the next day features
		                let nextDayPredictionScaled = minMaxScalar(nextDayPrediction, min, max)
		                // Transform to tensor data
		                let tensorNextDayPrediction = tf.tensor1d(nextDayPredictionScaled.data).reshape([1, built.data.timePortion, 1])
		                // Predict the next day stock price
		                let predictedValue = model.predict(tensorNextDayPrediction)    
		                        
		                // Get the predicted data for the train set
		                predictedValue.data().then(function (predValue) {
		                    // Revert the scaled features, so we get the real values
		                    let inversePredictedValue = minMaxInverseScalar(predValue, min, max)

		                    // Get the next day predicted value
		                    predictedX.data().then(function (pred) {
		                        // Revert the scaled feature
		                        var predictedXInverse = minMaxInverseScalar(pred, min, max)

		                        // Convert Float32Array to regular Array, so we can add additional value
		                        predictedXInverse.data = Array.prototype.slice.call(predictedXInverse.data)
		                        // Add the next day predicted stock price so it's showed on the graph
		                        predictedXInverse.data[predictedXInverse.data.length] = inversePredictedValue.data[0]
		    
		                        // Revert the scaled labels from the trainY (original), 
		                        // so we can compare them with the predicted one
		                        var trainYInverse = minMaxInverseScalar(built.data.trainY, min, max)

		                        console.log('original')
		                        console.log(trainYInverse.data)
		                        console.log('predicted')
		                		console.log(predictedXInverse.data)
		                		predictedForState = predictedXInverse.data
		                		console.log('this.setState')
								resolve(predictedForState)
		                    })
		                })    
					})
				})
			}
			catch (ex) {
				reject(ex)
			}
		})
    }


	render() {
		console.log('render')
		const Styles = styled.div`
			.startButton {
				background-color: #88D498;
				color: #DDD;
				cursor: pointer;
				&:hover {
					text-shadow: #B7E5C1;

				}
			}

			.epoch-text {
				color: #DDD;
			}

			.dropdown-button {
				background-color: #000;
			}

			.icon {
				height: 80px;
				margin: auto;
			}

			.icon-large {
				height: 300px;
				margin: auto;
			}

			.param-text {
				font-size: 40px;
				font-family: "Roboto";
				font-weight: 700px;
			}

			.content {
				height: 320px;
				backgorund-color: #88D498;
			}

			.main {
				background: url(${ mainBackground }) no-repeat center fixed;
				background-position: center;
				background-size: cover;
				background-attachment: scroll;
				height: 1400px;
				padding: 140px 100px;
				color: #000
			}

			.change-button {
				border-radius: 24px;
				border: solid 3px;
				font-family: 'Avenir Next';
				font-size: 60px;
				border-color: #000;
				padding: 20px 20px;
				color: #000;
				background: transparent;


				&:hover {
					border-color: #000;
					background: #000;
					color: #88d498;
				}
			}

			.change-button-small {
				border-radius: 12px;
				border: solid 1.5px;
				font-family: 'Avenir Next';
				font-size: 30px;
				border-color: #000;
				padding: 10px 10px;
				color: #000;
				background: transparent;


				&:hover {
					border-color: #000;
					background: #000;
					color: #88d498;
				}
			}

			.change-button-small-selected {
				border-radius: 12px;
				border: solid 1.5px;
				font-family: 'Avenir Next';
				font-size: 30px;
				border-color: #000;
				padding: 10px 10px;
				color: #FFF;
				background: transparent;


				&:hover {
					border-color: #000;
					background: #000;
					color: #88d498;
				}
			}

			.row-center {
				place-items: center;
			}

			col-center {
				place-items: center;
			}

			
		`

		let btnName = ''
		let selectedId = -1
		if (this.props.panels[0].selected === true) {
			btnName = this.props.panels[0].name
			selectedId = 0
		}
		else if (this.props.panels[1].selected === true) {
			btnName = this.props.panels[1].name
			selectedId = 1
		}
		else if (this.props.panels[2].selected === true) {
			btnName = this.props.panels[2].name
			selectedId = 2
		}
		else if (this.props.panels[3].selected === true) {
			btnName = this.props.panels[3].name
			selectedId = 3
		}
		else {
			btnName = 'Stock'
		}


		let options
		let graph

		if((selectedId > -1) && (this.state.finishedTraining)) {
			let closes = this.arrOfClosePrice()
			CanvasJS.addColorSet("greenShades",
                [
	                "#88D498",
	                "000000",
	                "#2E8B57",
	                "#3CB371",
	                "#90EE90"            
                ])
			options = {
				colorSet: 'greenShades',
				theme: 'light1',
				axisX: {
					valueFormatString: 'MMM D',

				},
				axisY: {
					includeZero: false,
					prefix: "$"
				},
				data: [
					{
						type: 'line',
						dataPoints: [
							{
								x: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
								y: closes[7]
							},
							{
								x: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
								y: closes[6]
							},
							{
								x: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
								y: closes[5]
							},
							{
								x: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
								y: closes[4]
							},
							{
								x: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
								y: closes[3]
							},
							{
								x: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
								y: closes[2]
							},
							{
								x: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
								y: closes[1]
							},
							{
								x: new Date(Date.now()),
								y: closes[0]
							}
						]
					},
					{
						type: 'line',
						dataPoints: [
							{
								x: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
								y: this.state.predicted[8]
							},
							{
								x: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
								y: this.state.predicted[7]
							},
							{
								x: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
								y: this.state.predicted[6]
							},
							{
								x: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
								y: this.state.predicted[5]
							},
							{
								x: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
								y: this.state.predicted[4]
							},
							{
								x: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
								y: this.state.predicted[3]
							},
							{
								x: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
								y: this.state.predicted[2]
							},
							{
								x: new Date(Date.now()),
								y: this.state.predicted[1]
							},
							{
								x: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
								y: this.state.predicted[0]
							}
						]
					}
				]
			}
			graph = (
				<Fade>
					<CanvasJSChart options={ options } />
				</Fade>
			)		
		}

		let percentComplete = ((this.state.epochIteration / this.state.epochs) * 100)
		percentComplete = Math.floor(percentComplete)

		let customBar = (
					<img src={ customBar0 }/>
		)


		let epochScreen
		let timeScreen
		let resultScreen
		let nextBtn
		let explanation = `Choose what company's stock you would like to analyze`
		if (btnName !== 'Stock') {
			nextBtn = (
				<button className='change-button' onClick={ this.handleNextCustom }>></button>
			)
		}
		let companyScreen = (
			<Styles>
				<Row>
					<Col>
					</Col>
					<Col>
						<img className="icon" src={ companyIcon }/>
					</Col>
					<Col>
					</Col>
				</Row>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>

				<Row className="content">
					<Col>
					</Col>
					<Col>
					</Col>
					<Col className='col-center'>
						<Container>
							<Row>
								<button className='change-button-small' onClick={ () => this.props.onSelect(this.props.panels[0].id) }> { this.props.panels[0].name } </button>
							</Row>
							<br/>
							<Row>
								<button className='change-button-small' onClick={ () => this.props.onSelect(this.props.panels[1].id) }> { this.props.panels[1].name } </button>
							</Row>
							<br/>
							<Row>
								<button className='change-button-small' onClick={ () => this.props.onSelect(this.props.panels[2].id) }> { this.props.panels[2].name } </button>
							</Row>
							<br/>
							<Row>
								<button className='change-button-small' onClick={ () => this.props.onSelect(this.props.panels[3].id) }> { this.props.panels[3].name } </button>
							</Row>
						</Container>
					</Col>
					<Col>
					</Col>
					<Col>
						{ nextBtn }
					</Col>
				</Row>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
			</Styles>	
		)
		
		if (btnName !== 'Stock') {
			customBar = (
				<div>
					<img src={ customBar1 }/>
				</div>
			)

			if (this.state.customizationStep !== 0) {
				companyScreen = null
			}
			
			if (this.state.customizationStep === 1) {
				epochScreen = (
					<Styles>
						<Row>
							<Col>
							</Col>
							<Col>
								<img className="icon" src={ epochIcon }/>
							</Col>
							<Col>
							</Col>
						</Row>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<Row>
							<Col>
								<button className='change-button' onClick={ this.handlePrevCustom }> {` < `} </button>
							</Col>
							<Col>
								<Button className='change-button' onClick={ this.handleEpochMinusClick }>-</Button>
							</Col>
							<Col className='col-center'>
								<br/>
								<br/>
								<h1 className='param-text'>
									{ this.state.epochs } Epochs
								</h1>
							</Col>
							<Col>
								<Button className='change-button' onClick={ this.handleEpochPlusClick }>+</Button>
							</Col>
							<Col>
								<button className='change-button' onClick={ this.handleNextCustom }> > </button>
							</Col>
							
						</Row>
					</Styles>
				)
				customBar = (
					<img src={ customBar2 }/>
				)
				explanation = `Epoch is a variable that decides how many times the computer will pass over the data.  A larger Epoch will take longer and usually be more accurate, however too large of a value will end up with a biased curve.`
			}
			
			if (this.state.customizationStep === 2) {
				timeScreen = (
					<Styles>
						<Row>
							<Col>
							</Col>
							<Col>
								<img className="icon" src={ calendarIcon }/>
							</Col>
							<Col>
							</Col>
						</Row>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<Row>
							<Col>
								<button className='change-button' onClick={ this.handlePrevCustom }> {` < `} </button>
							</Col>
							<Col>
								<Button className='change-button' onClick={ this.handleTimeMinusClick }>-</Button>
							</Col>
							<Col className='col-center'>
								<br/>
								<br/>
								<h1 className='param-text'>
									{ this.state.timePortion } days back
								</h1>
							</Col>
							<Col>
								<Button className='change-button' onClick={ this.handleTimePlusClick }>+</Button>
							</Col>
							<Col>
								<button className='change-button' onClick={ this.handleStartClick }>start</button>
							</Col>
							
						</Row>
					</Styles>
				)
				customBar = (
					<img src={ customBar3 }/>
				)
				explanation = `The algorithm learns by making predictions based off of the past.  Choose how many days back you would like the computer to use when making it's prediction.`
			}

			if (this.state.customizationStep === 3) {
				let loading = (
					<div>
						<Row>
							<Col>
							</Col>
							<Col>
								<img className="icon-large" src={ loadingSpinner }/>
							</Col>
							<Col>
							</Col>
						</Row>
						<Row>
							<Col>
							</Col>
							<Col>
								<h1>{ percentComplete }% complete</h1>
							</Col>
							<Col>
							</Col>
						</Row>
					</div>
					
				)
				resultScreen = (
					<Styles>
						<Row>
							<Col>
							</Col>
							<Col>
								<img className="icon" src={ resultsIcon }/>
							</Col>
							<Col>
							</Col>
						</Row>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						{this.state.finishedTraining ? graph : loading}
						
					</Styles>
				)
				customBar = (
					<img src={ customBar4 }/>
				)
				explanation = this.state.finishedTraining ? 
					`The prediction is in!`
						: `The computer is currently training itself to be able to make an accurate prediction based off of the variables that you chose.`


			}

			
		}


		
		


		
		return (
			<Styles>
				<div className="main">
					<Container>
						{ companyScreen }
						{ epochScreen }
						{ timeScreen }
						{ resultScreen }
						<Row>
							<Col>
							</Col>
							<Col>
								{ customBar }
							</Col>
							<Col>
							</Col>
						</Row>
						<Row>
							<Col>
								<h1>{ explanation }</h1>
							</Col>
						</Row>
					</Container>
				</div>

			</Styles>
		)

		
	}
}

export default Main