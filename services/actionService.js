const Action = require('../models/Action');

const recordAction = async (employeeId, actionType) => {
  try {
    const action = new Action({
      employeeId,
      action: actionType,
    });
    await action.save();
    console.log(`Action recorded: ${actionType} by user ${employeeId}`);
  } catch (error) {
    console.error('Error recording action:', error);
  }
};

module.exports = {
  recordAction,
};
