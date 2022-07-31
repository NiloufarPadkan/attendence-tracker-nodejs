const WorkSchedule = require("../../../../models/WorkSchedule");
const Employee = require("../../../../models/Employee");
exports.showWorkSchedule = async (req) => {
  try {
    let mySchedule = await Employee.findOne({
      where: {
        id: req.Employee.id,
      },
      include: [
        {
          model: WorkSchedule,
        },
      ],
    });

    return {
      workDays: mySchedule.workdays,
      workSchedule: mySchedule.workSchedule,
    };
  } catch (error) {
    throw new Error(error);
  }
};
