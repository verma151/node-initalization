// Sachin Dhalani - [09/10/2022] - Routes for performing user details operation. --[CREATED]
import express, { Request, Response, NextFunction } from 'express';
import STATUS from '../constants/statusCode';
import * as userController from '../controller/user-details';
import { IStoreUserInfo } from '../interfaces/user-details';
const router = express.Router();
import bcrypt from 'bcrypt';
// Route for signup
router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // destructuring data.
      const {
        name,
        mobileNumber,
        email,
        password,
        organizationId,
        accountType,
        isAdmin,
        groups,
        developmentPlan,
        supportPlan,
      } = req.body;

      // creating payload
      const data: IStoreUserInfo = {
        name,
        mobileNumber,
        email,

        password,
        organizationId,
        accountType,
        isAdmin,
        groups,
        developmentPlan,
        supportPlan,
      };
      // If any of these parameter are missing then return error
      if (!email || !password) {
        const err = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `email & Password can't be null`,
        };
        throw err;
      }

      // Call the addUserDetails controller function to store user in DB
      const result = await userController.addUserDetails(data);

      if (result.isError()) {
        throw result.error;
      }

      // return success response
      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: 'SignUp Successful',
        userId: result.data?._id,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Route for user login
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      // validating required parameters
      if (!email || !password) {
        const err = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `Username & Password can't be null.`,
        };
        throw err;
      }
      // To check whether user exists or not
      const isUserExist = await userController.fetchUserDetailsByEmail(email);

      if (isUserExist.isError()) {
        throw isUserExist.error;
      }

      // To check if entered password is correct
      const validatePassword = await bcrypt.compare(
        password,
        isUserExist.data!.password
      );

      // return success response when email & password is correct
      if (validatePassword) {
        res.status(STATUS.OK).json({
          status: STATUS.OK,
          message: 'Logged In Succesfully',
          userId: isUserExist.data?._id,
        });
      } else {
        const err = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `Invalid Credentials.`,
        };
        throw err;
      }
    } catch (error) {
      next(error);
    }
  }
);

// Route for user login
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      // validating required parameters
      if (!email || !password) {
        const err = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `Username & Password can't be null.`,
        };
        throw err;
      }
      // To check whether user exists or not
      const isUserExist = await userController.fetchUserDetailsByEmail(email);

      if (isUserExist.isError()) {
        throw isUserExist.error;
      }

      // To check if entered password is correct
      const validatePassword = await bcrypt.compare(
        password,
        isUserExist.data!.password
      );
      // return success response when email & password is correct
      if (validatePassword) {
        res.status(STATUS.OK).json({
          status: STATUS.OK,
          message: isUserExist.data,
        });
      }
      // throw an error if entered password is invalid
      else {
        const err = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: 'Invalid Credentials',
        };
        throw err;
      }
    } catch (err) {
      // throws an error if entered  email is invalid

      next(err);
    }
  }
);

// Route for group id
router.post(
  '/group',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { users } = req.body;

      const result = await userController.addUserToGroups(users);

      if (result.isError()) {
        throw result.error;
      }

      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: 'Users added to groups successfully',
      });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/plan/developmentPlan/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { developmentPlan } = req.body;

      const data = { userId, developmentPlan };

      const result = await userController.updateUserDevelopmentPlanDetails(
        data
      );

      if (result.isError()) {
        throw result.error;
      }

      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: `Upgraded to ${data.developmentPlan.name} plan successfully`,
      });

      // const result = await
    } catch (err) {
      next(err);
    }
  }
);


export default router;
