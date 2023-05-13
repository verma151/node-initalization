// Sachin Dhalani [09/10/2022] - user details controller -- [CREATED]
require('dotenv').config();
import logger from '../utils/logger';
import * as userDetailsRepositories from '../repository/user-details';
import {
  IAddUserToGroups,
  IStoreUserInfo,
  IUserDetails,
} from '../interfaces/user-details';
import STATUS from '../constants/statusCode';
import { Result } from '../interfaces/result';
import { CustomError } from '../middlewares/error';
import axios from 'axios';

//  Function to store user details
export const addUserDetails = async (
  data: IStoreUserInfo
): Promise<Result<IUserDetails>> => {
  try {
    // Checking if email exist
    const isAccountIdExist =
      await userDetailsRepositories.fetchUserDetailsByEmail(data.email);
    // throws as error if user exist
    if (isAccountIdExist.isOk()) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `User already exist`,
      };
      throw err;
    }

    // calling the store user details repo function to store data
    const result = await userDetailsRepositories.addUserDetails(data);
    // If there is any error then throw error
    if (result.isError()) {
      throw result.error;
    }

    // Create the user on Grafana
    await axios.post(process.env.CREATE_GRAFANA_USER_URL!, {
      userId: result.data?._id,
    });

    // If there is no error then return as false
    return Result.ok(result.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/userDetails/addUserDetails" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // return negative response
    return Result.error(error);
  }
};

//  Function to display user details using user name
export const fetchUserDetailsByEmail = async (
  email: string
): Promise<Result<IUserDetails>> => {
  try {
    // To check whether email id already exist in db.
    const accountExist = await userDetailsRepositories.fetchUserDetailsByEmail(
      email
    );

    // If username doesn't exist throw an error
    if (accountExist.isError()) {
      throw accountExist.error;
    }
    // If there is no error return error as false
    return Result.ok(accountExist.data);
  } catch (error) {
    // logging the error
    logger.error(
      `at: "controllers/userDetails/fetchUserDetails" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // return negative response
    return Result.error(error);
  }
};

//fetch user by organization

export const addUserToGroups = async (data: any) => {
  try {
    for (let i = 0; i < data.length; i++) {
      const userDetails = await userDetailsRepositories.fetchUserById(
        data[i].userId
      );

      if (userDetails.isError()) {
        throw userDetails.error;
      }

      await userDetailsRepositories.addUserToGroups(data[i]);
    }

    return Result.ok();
  } catch (error) {
    logger.error(
      `at: "controllers/userDetails/fetchUserByGroup" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    return Result.error(error);
  }
};

export const updateUserDevelopmentPlanDetails = async (data: any) => {
  try {
    const isUserExist: Result<IUserDetails> =
      await userDetailsRepositories.fetchUserById(data.userId);

    if (isUserExist.isError()) {
      throw isUserExist.error;
    }

    const result: Result =
      await userDetailsRepositories.updateUserDevelopmentPlanDetailsById(data);

    if (result.isError()) {
      throw result.error;
    }

    return Result.ok();
  } catch (error) {
    logger.error(
      `at: "controllers/userDetails/updateUserDevelopmentPlanDetails" => ${JSON.stringify(
        error
      )}\n${error}`
    );

    return Result.error(error);
  }
};
