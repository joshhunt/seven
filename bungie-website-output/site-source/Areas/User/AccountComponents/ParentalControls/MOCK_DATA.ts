import { PlayerContextProps } from "./types";

import { ParentalControls } from "@Platform";

export const PARENT_WITH_ASSIGNED_CHILDREN = {
  responseStatus: 20,
  playerContext: {
    displayName: "exampleParentOrGuardian",
    profilePicturePath: "../fake/path",
    membershipId: 1000,
    dateOfBirth: "1/1/1990 00:00:00 AM",
    isEmailVerified: true,
    ageCategory: 3,
    parentOrGuardianAssignmentStatus: 2,
    childData: [
      {
        preferences: [],
        permissions: [],
      },
    ],
  },
  assignedChildren: [
    {
      displayName: "exampleChild01",
      profilePicturePath: "../fake/path",
      membershipId: 1001,
      dateOfBirth: "1/1/2010 00:00:00 AM",
      isEmailVerified: false,
      ageCategory: 1,
      parentOrGuardianAssignmentStatus: 2,
      childData: [
        {
          preferences: [
            {
              id: 0,
              value: true,
            },
            {
              id: 1,
              value: true,
            },
            {
              id: 3,
              value: true,
            },
          ],
          permissions: [
            {
              id: 0,
              value: true,
            },
            {
              id: 1,
              value: true,
            },
            {
              id: 3,
              value: true,
            },
          ],
        },
      ],
    },
    {
      displayName: "exampleChild02",
      profilePicturePath: "../fake/path",
      membershipId: 1001,
      dateOfBirth: "1/1/2010 00:00:00 AM",
      isEmailVerified: false,
      ageCategory: 1,
      parentOrGuardianAssignmentStatus: 2,
      childData: [
        {
          preferences: [
            {
              id: 0,
              value: true,
            },
            {
              id: 1,
              value: true,
            },
            {
              id: 3,
              value: true,
            },
          ],
          permissions: [
            {
              id: 0,
              value: false,
            },
            {
              id: 1,
              value: true,
            },
            {
              id: 3,
              value: true,
            },
          ],
        },
      ],
    },
  ],
};

export const PARENT_WITH_NO_ASSIGNED_CHILDREN = {
  responseStatus: 20,
  playerContext: {
    displayName: "exampleParentOrGuardian",
    profilePicturePath: "../fake/path",
    membershipId: 1001,
    dateOfBirth: "1/1/1990 00:00:00 AM",
    isEmailVerified: true,
    ageCategory: 3,
    parentOrGuardianAssignmentStatus: 2,
    childData: [
      {
        preferences: [],
        permissions: [],
      },
    ],
  },
  assignedChildren: [],
};

export const EXAMPLE_CHILD_WITH_ADULT = {
  responseStatus: 20,
  playerContext: {
    displayName: "exampleChild01",
    profilePicturePath: "../fake/path",
    membershipId: 1001,
    dateOfBirth: "1/1/2010 00:00:00 AM",
    isEmailVerified: false,
    ageCategory: 1,
    parentOrGuardianAssignmentStatus: 2,
    childData: [
      {
        preferences: [
          {
            id: 0,
            value: true,
          },
          {
            id: 1,
            value: true,
          },
          {
            id: 3,
            value: false,
          },
        ],
        permissions: [
          {
            id: 0,
            value: true,
          },
          {
            id: 1,
            value: true,
          },
          {
            id: 3,
            value: true,
          },
        ],
      },
    ],
  },
  assignedChildren: [],
};
export const EXAMPLE_CHILD_WITHOUT_ADULT = {
  responseStatus: 20,
  playerContext: {
    displayName: "exampleChild03",
    profilePicturePath: "../fake/path",
    membershipId: 1010101,
    dateOfBirth: "1/1/2010 00:00:00 AM",
    isEmailVerified: false,
    ageCategory: 1,
    parentOrGuardianAssignmentStatus: 3,
    childData: [
      {
        preferences: [
          {
            id: 0,
            value: true,
          },
          {
            id: 1,
            value: true,
          },
          {
            id: 3,
            value: false,
          },
        ],
        permissions: [
          {
            id: 0,
            value: true,
          },
          {
            id: 1,
            value: true,
          },
          {
            id: 3,
            value: true,
          },
        ],
      },
    ],
  },
  assignedChildren: [],
};

export const BULK_PERMISSIONS_UPDATE_FOR_CHILD = {
  permissionsToUpdate: [
    {
      id: 0,
      value: true,
      isSetByParentOrGuardian: true,
    },
    {
      id: 1,
      value: true,
      isSetByParentOrGuardian: true,
    },
  ],
};

export const BULK_PREFERENCES_UPDATE_FOR_CHILD = {
  preferencesToUpdate: [
    {
      id: 0,
      value: true,
    },
    {
      id: 1,
      value: true,
    },
  ],
};

/*TO BE DELETED */
export const MOCK_CHILD_DATA_LINKED = {
  PlayerId: "0202020202",
  UniqueName: "Tarantula#8900",
  ProfilePicturePath: null,
  GuardianId: "002002002002002",
  Email: "myEmail@gmail.com",
  DateOfBirth: "01/01/12",
  Category: 1,
  LinkStatus: 2,
  IsVerifiedAdult: false,
  IsEmailVerified: true,
} as ParentalControls.ParentalControlsPlayerContext;

