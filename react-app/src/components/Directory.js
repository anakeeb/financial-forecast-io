import React from 'react'
import Navbar from 'react-bootstrap/Navbar'

class Directory extends React.Component {
	constructor() {
		super()
		this.state={
			
		}

	}

	
	render() {
		return(

			<div >
				<button onClick={ this.props.handleHomeClick }>home</button>
				<button onClick={ this.props.handleAboutClick }>about</button>
			</div>
		)
	}
}
export default Directory