# Free Fire Tournament Admin Requirements

This document contains all the necessary Firebase configuration details and admin requirements for the Free Fire Tournament application.

## Firebase Configuration

### Project Settings
- **Project ID**: esports-hp
- **Web App ID**: 1:578218788593:web:995d61bdbbfe374bf6cb50
- **API Key**: AIzaSyCao2ih2XM8ZkEUpNrl7qs4AZKgq8eitmM
- **Auth Domain**: esports-hp.firebaseapp.com
- **Storage Bucket**: esports-hp.firebasestorage.app
- **Messaging Sender ID**: 578218788593
- **Database URL**: https://esports-hp-default-rtdb.asia-southeast1.firebasedatabase.app
- **Measurement ID**: G-ELP77R773B

## Database Structure

### Authentication
Setup Firebase Authentication with the following methods:
- Email/Password
- Google Sign-in
- Facebook Sign-in (optional)
- Twitter Sign-in (optional)

### Firestore Collections

#### Users Collection
```
users/{userId}
├── username: string
├── email: string
├── displayName: string
├── photoURL: string (optional)
├── createdAt: timestamp
├── level: number
├── rank: string
├── tournaments: number
├── matches: number
├── kills: number
├── tournamentsWon: number
└── stats: {
    ├── winRate: number
    ├── kdRatio: number
    ├── headshotPercentage: number
    └── avgSurvivalTime: string
}
```

#### Tournaments Collection
```
tournaments/{tournamentId}
├── name: string
├── description: string
├── format: string
├── teamSize: number
├── maxParticipants: number
├── participantsCount: number
├── entryFee: number
├── prizePool: number
├── startDate: timestamp
├── registrationEndDate: timestamp
├── registrationOpen: boolean
└── rules: array<string>
```

#### Teams Collection
```
teams/{teamId}
├── name: string
├── captain: string (userId)
├── createdAt: timestamp
├── logo: string (optional)
├── tournamentsPlayed: number
└── badges: array<string>
```

#### Tournament Registrations Collection
```
tournamentRegistrations/{registrationId}
├── tournamentId: string
├── teamId: string
├── registeredAt: timestamp
└── status: string (pending, approved, rejected)
```

#### Matches Collection
```
matches/{matchId}
├── tournamentId: string
├── roundNumber: number
├── matchNumber: number
├── startTime: timestamp
├── status: string (scheduled, live, completed)
├── winners: array<string> (teamIds)
└── participants: array<string> (teamIds)
```

#### Match Results Collection
```
matchResults/{resultId}
├── matchId: string
├── teamId: string
├── position: number
├── kills: number
├── points: number
└── timestamp: timestamp
```

#### User Activities Collection
```
userActivities/{activityId}
├── userId: string
├── text: string
├── icon: string
├── iconColor: string
└── timestamp: timestamp
```

## Admin Portal Requirements

The admin portal should include the following functionality:

1. **Authentication Management**
   - View registered users
   - Enable/disable user accounts
   - Reset passwords

2. **Tournament Management**
   - Create, edit, and delete tournaments
   - Open/close tournament registrations
   - View and approve team registrations
   - Set tournament schedules

3. **Match Management**
   - Create and schedule matches
   - Update match status (scheduled, live, completed)
   - Enter match results
   - Generate tournament brackets

4. **Team Management**
   - View team details
   - Approve/reject team formations
   - Edit team information

5. **Content Management**
   - Add tournament announcements
   - Update tournament rules
   - Manage prize pools

6. **Reporting**
   - View tournament statistics
   - Track user engagement
   - Monitor registration trends

## Security Rules

Implement the following Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profile data - readable by anyone, writable only by the user
    match /users/{userId} {
      allow read;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == userId;
    }
    
    // Tournaments - readable by anyone, writable only by admins
    match /tournaments/{tournamentId} {
      allow read;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Teams - readable by anyone, writable by team captain or admins
    match /teams/{teamId} {
      allow read;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.captain || 
                             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Tournament Registrations - readable by associated users, writable by team captains or admins
    match /tournamentRegistrations/{registrationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                             (get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.captain == request.auth.uid || 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Matches - readable by anyone, writable only by admins
    match /matches/{matchId} {
      allow read;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Match Results - readable by anyone, writable only by admins
    match /matchResults/{resultId} {
      allow read;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // User Activities - readable by associated user, writable by system and admins
    match /userActivities/{activityId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && 
                    (request.auth.uid == request.resource.data.userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```

## Cloud Functions

Implement the following Cloud Functions:

1. **onTournamentRegistration**: Update participant count when a team registers for a tournament
2. **onMatchComplete**: Update team and player statistics after a match is completed
3. **onUserCreation**: Set up default user profile upon registration
4. **scheduleTournamentReminders**: Send notifications before tournament start
5. **updateUserRanking**: Periodic function to recalculate user rankings based on performance

## Storage Structure

Set up Firebase Storage with the following structure:

```
/user_avatars/{userId}.jpg
/team_logos/{teamId}.jpg
/tournament_banners/{tournamentId}.jpg
/tournament_thumbnails/{tournamentId}.jpg
```

## Environment Variables

The following environment variables should be set:

```
VITE_FIREBASE_API_KEY=AIzaSyCao2ih2XM8ZkEUpNrl7qs4AZKgq8eitmM
VITE_FIREBASE_AUTH_DOMAIN=esports-hp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=esports-hp
VITE_FIREBASE_STORAGE_BUCKET=esports-hp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=578218788593
VITE_FIREBASE_APP_ID=1:578218788593:web:995d61bdbbfe374bf6cb50
VITE_FIREBASE_MEASUREMENT_ID=G-ELP77R773B
VITE_FIREBASE_DATABASE_URL=https://esports-hp-default-rtdb.asia-southeast1.firebasedatabase.app
```

## Admin Role Assignment

To assign admin privileges to a user:
1. Create the user through normal registration
2. Use Firebase Authentication console to get the user's UID
3. Manually add the user to the 'users' collection with `isAdmin: true`
4. Alternatively, use Firebase Admin SDK to directly update the user's custom claims