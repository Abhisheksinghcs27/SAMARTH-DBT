# Demo Credentials for SAMARTH DBT Portal

This document contains demo credentials for testing the SAMARTH DBT Portal application.

## 🔐 Victim/Beneficiary Credentials

Victim accounts use **Aadhaar number** (12 digits) and password for login. The system will auto-register if the user doesn't exist.

### Demo Victim Accounts

| Aadhaar Number | Password | Notes |
|----------------|----------|-------|
| `1234-5678-9012` | `victim123` | Primary test account |
| `9876-5432-1098` | `test1234` | Secondary test account |
| `1111-2222-3333` | `demo1234` | Additional test account |

**Format:** Enter Aadhaar as `XXXX-XXXX-XXXX` or `XXXXXXXXXXXX` (12 digits)

---

## 👔 Official Credentials

Official accounts use **Official ID** and password. These accounts must be pre-registered in the database.

### Demo Official Accounts

| Official ID | Password | Name | Department | Designation |
|-------------|----------|------|------------|-------------|
| `OFF001` | `official123` | Rajesh Kumar | District Administration | District Collector |
| `OFF002` | `admin1234` | Priya Sharma | Social Welfare | Deputy Director |
| `OFF003` | `verify123` | Amit Patel | Verification Unit | Verification Officer |

---

## 🚀 Quick Start

### Option 1: Use Existing Credentials (Auto-registration for Victims)

For **Victim/Beneficiary** login:
- Aadhaar: `1234-5678-9012`
- Password: `victim123`

The system will automatically create the account on first login.

### Option 2: Seed Database with Demo Users

Run the seed script to populate the database with all demo users:

```bash
cd backend
npm run seed
```

This will create:
- Demo users (victims + officials)
- Demo applications across multiple statuses (so all dashboards/charts/track views are populated)
- Demo grievances in multiple states (Open/In-Progress/Resolved/Escalated) assigned to officials

---

## 📝 Notes

1. **Victim Accounts**: Auto-register on first login. You can use any 12-digit Aadhaar number format.
2. **Official Accounts**: Must be pre-registered. Use the seed script or create them via the API.
3. **Password Requirements**: Minimum 6 characters for all accounts.
4. **Aadhaar Format**: The system accepts both `XXXX-XXXX-XXXX` and `XXXXXXXXXXXX` formats.

---

## 📄 Demo Application IDs (for Track / Verification / Dashboard)

After running `npm run seed`, you can use these application IDs for tracking screens:

| Application ID | Status | Useful for |
|---|---|---|
| `BT-DEMO-0001` | `PENDING` | Newly submitted / pending views |
| `BT-DEMO-0002` | `VERIFIED_AADHAAR` | Aadhaar verified state |
| `BT-DEMO-0003` | `VERIFIED_CCTNS` | FIR/CCTNS verified state |
| `BT-DEMO-0004` | `SANCTIONED` | Sanction approval state |
| `BT-DEMO-0005` | `DISBURSED` | Payment details / UTR state |
| `BT-DEMO-0006` | `REJECTED` | Rejection reason / retry flows |
| `BT-DEMO-0007` | `PENDING` | Queue prioritization (high risk, older) |
| `BT-DEMO-0008` | `VERIFIED_AADHAAR` | Mid-queue with AI score |
| `BT-DEMO-0009` | `PENDING` | Fresh queue entry with AI score |

---

## 🔧 Creating Additional Demo Users

### Via API (Official Account)

```bash
curl -X POST http://localhost:5000/api/auth/official/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "officialId": "OFF004",
    "password": "newpass123",
    "name": "New Officer",
    "department": "Finance",
    "designation": "Accountant",
    "email": "officer@example.com"
  }'
```

### Via Seed Script

Edit `backend/src/scripts/seed.ts` and add your new user to the arrays, then run:

```bash
npm run seed
```

---

## ⚠️ Security Note

These are **demo credentials** for development and testing only. **DO NOT** use these in production environments.
