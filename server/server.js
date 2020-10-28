import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// ----------------------------------------- //

class SongDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songId: null,
      description: 'This is a placeholder'
    }
    this.updateDescription = this.updateDescription.bind(this);
  }

  updateDescription(data) {
    // do stuff
  }

  componentDidMount() {
    let splitUrl = window.location.pathname.split('/');
    let songId = splitUrl.filter(function(id) {
      return parseInt(id);
    });
    axios.get(`/songDescription/${songId}`)
      .then((response) => {
        this.updateDescription(response.data.data);
      })
      .catch((error) => {
        console.log('Error rendering initial song description: ', error);
      });
  }

  render() {
    return (
      <div className="cam song-description">
        <p> {this.state.description} </p>
      </div>
    )
  }
}

export default SongDescription;