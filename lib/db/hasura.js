export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  const response = await queryHasuraGraphQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );
  console.log({ response, issuer });
  const usersArrLength = response?.data?.users?.length;
  console.log("usersArrisNewUser: ", typeof usersArrLength, { usersArrLength });

  return usersArrLength;
  // return response?.data?.users?.lenght === 0;
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;
  const { issuer, email, publicAddress } = metadata;
  const response = await queryHasuraGraphQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );
  console.log({ response, issuer });
  return response;
}

export async function queryHasuraGraphQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function findVideoIdByUser(token, userId, videoId) {
  console.log("findVideoIdByUser ***", videoId, token, userId);
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    Stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      watched
      favourited
      userId
      id
      videoId
    }
  }
`;

  // const { issuer, email, publicAddress } = metadata;
  const response = await queryHasuraGraphQL(
    operationsDoc,
    "findVideoIdByUserId",
    {
      userId,
      videoId,
    },
    token
  );
  const statsData = response?.data?.Stats;
  console.log("statsData here", response, statsData);

  // return response;
  return statsData;
}

export async function insertStats(
  token,
  { favourited, watched, userId, videoId }
) {
  const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    insert_Stats_one(object: {
      favourited: $favourited, 
      userId: $userId, 
      watched: $watched, 
      videoId: $videoId
    }) {
        favourited
        userId
        watched
        videoId
    }
  }
`;

  return await queryHasuraGraphQL(
    operationsDoc,
    "insertStats",
    { favourited, userId, watched, videoId },
    token
  );
}

export async function updateStats(
  token,
  { favourited, watched, userId, videoId }
) {
  const operationsDoc = `   
mutation updateStats($favourited: Int!, $userId: String!, $videoId: String!, $watched: Boolean! ) { 
  update_Stats(
    where: {
      userId: {_eq: $userId}, 
      videoId: {_eq: $videoId}, 
    }
    _set: {
      favourited: $favourited, 
      watched: $watched
    }) { 
      returning {
        favourited
        userId
        videoId
        watched    
      }   
  }
}
`;

  return await queryHasuraGraphQL(
    operationsDoc,
    "updateStats",
    {
      favourited,
      watched,
      userId,
      videoId,
    },
    token
  );
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query watchedVideos($userId: String) {
    Stats(where: {watched: {_eq: true}, userId: {_eq: $userId}}) {      
      videoId          
    }
  }
`;

  const response = await queryHasuraGraphQL(
    operationsDoc,
    "watchedVideos",
    { userId },
    token
  );

  return response?.data?.Stats;
}

export async function getMyListVideos(userId, token) {
  const operationsDoc = `
  query favouritedVideos($userId: String) {
    Stats(where: {
      userId: {_eq: $userId}
      favourited: {_eq: 1}, 
    }) {  
      videoId         
    }
  }
`;

  const response = await queryHasuraGraphQL(
    operationsDoc,
    "favouritedVideos",
    { userId },
    token
  );

  return response?.data?.Stats;
}
