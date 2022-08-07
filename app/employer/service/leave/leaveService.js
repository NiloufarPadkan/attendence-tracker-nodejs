const Leave = require("../../../../models/Leave");
const Employee = require("../../../../models/Employee");
const WorkSchedule = require("../../../../models/WorkSchedule");
const Sequelize = require("sequelize");

exports.indexLeaves = async (req) => {
  try {
    const limit = req.query.size ? req.query.size : 3;
    const offset = req.query.page ? req.query.page * limit : 0;
    let leaves = await Leave.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: {
        workplaceId: req.params.id,
        read_receipt: false,
      },
      include: [
        {
          model: Employee,
          include: [
            {
              model: WorkSchedule,
            },
          ],
        },
      ],
    });
    let pages = Math.ceil(leaves.count / limit);

    let result = {
      count: leaves.count,
      pages: pages,
      leaves: leaves.rows,
    };
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

exports.approveLeaveRequest = async (req) => {
  try {
    let leaveRequestId = req.params.id;
    let leave = await Leave.findOne({
      where: {
        id: leaveRequestId,
      },
    });
    leave.status = 1;
    leave.read_receipt = 1;
    await leave.save();
    return leave;
  } catch (error) {
    throw new Error(error);
  }
};

exports.declineLeaveRequest = async (req) => {
  try {
    let leaveRequestId = req.params.id;
    let leave = await Leave.findOne({
      where: {
        id: leaveRequestId,
      },
    });
    leave.status = 0;
    leave.read_receipt = 1;
    await leave.save();
    return leave;
  } catch (error) {
    throw new Error(error);
  }
};
