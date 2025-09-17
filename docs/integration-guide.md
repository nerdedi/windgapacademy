# Integration Guide

This guide provides step-by-step instructions for integrating Windgap Academy with external systems, third-party services, and school management platforms.

## 🏫 School Management System Integration

### 1. Student Information System (SIS) Integration

#### Prerequisites
- API access to your SIS (Google Classroom, Canvas, Blackboard, etc.)
- Administrative permissions to configure webhooks
- Windgap Academy admin account

#### Setup Steps

**Step 1: Configure Authentication**
```javascript
// config/integration.js
export const sisConfig = {
  provider: 'canvas', // or 'google-classroom', 'blackboard'
  apiEndpoint: 'https://your-school.instructure.com/api/v1',
  clientId: process.env.SIS_CLIENT_ID,
  clientSecret: process.env.SIS_CLIENT_SECRET,
  redirectUri: process.env.SIS_REDIRECT_URI
};
```

**Step 2: Install Integration Dependencies**
```bash
npm install canvas-api-client google-classroom-api
```

**Step 3: Implement User Sync**
```javascript
// services/sisSync.js
import { sisConfig } from '../config/integration.js';
import { createUser, updateUser } from '../utils/userManagement.js';

export async function syncStudents() {
  try {
    const students = await fetchStudentsFromSIS();
    
    for (const student of students) {
      const windgapUser = {
        id: student.id,
        email: student.email,
        name: student.name,
        role: 'learner',
        grade: student.grade_level,
        enrollments: student.enrollments
      };
      
      await createOrUpdateUser(windgapUser);
    }
  } catch (error) {
    console.error('Student sync failed:', error);
  }
}
```

### 2. Grade Passback Integration

**Step 1: Configure Grade Sync**
```javascript
// services/gradeSync.js
export async function syncGradeToSIS(userId, assignmentId, score) {
  const assignment = await getAssignment(assignmentId);
  const user = await getUser(userId);
  
  if (assignment.sisEnabled) {
    await sendGradeToSIS({
      studentId: user.sisId,
      assignmentId: assignment.sisAssignmentId,
      score: score,
      maxScore: assignment.maxScore,
      submittedAt: new Date()
    });
  }
}
```

## 🔐 Single Sign-On (SSO) Integration

### Google Workspace SSO

**Step 1: Configure Google OAuth**
```javascript
// config/auth.js
import { GoogleAuth } from 'google-auth-library';

export const googleAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/classroom.courses.readonly'
  ]
};
```

**Step 2: Implement SSO Handler**
```javascript
// pages/api/auth/google.js
import { googleAuthConfig } from '../../../config/auth.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { token } = req.body;
      const client = new GoogleAuth(googleAuthConfig);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleAuthConfig.clientId
      });
      
      const payload = ticket.getPayload();
      const user = await createOrUpdateUser({
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        provider: 'google'
      });
      
      res.json({ success: true, user });
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
}
```

### Microsoft Azure AD SSO

**Step 1: Configure Azure AD**
```javascript
// config/azure.js
export const azureConfig = {
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  tenantId: process.env.AZURE_TENANT_ID,
  redirectUri: process.env.AZURE_REDIRECT_URI
};
```

## 📊 Learning Analytics Integration

### 1. xAPI (Tin Can API) Integration

**Step 1: Install xAPI Dependencies**
```bash
npm install tincanjs
```

**Step 2: Configure xAPI Statements**
```javascript
// services/xapi.js
import TinCan from 'tincanjs';

export class XAPIService {
  constructor() {
    this.lrs = new TinCan.LRS({
      endpoint: process.env.XAPI_ENDPOINT,
      username: process.env.XAPI_USERNAME,
      password: process.env.XAPI_PASSWORD
    });
  }

  async trackLearningActivity(actor, verb, object, result = null) {
    const statement = {
      actor: {
        mbox: `mailto:${actor.email}`,
        name: actor.name
      },
      verb: {
        id: `http://adlnet.gov/expapi/verbs/${verb}`,
        display: { "en-US": verb }
      },
      object: {
        id: object.id,
        definition: {
          name: { "en-US": object.name },
          description: { "en-US": object.description }
        }
      }
    };

    if (result) {
      statement.result = result;
    }

    await this.lrs.saveStatement(statement);
  }
}
```

### 2. Learning Record Store (LRS) Integration

**Step 1: Track Game Completion**
```javascript
// components/GameModules/shared/analytics.js
import { XAPIService } from '../../../services/xapi.js';

const xapi = new XAPIService();

export async function trackGameCompletion(user, game, score) {
  await xapi.trackLearningActivity(
    user,
    'completed',
    {
      id: `windgap://games/${game.id}`,
      name: game.title,
      description: game.description
    },
    {
      score: {
        scaled: score / game.maxScore
      },
      completion: true,
      success: score >= game.passingScore
    }
  );
}
```

## 🔄 Data Synchronization

### 1. Real-time Sync with Webhooks

**Step 1: Setup Webhook Endpoints**
```javascript
// pages/api/webhooks/sis-update.js
import crypto from 'crypto';
import { updateUserFromSIS } from '../../../services/userSync.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Verify webhook signature
    const signature = req.headers['x-webhook-signature'];
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    try {
      const { event, data } = req.body;
      
      switch (event) {
        case 'student.updated':
          await updateUserFromSIS(data.student);
          break;
        case 'enrollment.created':
          await createEnrollment(data.enrollment);
          break;
        default:
          console.log('Unhandled webhook event:', event);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Webhook processing failed:', error);
      res.status(500).json({ error: 'Processing failed' });
    }
  }
}
```

### 2. Batch Data Import/Export

**Step 1: CSV Import Utility**
```javascript
// utils/csvImport.js
import csv from 'csv-parser';
import fs from 'fs';

