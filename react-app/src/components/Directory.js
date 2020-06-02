import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'


class Directory extends React.Component {
	constructor() {
		super()
		this.state={
			
		}

	}
	
	render() {
		return(
			<>
			    <Navbar bg="light" variant="light">
				    <Navbar.Brand href="#home">
				    	<img
					        src="./logo.svg"
					        width="30"
					        height="30"
					        className="d-inline-block align-top"
					        alt="Financial Forecast logo"
					    />
				    </Navbar.Brand>
				    <Nav className="mr-auto">
				        <Nav.Link href="#home">Home</Nav.Link>
				        <Nav.Link href="#features">Features</Nav.Link>
				        <Nav.Link href="#pricing">Pricing</Nav.Link>
				    </Nav>
				    <Form inline>
				        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
				        <Button variant="outline-info">Search</Button>
				    </Form>
				</Navbar>
			</>
		)
	}
}
export default Directory