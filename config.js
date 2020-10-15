const config = {
  LUNCH_POLL_DURATION_IN_MINUTES: 15,
  SNACK_POLL_DURATION_IN_MINUTES: 25,
  CONV_NAME: process.env.CONV_NAME || 'Grabfood',
  CONV_ID: process.env.CONV_ID || 'grid_value',
};

module.exports = config;