export async function importStudentsFromCSV(filePath) {
  const students = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        students.push({
          email: row.email,
          name: `${row.first_name} ${row.last_name}`,
          grade: row.grade_level,
          studentId: row.student_id
        });
      })
      .on('end', async () => {
        try {
          for (const student of students) {
            await createOrUpdateUser(student);
          }
          resolve(students.length);
        } catch (error) {
          reject(error);
        }
      });
  });
}
```

## 🌐 API Integration Examples

### 1. REST API Client

**Step 1: Generic API Client**
```javascript
// services/apiClient.js
export class APIClient {
  constructor(baseURL, authToken) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
```

### 2. Third-party Service Integration

**Step 1: Zoom Integration for Virtual Classrooms**
```javascript
// services/zoomIntegration.js
import { APIClient } from './apiClient.js';

export class ZoomService extends APIClient {
  constructor() {
    super('https://api.zoom.us/v2', process.env.ZOOM_JWT_TOKEN);
  }

  async createMeeting(topic, startTime, duration) {
    return this.post('/users/me/meetings', {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration,
      settings: {
        join_before_host: true,
        waiting_room: false,
        auto_recording: 'cloud'
      }
    });
  }

  async getMeetingRecordings(meetingId) {
    return this.get(`/meetings/${meetingId}/recordings`);
  }
}
```

## 🔧 Configuration Management

### 1. Environment Configuration

**Step 1: Environment Variables Template**
```bash
# .env.example - Integration Configuration

# School Management System
SIS_PROVIDER=canvas
SIS_CLIENT_ID=your_sis_client_id
SIS_CLIENT_SECRET=your_sis_client_secret
SIS_REDIRECT_URI=http://localhost:3000/api/auth/sis/callback

# Single Sign-On
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_TENANT_ID=your_azure_tenant_id

# Learning Analytics
XAPI_ENDPOINT=https://your-lrs.com/xapi
XAPI_USERNAME=your_xapi_username
XAPI_PASSWORD=your_xapi_password

# Webhooks
WEBHOOK_SECRET=your_webhook_secret

# Third-party Services
ZOOM_JWT_TOKEN=your_zoom_jwt_token
```

### 2. Integration Testing

**Step 1: Integration Test Suite**
```javascript
// tests/integration/sis-integration.test.js
import { syncStudents } from '../../services/sisSync.js';
import { mockSISAPI } from '../mocks/sisAPI.js';

describe('SIS Integration', () => {
  beforeEach(() => {
    mockSISAPI.reset();
  });

  test('should sync students from SIS', async () => {
    mockSISAPI.mockStudents([
      { id: '123', email: 'student@school.edu', name: 'Test Student' }
    ]);

    await syncStudents();

    const user = await getUser('123');
    expect(user.email).toBe('student@school.edu');
  });

  test('should handle SIS API errors gracefully', async () => {
    mockSISAPI.mockError(500);

    await expect(syncStudents()).rejects.toThrow('API Error');
  });
});
```

## 📋 Integration Checklist

### Pre-Integration
- [ ] Obtain API credentials from external system
- [ ] Review API documentation and rate limits
- [ ] Set up development/testing environment
- [ ] Configure firewall rules if needed

### During Integration
- [ ] Implement authentication flow
- [ ] Add error handling and retries
- [ ] Set up data validation
- [ ] Configure logging and monitoring
- [ ] Test with sample data

### Post-Integration
- [ ] Conduct user acceptance testing
- [ ] Monitor API usage and performance
- [ ] Set up alerting for failures
- [ ] Document troubleshooting procedures
- [ ] Train administrators on new features

## 🆘 Troubleshooting

### Common Issues

**Authentication Failures**
```javascript
// Check token expiration
if (error.status === 401) {
  await refreshAuthToken();
  return retry(originalRequest);
}
```

**Rate Limiting**
```javascript
// Implement exponential backoff
const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
await new Promise(resolve => setTimeout(resolve, delay));
```

**Data Sync Conflicts**
```javascript
// Handle duplicate records
try {
  await createUser(userData);
} catch (error) {
  if (error.code === 'DUPLICATE_EMAIL') {
    await updateUser(userData);
  } else {
    throw error;
  }
}
```

## 📞 Support

For integration support:
1. Check the [troubleshooting section](#troubleshooting) above
2. Review API documentation for the external service
3. Check system logs for detailed error messages
4. Contact support with integration details and error logs

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks
- Monitor API usage and costs
- Update authentication tokens before expiration
- Review and update data mappings
- Test integrations after external system updates
- Backup integration configurations

### Version Updates
- Test integrations with new API versions in staging
- Update documentation for any breaking changes
- Communicate changes to administrators
- Plan rollback procedures if needed