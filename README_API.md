# Windgap Academy API Documentation

## Authentication

- POST `/api/auth/login` — Login and receive JWT token
  - Body: `{ username, role }`
  - Response: `{ token }`

## Users

- GET `/api/users` — List users (admin only, JWT required)
- POST `/api/users` — Create user (admin only, JWT required)

## Assignments

- GET `/api/assignments` — List assignments
- POST `/api/assignments` — Create assignment

## Materials

- GET `/api/materials` — List study materials
- POST `/api/materials` — Create material

curl -X POST http://localhost:9000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","role":"admin"}'
curl http://localhost:9000/api/users -H "Authorization: Bearer <token>"

## Example Usage

```sh
curl -X POST http://localhost:9000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","role":"admin"}'
curl http://localhost:9000/api/users -H "Authorization: Bearer <token>"
```

## Notes

- All protected endpoints require JWT in `Authorization: Bearer <token>` header.
- Extend endpoints for more features as needed.
