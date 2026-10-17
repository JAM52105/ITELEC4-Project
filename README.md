# ITELEC4 Project

This project models a simple campus learning platform for managing users, courses, and submissions. It is designed to demonstrate advanced TypeScript concepts such as interfaces, type aliases, generics, utility types, and enums while keeping the domain easy to understand for future modules.

## Live deployments
- Frontend: https://itelec-4-project.vercel.app
- Backend API: https://jam52105-itelect4-backend.vercel.app
- Backend health check: https://jam52105-itelect4-backend.vercel.app/api/health

## Repositories
- Frontend: https://github.com/JAM52105/ITELEC4-Project
- Backend: https://github.com/JAM52105/itelect4-backend

## Types defined so far
- User
- Course
- Submission
- StudentWithCourse
- ApiResponse<T>
- UserUpdate
- UserPreview
- PublicUser
- RoleCount
- SubmissionStatus

## How to run
1. Install dependencies:
   npm install
2. Run the TypeScript entry point:
   npx ts-node src/index.ts
3. Check for strict-mode errors:
   npx tsc --noEmit
