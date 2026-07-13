// In-memory data store
// For now we are not using a database, so we keep data in arrays.
// Later controllers / repositories can import these same arrays from one central place.

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

const topics = [
    {
        id: 1,
        title: 'Express Basics',
        dayNumber: 1,
        notes: 'Understand app, routes, req, res',
        difficulty: 2,
        roadmapId: 1,
        status: 'DONE',
        timeStarted: '2026-07-01T10:00:00.000Z',
        timeEnded: '2026-07-01T12:00:00.000Z',
    },
    {
        id: 2,
        title: 'Middleware',
        dayNumber: 7,
        notes: 'Logger middleware and auth middleware practice',
        difficulty: 3,
        roadmapId: 1,
        status: 'NOT_STARTED',
        timeStarted: null,
        timeEnded: null,
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
    topics,
    users,
};