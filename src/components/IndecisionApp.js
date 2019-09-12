import React from 'react';

import Options from './Options';
import AddOption from './AddOption';
import Action from './Action';
import Header from './Header';
import OptionModal from './OptionModal';

export default class IndecisionApp extends React.Component {

  state = {
    options: [],
    selectedOption: undefined
  }
  
  handleDeleteOptions = () => {
    fetch('http://todosapi:8080/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
    .then((options) => {
      this.setState({ options: options.map(o => o.option) })
    })
  }

  handleDeleteOption = (optionToRemove) => {
    fetch('http://todosapi:8080/todos/'+(this.state.options.indexOf(optionToRemove) + 1), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())
    .then((options) => {
      this.setState({ options: options.map(o => o.option) })
    })
  }

  handleClearSelectedOption = () => {
    this.setState(() => ({ selectedOption: undefined }));
  }

  handlePick = () => {
    const randomNum = Math.floor(Math.random() * this.state.options.length);
    const option = this.state.options[randomNum];
    this.setState(() => (
      {
        selectedOption: option
      }
    ));
  }

  handleAddOption = (option) => {
    if (!option) {
      return 'Enter valid value to add item';
    } else if (this.state.options.indexOf(option) > -1) {
      return 'This option already exists';
    }

    fetch('http://todosapi:8080/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: (this.state.options.length + 1),
        option: option,
      })
    }).then(res => res.json())
    .then((options) => {
      this.setState({ options: options.map(o => o.option) })
    })
  }

  componentDidMount() {
    try {
      fetch('http://todosapi:8080/todos')
        .then(res => res.json())
        .then((options) => {
          this.setState({ options: options.map(o => o.option) })
        })
    } catch (e) {
      // Do nothing at all
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.options.length !== this.state.options.length) {
      // const json = JSON.stringify(this.state.options);
      // localStorage.setItem('options', json);
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  render() {
    const subtitle = 'Put your life in the hands of a computer';

    return (
      <div>
        <Header subtitle={subtitle} />
        <div className="container">
        <Action
          hasOptions={this.state.options.length > 0}
          handlePick={this.handlePick}
        />
        <div className="widget">
          <Options
            options={this.state.options}
            handleDeleteOptions={this.handleDeleteOptions}
            handleDeleteOption={this.handleDeleteOption}
          />
          <AddOption
            handleAddOption={this.handleAddOption}
          />
        </div>
        </div>
        <OptionModal 
          selectedOption={this.state.selectedOption}
          handleClearSelectedOption={this.handleClearSelectedOption}/>
      </div>
    );
  }
}
