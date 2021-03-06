import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import parseInput from './utils/parseInput.js';
import Calendar from './Calendar.js';
import PredefinedRanges from './PredefinedRanges.js';
import getTheme, { defaultClasses } from './styles.js';

class DateRange extends Component {

  constructor(props, context) {
    super(props, context);

    const { format, linkedCalendars, theme } = props;

    const startDate = parseInput(props.startDate, format, 'startOf');
    const endDate   = parseInput(props.endDate, format, 'endOf');

    this.state = {
      range     : { startDate, endDate },
      link      : linkedCalendars && endDate,
    }

    this.step = 0;
    this.styles = getTheme(theme);
  }

  componentDidMount() {
    const { onInit } = this.props;
    onInit && onInit(this.state.range);
  }

  orderRange(range) {
    const { startDate, endDate } = range;
    const swap = startDate.isAfter(endDate);

    if (!swap) return range;

    return {
      startDate : endDate,
      endDate   : startDate
    }
  }

  setRange(range, source, triggerChange) {
    const { onChange } = this.props
    range = this.orderRange(range);

    this.setState({ range }, () => triggerChange && onChange && onChange(range, source));
  }

  handleSelect(date, source) {
    if (date.startDate && date.endDate) {
      this.step = 0;
      return this.setRange(date, source, true);
    }

    const { startDate, endDate } = this.state.range;

    const range = {
      startDate : startDate,
      endDate   : endDate
    };

    switch (this.step) {
      case 0:
        range['startDate'] = date;
        range['endDate'] = date;
        this.step = 1;
        break;

      case 1:
        range['endDate'] = date;
        this.step = 0;
        break;
    }

    const triggerChange = !this.props.twoStepChange || this.step === 0 && this.props.twoStepChange;

    this.setRange(range, source, triggerChange);
  }

  handleLinkChange(direction) {
    const { link } = this.state;

    this.setState({
      link : link.clone().add(direction, 'months')
    });
  }

  componentWillReceiveProps(newProps) {
    // Whenever date props changes, update state with parsed variant
    if (newProps.startDate || newProps.endDate) {
      const format       = newProps.format || this.props.format;
      const startDate    = newProps.startDate   && parseInput(newProps.startDate, format, 'startOf');
      const endDate      = newProps.endDate     && parseInput(newProps.endDate, format, 'endOf');
      const oldStartDate = this.props.startDate && parseInput(this.props.startDate, format, 'startOf');
      const oldEndDate   = this.props.endDate   && parseInput(this.props.endDate, format, 'endOf');

      if (!startDate.isSame(oldStartDate) || !endDate.isSame(oldEndDate)) {
        this.setRange({
          startDate: startDate || oldStartDate,
          endDate: endDate || oldEndDate
        });
      }
    }
  }

  render() {
    const { ranges, format, linkedCalendars, style, defaultActivePreset, firstDayOfWeek, minDate, maxDate, classNames, onlyClasses, specialDays, lang, disableDaysBeforeToday, offsetPositive, shownDate, showArrows, rangedCalendars, addCloseButton, onCloseCallback } = this.props;
    const { range, link } = this.state;
    const { styles } = this;
    const classes = { ...defaultClasses, ...classNames };
    const yearsDiff = range.endDate.year() - range.startDate.year();
    const monthsDiff = range.endDate.month() - range.startDate.month();
    const diff = yearsDiff * 12 + monthsDiff;
    return (
      <div style={onlyClasses ? undefined : { ...styles['DateRange'], ...style }} className={classes.dateRange}>
        { ranges && (
          <PredefinedRanges
            defaultActivePreset={ defaultActivePreset }
            format={ format }
            ranges={ ranges }
            range={ range }
            theme={ styles }
            onSelect={this.handleSelect.bind(this)}
            onlyClasses={ onlyClasses }
            classNames={ classes } 
            addCloseButton={addCloseButton}
            onCloseCallback={onCloseCallback}/>
        )}
        
        <Calendar
            showArrows={ showArrows }
            shownDate={ range.startDate }
            disableDaysBeforeToday={ disableDaysBeforeToday }
            lang={ lang }
            offset={ 0 }
            link={ linkedCalendars && link }
            linkCB={ this.handleLinkChange.bind(this) }
            range={ range }
            format={ format }
            firstDayOfWeek={ firstDayOfWeek }
            theme={ styles }
            minDate={ minDate }
            maxDate={ maxDate }
            onlyClasses={ onlyClasses }
            specialDays={ specialDays }
            classNames={ classes }
            onChange={ this.handleSelect.bind(this) }  />
        <Calendar
            showArrows={ showArrows }
            shownDate={ range.endDate }
            disableDaysBeforeToday={ disableDaysBeforeToday }
            lang={ lang }
            offset={ 0 }
            link={ linkedCalendars && link }
            linkCB={ this.handleLinkChange.bind(this) }
            range={ range }
            format={ format }
            firstDayOfWeek={ firstDayOfWeek }
            theme={ styles }
            minDate={ minDate }
            maxDate={ maxDate }
            onlyClasses={ onlyClasses }
            specialDays={ specialDays }
            classNames={ classes }
            onChange={ this.handleSelect.bind(this) }  />
      </div>
    );
  }
}

DateRange.defaultProps = {
  linkedCalendars : false,
  theme           : {},
  format          : 'DD/MM/YYYY',
  onlyClasses     : false,
  offsetPositive  : false,
  classNames      : {},
  specialDays     : [],
  rangedCalendars : false,
  twoStepChange   : false,
  addCloseButton  : true
}

DateRange.propTypes = {
  defaultActivePreset: PropTypes.string,
  lang            : PropTypes.string,
  addCloseButton  : PropTypes.bool,
  format          : PropTypes.string,
  firstDayOfWeek  : PropTypes.number,
  startDate       : PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  endDate         : PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  minDate         : PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  maxDate         : PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  dateLimit       : PropTypes.func,
  ranges          : PropTypes.object,
  linkedCalendars : PropTypes.bool,
  twoStepChange   : PropTypes.bool,
  theme           : PropTypes.object,
  onInit          : PropTypes.func,
  onChange        : PropTypes.func,
  onlyClasses     : PropTypes.bool,
  specialDays     : PropTypes.array,
  offsetPositive  : PropTypes.bool,
  classNames      : PropTypes.object,
  rangedCalendars : PropTypes.bool,
  onCloseCallback : PropTypes.func
}

export default DateRange;