export const MOCK_CHILD_CHILDCONTEXT_1 = {
  PlayerId: "0202020202",
  UniqueName: "Tarantula#8900",
  ProfilePicturePath: null,
  Permissions: [
    { Name: "voiceChat", Value: true },
    { Name: "textChat", Value: false },
    { Name: "platformPurchases", Value: true },
  ],
} as ParentalControls.ParentalControlsChildContext;

export const MOCK_CHILD_DATA_PENDING = {
  PlayerId: "0303030303",
  UniqueName: "xXarmageddonXx#3200",
  ProfilePicturePath: null,
  GuardianId: "003003003003003",
  Email: "myEmail@gmail.com",
  DateOfBirth: "01/01/12",
  Category: 1,
  LinkStatus: 1,
  IsVerifiedAdult: false,
  IsEmailVerified: true,
} as ParentalControls.ParentalControlsPlayerContext;

export const MOCK_CHILD_CHILDCONTEXT_2 = {
  PlayerId: "0303030303",
  UniqueName: "xXarmageddonXx#3200",
  ProfilePicturePath: null,
  Permissions: [
    { Name: "voiceChat", Value: true },
    { Name: "textChat", Value: false },
    { Name: "platformPurchases", Value: false },
  ],
} as ParentalControls.ParentalControlsChildContext;

export const MOCK_CHILD_DATA_LINKED_2 = {
  PlayerId: "0404040404",
  UniqueName: "RabidMonster#9000",
  ProfilePicturePath: null,
  GuardianId: "004004004004004",
  Email: "myEmail@gmail.com",
  DateOfBirth: "01/01/12",
  Category: 1,
  LinkStatus: 2,
  IsVerifiedAdult: false,
  IsEmailVerified: true,
} as ParentalControls.ParentalControlsPlayerContext;

export const MOCK_CHILD_CHILDCONTEXT_3 = {
  PlayerId: "0404040404",
  UniqueName: "RabidMonster#9000",
  ProfilePicturePath: null,
  Permissions: [
    { Name: "voiceChat", Value: true },
    { Name: "textChat", Value: false },
    { Name: "platformPurchases", Value: false },
  ],
} as ParentalControls.ParentalControlsChildContext;

export const MOCK_ADULT_PLAYER_CONTEXT = {
  PlayerId: "0101010101",
  UniqueName: "Tomatillo#1001",
  ProfilePicturePath: null,
  GuardianId: "001001001001001",
  Email: "myEmail@gmail.com",
  DateOfBirth: "01/01/01",
  Category: 3,
  LinkStatus: 2,
  IsVerifiedAdult: true,
  IsEmailVerified: true,
} as PlayerContextProps;

export const MOCK_ADULT_PLAYER_CONTEXT_PENDING_EMAIL = {
  ...MOCK_ADULT_PLAYER_CONTEXT,
  IsEmailVerified: false,
  IsVerifiedAdult: false,
} as ParentalControls.ParentalControlsPlayerContext;

export const MOCK_CHILD_PLAYER_CONTEXT = {
  PlayerId: "0505050505",
  UniqueName: "Rugrat#3300",
  ProfilePicturePath: null,
  GuardianId: "0101010101",
  Email: "myEmail@gmail.com",
  DateOfBirth: "01/01/01",
  Category: 1,
  LinkStatus: 2,
  IsVerifiedAdult: true,
  IsEmailVerified: true,
} as PlayerContextProps;

export const MOCK_CHILD_PLAYER_CONTEXT_RESPONSE_NO_ADULT = {
  ...MOCK_ADULT_PLAYER_CONTEXT,
  LinkStatus: 0,
} as ParentalControls.ParentalControlsPlayerContext;

export const MOCK_ADULT_PLAYER_CONTEXT_RESPONSE_WITH_CHILDREN = {
  Player: MOCK_ADULT_PLAYER_CONTEXT,
  Children: [MOCK_CHILD_CHILDCONTEXT_3, MOCK_CHILD_CHILDCONTEXT_1],
  Preferences: [],
} as ParentalControls.ParentalControlsGetPlayerContextResponse;

export const MOCK_ADULT_PLAYER_CONTEXT_RESPONSE_WITH_PENDING = {
  Player: MOCK_ADULT_PLAYER_CONTEXT_PENDING_EMAIL,
  Children: [MOCK_CHILD_CHILDCONTEXT_2],
  Preferences: [],
} as ParentalControls.ParentalControlsGetPlayerContextResponse;

export const MOCK_ADULT_PLAYER_CONTEXT_RESPONSE_WITHOUT_CHILDREN = {
  Player: MOCK_ADULT_PLAYER_CONTEXT,
  Children: [],
  Preferences: [],
} as ParentalControls.ParentalControlsGetPlayerContextResponse;

export const MOCK_CHILD_PLAYER_CONTEXT_RESPONSE_WITH_ADULT = {
  Player: MOCK_CHILD_PLAYER_CONTEXT,
  Children: [],
  Preferences: [
    { Preference: { Name: "voiceChat", Value: false }, IsEditable: false },
    { Preference: { Name: "textChat", Value: false }, IsEditable: false },
    {
      Preference: { Name: "platformPurchases", Value: true },
      IsEditable: true,
    },
  ],
} as ParentalControls.ParentalControlsGetPlayerContextResponse;

export const MOCK_CHILD_PLAYER_CONTEXT_RESPONSE_WITHOUT_ADULT = {
  Player: MOCK_CHILD_PLAYER_CONTEXT_RESPONSE_NO_ADULT,
  Children: [],
  Preferences: [],
} as ParentalControls.ParentalControlsGetPlayerContextResponse;
