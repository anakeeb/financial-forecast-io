import React from 'react';
import StockPanel from './components/StockPanel'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Main from './pages/Main'
import NoMatch from './pages/NoMatch'
import NavigationBar from './components/NavigationBar'

import './css/style.css'



class App extends React.Component {
	constructor() {
		super()
		this.state={
			panels: [
				{
					id: 0,
					name: 'AMZN',
					hovered: false,
					selected: false,
					timeSeries: null
				},
				{
					id: 1,
					name: 'GOOG',
					hovered: false,
					selected: false,
					timeSeries: null
				},
				{
					id: 2,
					name: 'AAPL',
					hovered: false,
					selected: false,
					timeSeries: null
				},
				{
					id: 3,
					name: 'TSLA',
					hovered: false,
					selected: false,
					timeSeries: null
				}
			]


		}
		this.handleHover = this.handleHover.bind(this)
		this.handleSelect = this.handleSelect.bind(this)

	}

	handleHover(id) {
		console.log(id)
		this.setState(prevState => {
			const updatedPanels = prevState.panels.map(panel => {
				if (panel.id === id) {
					panel.hovered = !(panel.hovered)
				}
				return panel
			})
			return {
				panels: updatedPanels
			}
		})

	}

	handleSelect(id) {
		console.log(id)
		this.setState(prevState => {
			const updatedPanels = prevState.panels.map(panel => {
				if (panel.id === id) {
					panel.selected = true
				}
				else {
					panel.selected = false
				}
				return panel
			})
			return {
				panels: updatedPanels
			}
		})

	}

	componentDidMount() {
        //Making API calls
        if(!this.state.panels[0].timeSeries) {
        	fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ this.state.panels[0].name }&apikey=PUITOEHB47EXYOC4`)
	            .then(response => response.json())
	            .then(data => this.setState(prevState => {
	            	const updatedPanels = prevState.panels.map(panel => {
	            		if (panel.id === 0) {
	            			panel.timeSeries = data['Time Series (Daily)']
	            		}
	            		return panel
	            	})
	            	return {
	            		timeSeries: updatedPanels
	            	}
	            })
        	)
        }
        if(!this.state.panels[1].timeSeries) {
        	fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ this.state.panels[1].name }&apikey=PUITOEHB47EXYOC4`)
	            .then(response => response.json())
	            .then(data => this.setState(prevState => {
	            	const updatedPanels = prevState.panels.map(panel => {
	            		if (panel.id === 1) {
	            			panel.timeSeries = data['Time Series (Daily)']
	            		}
	            		return panel
	            	})
	            	return {
	            		timeSeries: updatedPanels
	            	}
	            })
        	)
        }
        if(!this.state.panels[2].timeSeries) {
        	fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ this.state.panels[2].name }&apikey=PUITOEHB47EXYOC4`)
	            .then(response => response.json())
	            .then(data => this.setState(prevState => {
	            	const updatedPanels = prevState.panels.map(panel => {
	            		if (panel.id === 2) {
	            			panel.timeSeries = data['Time Series (Daily)']
	            		}
	            		return panel
	            	})
	            	return {
	            		timeSeries: updatedPanels
	            	}
	            })
        	)
        }
        if(!this.state.panels[3].timeSeries) {
        	fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ this.state.panels[3].name }&apikey=PUITOEHB47EXYOC4`)
	            .then(response => response.json())
	            .then(data => this.setState(prevState => {
	            	const updatedPanels = prevState.panels.map(panel => {
	            		if (panel.id === 3) {
	            			panel.timeSeries = data['Time Series (Daily)']
	            		}
	            		return panel
	            	})
	            	return {
	            		timeSeries: updatedPanels
	            	}
	            })
        	)
        }
        

    }

	render() {
		console.log(this.state)
		const stockPanels = this.state.panels.map(panel => <StockPanel key={ panel.id } panel={ panel } onHover={ this.handleHover }/>)
		return (
			<React.Fragment>
		      <NavigationBar />
		        <Router>
		          <Switch>
		            <Route
		            	exact path='/'
		            	render={
		            		(props) => {
		            			return (
		            				<Home {...props} stockPanels={ stockPanels } />
		            			)
		            		}
		            	}
		            />
		            <Route path='/about' component={About} />
		            <Route
		            	path='/main'
		            	render={
		            		(props) => {
		            			return (
		            				<Main {...props} panels={ this.state.panels } onSelect={ this.handleSelect }/>
		            			)
		            		}
		            	}
		            />
		            <Route component={NoMatch} />
		          </Switch>
		        </Router>
		      
		    </React.Fragment>
		)
	}


}


export default App;
