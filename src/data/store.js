// In-memory data store
// For now we are not using a database, so we keep data in arrays.
// Later controllers/services/repositories can import these same arrays from one central place.

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

// In-memory topics database
const topics = [
    {
        id: 1,
        roadmapId: 1,
        title: 'Node.js Intro',
        notes: 'Understand runtime, V8 and where Node is used',
        status: 'completed',
        timeStarted: '2026-07-01T10:00:00.000Z',
        timeEnded: '2026-07-01T11:30:00.000Z',
    },
    {
        id: 2,
        roadmapId: 1,
        title: 'Express Basics',
        notes: 'Understand app, routes, req, res',
        status: 'in-progress',
        timeStarted: '2026-07-02T09:30:00.000Z',
        timeEnded: null,
    },
];

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
    topics,
};