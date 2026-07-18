# Expense Voucher Management System

A full-stack web application replacing a manual paper-based expense voucher approval process, built for Prachay Securities Pvt. Ltd.'s Full Stack Developer Internship assignment.

## Tech Stack

**Frontend:** React (Vite) + TypeScript, Tailwind CSS, shadcn/ui
**Backend:** Node.js, Express 5, MongoDB + Mongoose 9
**Auth:** JWT (access + refresh tokens)
**File Storage:** Cloudinary (signature images)

## Project Structure
expense-tracker/
├── backend/     # Express API
├── frontend/    # React app
└── README.md

## Setup Instructions

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own values
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Database Schema

### User

| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| password | String | required, bcrypt hashed |
| role | String | enum: employee / director / accounts |
| employeeId | String | optional |
| department | String | |
| refreshToken | String | set on login |

### Voucher

| Field | Type | Notes |
|---|---|---|
| voucherNumber | String | auto-generated, unique (e.g. EXP-2026-0001) |
| voucherDate | Date | defaults to creation date |
| expenseDate | Date | required |
| department | String | required |
| expenseTitle | String | required |
| expenseCategory | String | required |
| expenseDescription | String | |
| amount | Number | required, must be > 0 |
| employee | ObjectId (ref: User) | required |
| employeeSignature | String | Cloudinary URL, required before submit |
| status | String | enum: draft / pending_approval / approved / rejected |
| director | ObjectId (ref: User) | set on approve/reject |
| directorSignature | String | Cloudinary URL, required on approve |
| approvalDate | Date | set on approve |
| rejectionReason | String | required on reject |
| createdAt / updatedAt | Date | automatic (audit trail) |

### Counter

Internal collection used to atomically generate sequential voucher numbers per year, avoiding race conditions under concurrent submissions.

## API Documentation

### Auth — `/api/v1/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login, returns access + refresh tokens |
| POST | `/logout` | Authenticated | Clears tokens |
| POST | `/refresh-token` | Public (needs valid refresh token) | Issues new access token |

### Vouchers — `/api/v1/vouchers`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Employee | Create a draft voucher |
| GET | `/my-vouchers` | Employee | Get own vouchers |
| PATCH | `/:voucherId` | Employee | Edit a draft voucher |
| DELETE | `/:voucherId` | Employee | Delete a draft voucher |
| PATCH | `/:voucherId/submit` | Employee | Submit for approval (requires signature file) |
| PATCH | `/:voucherId/approve` | Director | Approve (requires signature file) |
| PATCH | `/:voucherId/reject` | Director | Reject (requires rejectionReason) |
| GET | `/` | Director, Accounts | Get all vouchers — supports query params: `status`, `department`, `expenseCategory`, `search`, `dateFrom`, `dateTo`, `amountMin`, `amountMax`, `sortBy`, `sortOrder` |
| GET | `/:voucherId` | Employee (own only), Director, Accounts | Get voucher details |

### Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/employee` | Employee | Own voucher stats |
| GET | `/director` | Director | Pending/approved/rejected counts, recent activity |
| GET | `/accounts` | Accounts | Org-wide stats, recent approved vouchers |

## Assumptions Made

1. **Collapsed workflow states:** the spec's diagram shows Submitted → Pending Approval as two steps; since they carry no distinct behavior, they're modeled as a single `pending_approval` status.
2. **Open registration:** any user can self-register with any role (employee/director/accounts) — done to make seeding test accounts fast for evaluation. In production, role assignment would be admin-controlled.
3. **Rejected-today metric:** since the schema has no dedicated rejection-date field, the Director dashboard's "Rejected Today" uses `updatedAt`, which reflects the moment of rejection given the current controller logic.
4. **Signature enforcement:** conditional-required rules (employee signature before submit, director signature before approve, rejection reason before reject) are enforced at the controller level rather than the schema level, since Mongoose doesn't support conditional-required fields as cleanly as SQL CHECK constraints would.

## Screenshots / Demo

_(To be added)_