// Sachin Dhalani - [04/10/2022] - CRUD operation for user details --[CREATED]
import STATUS from '../constants/statusCode';
import { User } from '../db-init/modal/user-details';
import { Result } from '../interfaces/result';
import {
  IAddUserToGroups,
  IStoreUserInfo,
  IUserDetails,
} from '../interfaces/user-details';
import { CustomError } from '../middlewares/error';
import logger from '../utils/logger';

// function for storing user details.
export const addUserDetails = async (
  data: IStoreUserInfo
): Promise<Result<IUserDetails>> => {
  try {
    const date = new Date();
    const todayDate = date.setDate(date.getDate() + 7);
    // destructuring data
    const {
      name,
      mobileNumber,
      email,

      password,
      isAdmin,
      groups,
      organizationId,
      supportPlan,
      accountType,
    } = data;
    // creating new user details data in database.
    const result = await User.create({
      name,
      email,
      mobileNumber,
      password,
      isAdmin,
      groups,
      organizationId,
      developmentPlan: {
        plan: 'FREE',
        isActivated: true,
        expiry: todayDate,
      },
      supportPlan,
      accountType,
    });

    // if user details stored than return success as true
    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userDetails/storeUserDetails" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

// Function to fetch user details by emailId
export const fetchUserDetailsByEmail = async (
  email: string
): Promise<Result<IUserDetails>> => {
  try {
    // Using findOne Function to fetch the account.
    const result = await User.findOne({
      email,
    }).exec();

    if (!result) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: 'User not found',
      };
      throw err;
    }
    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userDetails/fetchUserDetailsByUserName" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning success as false
    return Result.error(error);
  }
};

export const fetchUserById = async (
  userId: string
): Promise<Result<IUserDetails>> => {
  try {
    const result = await User.findById(userId).exec();

    if (!result) {
      const err: CustomError = {
        statusCode: STATUS.NOT_FOUND,
        customMessage: 'User not found',
      };
      throw err;
    }

    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/endpointRepo/fetchUserById" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    return Result.error(error);
  }
};

//fetch user by organization id
export const fetchUserByOrganizationId = async (
  organizationId: string
): Promise<Result<IUserDetails[]>> => {
  try {
    const result = await User.find({ organizationId }).exec();

    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userDetails/fetchUserByOrganizationId" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    return Result.error(error);
  }
};

//fetch User by group id
export const fetchUserByGroupId = async (
  userId: string,
  groupId: string
): Promise<Result<IUserDetails>> => {
  try {
    const result = await User.findOne({
      _id: userId,
      'groups.groupId': groupId,
    }).exec();

    if (!result) {
      const err: CustomError = {
        statusCode: STATUS.NOT_FOUND,
        customMessage: 'User not found',
      };
      throw err;
    }

    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userDetails/fetchUserByGroupId" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return Result.error(error);
  }
};

//fetch User by group id
export const addUserToGroups = async (data: any): Promise<Result> => {
  try {
    let newData = {
      userId: data.userId,
      groups: [
        { groupId: data.groups[0].groupId, roles: data.groups[0].roles },
      ],
    };
    console.log(
      '%c Line:186 🌮 data',
      'color:#fca650',
      newData.groups[0].roles
    );
    await User.updateOne(
      { _id: newData.userId },
      { $push: { groups: { $each: newData.groups } } },
      { upsert: true }
    ).exec();

    return Result.ok();
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userDetails/fetchUserByGroupId" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return Result.error(error);
  }
};

// update user details
export const updateUserDevelopmentPlanDetailsById = async (
  data: any
): Promise<Result> => {
  try {
    await User.updateOne(
      { _id: data.userId },
      {
        $set: {
          'developmentPlan.plan': data.developmentPlan.plan,
          'developmentPlan.isActivated': data.developmentPlan.isActivated,
          'developmentPlan.period': data.developmentPlan.period,
          'developmentPlan.expiry': data.developmentPlan.expiry,
        },
      }
    ).exec();

    return Result.ok();
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userDetails/updateUserDevelopmentPlanDetailsById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return Result.error(error);
  }
};

export const updateUserHostingPlanDetailsById = async (
  data: any
): Promise<Result> => {
  try {
    await User.updateOne(
      { _id: data.userId },
      {
        $set: {
          'hostingPlan.plan': data.hostingPlan.plan,
          'hostingPlan.isActivated': data.hostingPlan.isActivated,
          'hostingPlan.period': data.hostingPlan.period,
          'hostingPlan.expiry': data.hostingPlan.expiry,
        },
      }
    ).exec();

    return Result.ok();
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userDetails/updateUserHostingPlanDetailsById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return Result.error(error);
  }
};

export const updateUserupportPlanDetailsById = async (
  data: any
): Promise<Result> => {
  try {
    await User.updateOne(
      { _id: data.userId },
      {
        $set: {
          'supportPlan.plan': data.supportPlan.plan,
          'supportPlan.isActivated': data.supportPlan.isActivated,
          'supportPlan.period': data.supportPlan.period,
          'supportPlan.expiry': data.supportPlan.expiry,
        },
      }
    ).exec();

    return Result.ok();
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userDetails/updateUserupportPlanDetailsById" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    return Result.error(error);
  }
};
