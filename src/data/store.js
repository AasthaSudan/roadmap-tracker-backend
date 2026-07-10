// In-memory data store
// For now we are not using a database, so we keep data in arrays.
// Later controllers can import these same arrays from one central place.

const roadmaps = [
    {
        id: 1,
        title: 'Backend Fundamentals',
        description: '31-day backend learning roadmap',
    },
    {
        id: 2,
        title: 'Flutter Revision',
        description: 'Brush up Flutter before interviews',
    },
];

// In-memory user database
const users = [];

/*
User shape examples:

1) Normal email/password user
{
  id: 1,
  name: 'Aastha',
  email: 'aastha@example.com',
  password: 'hashed-password',
  provider: 'local'
}

2) GitHub user
{
  id: 2,
  name: 'Aastha Sudan',
  email: null,
  password: null,
  provider: 'github',
  githubId: 123456,
  githubUsername: 'aasthaSudan',
  githubAccessToken: 'gho_xxx'
}
*/

module.exports = {
    roadmaps,
    users,
};