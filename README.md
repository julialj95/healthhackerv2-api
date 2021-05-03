# MyHealthHacker Server

## Open Endpoints

Open endpoints require no Authentication.

SignUp: POST /api/users/

Login : POST /api/authorization/login/

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the request.

Get saved logs : GET /api/logs

Post a new log: POST /api/logs

Get log by id: GET /api/logs/:log_id

Delete a log: DELETE /api/logs/:log_id

Edit a log: PATCH /api/logs/:log_id
