// Sachin Dhalani - [04/10/2022] - Interface for user schema  -- [CREATED]
import { Types, Document } from 'mongoose';

// interface to store user details.

export type TPlanType = 'FREE' | 'STANDARD' | 'ORGANIZATION';
export type TSupportPlan = 'DEVELOPER' | 'DEVOPS';
export type TAccountType = 'INDIVIDUAL' | 'ORGANIZATION';
export type TAccessType = 'ADMIN' | 'CUSTOM' | 'USER';

export interface IStoreUserInfo {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
  accountType: TAccountType;
  isAdmin: boolean;
  organizationId?: string;
  groups?: {
    groupId: string;
    accessType: TAccessType;
    roles: {
      id: string;
      name: string;
    }[];
  }[];
  developmentPlan?: TPlanType;
  supportPlan?: TSupportPlan[];
}

export interface IUserDetails extends Document {
  name: string;
  email: string;
  password: string;
  accountType: TAccountType;
  isAdmin: boolean;
  organizationId?: Types.ObjectId;
  groups: {
    groupId: string;
    accessType: TAccessType;
    roles: {
      id: string;
      name: string;
    }[];
  }[];
  developmentPlan?: any;
  supportPlan?: any;
}

export interface IUserWithRolesDetails {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
  accountType: TAccountType;
  isAdmin: boolean;
  organizationId?: Types.ObjectId;
  groups: {
    groupId: string;
    accessType: TAccessType;
    roles: {
      deployment: boolean;
      composeApplication: boolean;
     
    };
  }[];
}

export interface IAddUserToGroups {
  userId: string;
  groups: {
    groupId: string;
    accessType: string;
  }[];
}
