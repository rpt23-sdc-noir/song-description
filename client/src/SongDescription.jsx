import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// ----------------------------------------- //

class SongDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: null
    }
    this.updateDescription = this.updateDescription.bind(this);
    this.checkObject = this.checkObject.bind(this);
    this.getIdAndUpdateDOM = this.getIdAndUpdateDOM.bind(this);
  }

  checkObject(data) {
    if (typeof data === 'string') {
      return JSON.parse(data)
    } else {
      return data
    }
  }

  updateDescription(data) {
    // parse if its a string from redis
    data = this.checkObject(data);

    console.log('Here is the data sent to updateDescription: ', data);

    this.setState({
      // mongo implementation
      // description: data.description

      // pg implementation
      description: data.band_description
    });
  }

  getIdAndUpdateDOM() {
    let splitUrl = window.location.pathname.split('/');
    let songId = splitUrl.filter(function(id) {
      return parseInt(id);
    });
    console.log('Song ID: ', songId);
    axios.get(`/songDescription/${songId}`)
      .then((response) => {
        console.log('Data: ', response.data.data);
        this.updateDescription(response.data.data);
      })
      .catch((error) => {
        console.log('Error rendering initial song description: ', error);
      });
  }

  componentDidMount() {
    this.getIdAndUpdateDOM();
  }

  render() {
    return (
      <div className="cam song-description">
        <p className="description"> {this.state.description} </p>
      </div>
    )
  }
}

export default SongDescription;