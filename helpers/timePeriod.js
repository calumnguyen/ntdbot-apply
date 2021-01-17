const moment = require('moment');

const weekly = (date = moment()) => {
  return moment(date).startOf('isoWeek').add(1, 'week');
};

const biWeekly = (date = moment()) => {
  let nextMonday = weekly(date);

  // create new instance
  let secondMonday = nextMonday.clone();
  secondMonday.startOf('isoWeek').add(1, 'week');

  // create new instance
  let thirdMonday = secondMonday.clone();
  thirdMonday.startOf('isoWeek').add(1, 'week');

  return [nextMonday, thirdMonday];
};

const monthly = (date = moment()) => {
  return moment(date).endOf('month').startOf('isoweek');
};

function datePrompt(period, date) {
  console.log(
    `your new changes of ${period} will be working after the completion of the next effective date.${
      date.length > 0 ? date[1] : date[0]
    }`
  );
}

module.exports = { weekly, biWeekly, monthly, datePrompt };
