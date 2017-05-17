import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import parseInput from './utils/parseInput.js';
import { defaultClasses } from './styles.js';

class PredefinedRanges extends Component {

  constructor(props, context) {
    super(props, context);

    this.styles = this.props.theme;
  }

  handleSelect(name, event) {
    event.preventDefault();

    const range = this.props.ranges[name];

    this.props.onSelect({
      startDate : parseInput(range['startDate'], null, 'startOf'),
      endDate   : parseInput(range['endDate'], null, 'endOf'),
    }, PredefinedRanges);
  }

  renderRangeList(classes) {
    const { ranges, range, onlyClasses, addCloseButton, onCloseCallback } = this.props;
    const { styles } = this;


    const items = Object.keys(ranges).map(name => {
      const active = (
        parseInput(ranges[name].startDate, null, 'startOf').isSame(range.startDate) &&
        parseInput(ranges[name].endDate, null, 'endOf').isSame(range.endDate)
      );

      const predefinedRangeClass = classnames({
        [classes.predefinedRangesItem]: true,
        [classes.predefinedRangesItemActive]: active
      });

      const style = {
        ...styles['PredefinedRangesItem'],
        ...(active ? styles['PredefinedRangesItemActive'] : {}),
      };
      return (
        <a
          href='#'
          key={'range-' + name}
          className={predefinedRangeClass}
          style={ onlyClasses ? undefined : style }
          onClick={this.handleSelect.bind(this, name)}
        >
          {name}
        </a>
      );
    }.bind(this));

    if (addCloseButton) {
      items.push(<hr key='horRule'/>);
      items.push(        
        <a
          href='#'
          key={'range-close'}
          className={classnames(classes.predefinedRangesItem, classes.predefinedRangesItemActive)}
          style={{ ...styles['PredefinedRangesItem'], ...styles['PredefinedRangesItemActive'] }}
          onClick={onCloseCallback}
        >
          Close
        </a>)
    }
    return items;
  }

  render() {
    const { style, onlyClasses, classNames } = this.props;
    const { styles } = this;

    const classes = { ...defaultClasses, ...classNames };

    return (
      <div
        style={onlyClasses ? undefined : { ...styles['PredefinedRanges'], ...style }}
        className={ classes.predefinedRanges }
      >
        { this.renderRangeList(classes) }
      </div>
    );
  }
}

PredefinedRanges.defaultProps = {
  onlyClasses : false,
  classNames  : {}
};

PredefinedRanges.propTypes = {
  ranges      : PropTypes.object.isRequired,
  onlyClasses : PropTypes.bool,
  classNames  : PropTypes.object
}

export default PredefinedRanges;
