# INWI Automated Testing Platform - Backend Endpoints Blueprint

This document outlines all necessary backend endpoints required to support the INWI Automated Testing Platform. The endpoints are organized by functional area with details on required parameters, expected responses, and authentication requirements.

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Management Endpoints](#user-management-endpoints)
3. [Test Case Endpoints](#test-case-endpoints)
4. [Test Suite Endpoints](#test-suite-endpoints)
5. [Test Execution Endpoints](#test-execution-endpoints)
6. [Report Endpoints](#report-endpoints)
7. [Web Services Endpoints](#web-services-endpoints)
8. [Profile Management Endpoints](#profile-management-endpoints)

## Authentication Endpoints

### POST /api/auth/login

**Description:** Authenticates a user and returns a session token.

**Request Body:**
```json
{
  "user_id": "string",
  "password": "string",
  "remember_me": boolean
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "last_login": "string (ISO date)"
    },
    "expiry": "number (timestamp)",
    "password_change_required": boolean
  }
}
```

**Authentication Required:** No

### POST /api/auth/logout

**Description:** Invalidates the current session token.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes

### POST /api/auth/reset-password

**Description:** Sends a password reset link to the user's email.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** No

### POST /api/auth/change-password

**Description:** Changes the user's password.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "current_password": "string",
  "new_password": "string"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes

## User Management Endpoints

### GET /api/users

**Description:** Retrieves a list of all users (admin only).

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "last_login": "string (ISO date)"
    }
  ]
}
```

**Authentication Required:** Yes (Admin role)

### GET /api/users/{id}

**Description:** Retrieves details for a specific user (admin only).

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "last_login": "string (ISO date)"
  }
}
```

**Authentication Required:** Yes (Admin role)

### POST /api/users

**Description:** Creates a new user (admin only).

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Authentication Required:** Yes (Admin role)

### PUT /api/users/{id}

**Description:** Updates an existing user (admin only).

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string",
  "password": "string" // Optional
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Authentication Required:** Yes (Admin role)

### DELETE /api/users/{id}

**Description:** Deletes a user (admin only).

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes (Admin role)

### POST /api/users/force-password-change/{id}

**Description:** Forces a user to change their password on next login (admin only).

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes (Admin role)

## Test Case Endpoints

### GET /api/test-cases

**Description:** Retrieves a list of all test cases.

**Request Headers:**
- Authorization: Bearer {token}

**Query Parameters:**
- type: Filter by test type (optional)
- page: Page number for pagination (optional)
- limit: Number of items per page (optional)

**Response:**
```json
{
  "success": boolean,
  "data": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "test_cases": [
      {
        "id": "string",
        "type": "string",
        "name": "string",
        "description": "string",
        "created_at": "string (ISO date)",
        "created_by": "string"
      }
    ]
  }
}
```

**Authentication Required:** Yes

### GET /api/test-cases/{id}

**Description:** Retrieves details for a specific test case.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": {
    "id": "string",
    "type": "string",
    "name": "string",
    "description": "string",
    "parameters": "object",
    "created_at": "string (ISO date)",
    "created_by": "string",
    "updated_at": "string (ISO date)",
    "updated_by": "string"
  }
}
```

**Authentication Required:** Yes

### POST /api/test-cases

**Description:** Creates a new test case.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "type": "string",
  "name": "string",
  "description": "string",
  "parameters": "object"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "id": "string",
    "type": "string",
    "name": "string",
    "description": "string",
    "parameters": "object",
    "created_at": "string (ISO date)",
    "created_by": "string"
  }
}
```

**Authentication Required:** Yes

### PUT /api/test-cases/{id}

**Description:** Updates an existing test case.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "type": "string",
  "name": "string",
  "description": "string",
  "parameters": "object"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "id": "string",
    "type": "string",
    "name": "string",
    "description": "string",
    "parameters": "object",
    "updated_at": "string (ISO date)",
    "updated_by": "string"
  }
}
```

**Authentication Required:** Yes

### DELETE /api/test-cases/{id}

**Description:** Deletes a test case.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes

### GET /api/test-types

**Description:** Retrieves a list of all available test types.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "required_parameters": ["string"]
    }
  ]
}
```

**Authentication Required:** Yes

## Test Suite Endpoints

### GET /api/test-suites

**Description:** Retrieves a list of all test suites.

**Request Headers:**
- Authorization: Bearer {token}

**Query Parameters:**
- page: Page number for pagination (optional)
- limit: Number of items per page (optional)

**Response:**
```json
{
  "success": boolean,
  "data": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "test_suites": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "test_count": "number",
        "created_at": "string (ISO date)",
        "created_by": "string"
      }
    ]
  }
}
```

**Authentication Required:** Yes

### GET /api/test-suites/{id}

**Description:** Retrieves details for a specific test suite.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "tests": [
      {
        "id": "string",
        "type": "string",
        "name": "string",
        "description": "string",
        "parameters": "object"
      }
    ],
    "created_at": "string (ISO date)",
    "created_by": "string",
    "updated_at": "string (ISO date)",
    "updated_by": "string"
  }
}
```

**Authentication Required:** Yes

### POST /api/test-suites

**Description:** Creates a new test suite.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "tests": [
    {
      "id": "string",
      "parameters": "object" // Optional overrides for test parameters
    }
  ]
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "test_count": "number",
    "created_at": "string (ISO date)",
    "created_by": "string"
  }
}
```

**Authentication Required:** Yes

### PUT /api/test-suites/{id}

**Description:** Updates an existing test suite.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "tests": [
    {
      "id": "string",
      "parameters": "object" // Optional overrides for test parameters
    }
  ]
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "test_count": "number",
    "updated_at": "string (ISO date)",
    "updated_by": "string"
  }
}
```

**Authentication Required:** Yes

### DELETE /api/test-suites/{id}

**Description:** Deletes a test suite.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes

## Test Execution Endpoints

### POST /api/test-executions/run-test/{test_id}

**Description:** Executes a single test case.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "parameters": "object" // Optional overrides for test parameters
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "execution_id": "string",
    "test_id": "string",
    "status": "string",
    "started_at": "string (ISO date)"
  }
}
```

**Authentication Required:** Yes

### POST /api/test-executions/run-suite/{suite_id}

**Description:** Executes a test suite.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "parameters": "object" // Optional global parameter overrides
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "execution_id": "string",
    "suite_id": "string",
    "status": "string",
    "started_at": "string (ISO date)"
  }
}
```

**Authentication Required:** Yes

### POST /api/test-executions/stop/{execution_id}

**Description:** Stops a running test execution.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes

### GET /api/test-executions

**Description:** Retrieves a list of all test executions.

**Request Headers:**
- Authorization: Bearer {token}

**Query Parameters:**
- status: Filter by status (optional)
- type: Filter by type (test/suite) (optional)
- page: Page number for pagination (optional)
- limit: Number of items per page (optional)

**Response:**
```json
{
  "success": boolean,
  "data": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "executions": [
      {
        "id": "string",
        "type": "string", // "test" or "suite"
        "reference_id": "string", // test_id or suite_id
        "reference_name": "string", // test name or suite name
        "status": "string",
        "progress": "number", // percentage
        "started_at": "string (ISO date)",
        "completed_at": "string (ISO date)",
        "executed_by": "string"
      }
    ]
  }
}
```

**Authentication Required:** Yes

### GET /api/test-executions/{execution_id}

**Description:** Retrieves details for a specific test execution.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": {
    "id": "string",
    "type": "string", // "test" or "suite"
    "reference_id": "string", // test_id or suite_id
    "reference_name": "string", // test name or suite name
    "status": "string",
    "progress": "number", // percentage
    "results": [
      {
        "test_id": "string",
        "test_name": "string",
        "status": "string",
        "message": "string",
        "started_at": "string (ISO date)",
        "completed_at": "string (ISO date)",
        "duration_ms": "number"
      }
    ],
    "started_at": "string (ISO date)",
    "completed_at": "string (ISO date)",
    "executed_by": "string"
  }
}
```

**Authentication Required:** Yes

### POST /api/test-executions/schedule

**Description:** Schedules a test or suite to run at a specified time.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "type": "string", // "test" or "suite"
  "reference_id": "string", // test_id or suite_id
  "schedule_time": "string (ISO date)",
  "parameters": "object" // Optional parameter overrides
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "schedule_id": "string",
    "type": "string",
    "reference_id": "string",
    "schedule_time": "string (ISO date)"
  }
}
```

**Authentication Required:** Yes

### DELETE /api/test-executions/schedule/{schedule_id}

**Description:** Cancels a scheduled test execution.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes

## Report Endpoints

### GET /api/reports

**Description:** Retrieves a list of all generated reports.

**Request Headers:**
- Authorization: Bearer {token}

**Query Parameters:**
- page: Page number for pagination (optional)
- limit: Number of items per page (optional)

**Response:**
```json
{
  "success": boolean,
  "data": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "reports": [
      {
        "id": "string",
        "name": "string",
        "type": "string",
        "generated_at": "string (ISO date)",
        "generated_by": "string",
        "file_size": "number" // in bytes
      }
    ]
  }
}
```

**Authentication Required:** Yes

### GET /api/reports/{report_id}

**Description:** Retrieves metadata for a specific report.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": {
    "id": "string",
    "name": "string",
    "type": "string",
    "description": "string",
    "execution_id": "string",
    "generated_at": "string (ISO date)",
    "generated_by": "string",
    "file_size": "number", // in bytes
    "download_url": "string"
  }
}
```

**Authentication Required:** Yes

### GET /api/reports/{report_id}/download

**Description:** Downloads a report file.

**Request Headers:**
- Authorization: Bearer {token}

**Response:** Binary file download

**Authentication Required:** Yes

### POST /api/reports/generate

**Description:** Generates a new report based on test execution results.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "string",
  "type": "string", // e.g., "pdf", "csv", "excel"
  "description": "string",
  "execution_id": "string",
  "include_details": boolean
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "report_id": "string",
    "status": "string", // "generating" or "completed"
    "estimated_completion": "string (ISO date)" // if status is "generating"
  }
}
```

**Authentication Required:** Yes

### DELETE /api/reports/{report_id}

**Description:** Deletes a report.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes

## Web Services Endpoints

### GET /api/web-services

**Description:** Retrieves a list of available web services for testing.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "endpoint": "string",
      "method": "string",
      "parameters": [
        {
          "name": "string",
          "type": "string",
          "required": boolean,
          "description": "string"
        }
      ]
    }
  ]
}
```

**Authentication Required:** Yes

### POST /api/web-services/test

**Description:** Tests a web service with provided parameters.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "service_id": "string",
  "parameters": "object"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "request": "object",
    "response": "object",
    "status_code": "number",
    "execution_time_ms": "number"
  }
}
```

**Authentication Required:** Yes

### POST /api/web-services/import

**Description:** Imports test data from a file for web service testing.

**Request Headers:**
- Authorization: Bearer {token}
- Content-Type: multipart/form-data

**Request Body:**
- file: The file to upload

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "parsed_entries": "number",
    "valid_entries": "number",
    "preview": ["object"]
  }
}
```

**Authentication Required:** Yes

## Profile Management Endpoints

### GET /api/profile

**Description:** Retrieves the current user's profile information.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "last_login": "string (ISO date)"
  }
}
```

**Authentication Required:** Yes

### PUT /api/profile

**Description:** Updates the current user's profile information.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Authentication Required:** Yes

### PUT /api/profile/password

**Description:** Changes the current user's password.

**Request Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
  "current_password": "string",
  "new_password": "string",
  "confirm_password": "string"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string"
}
```

**Authentication Required:** Yes

## Dashboard Endpoints

### GET /api/dashboard/metrics

**Description:** Retrieves key metrics for the dashboard.

**Request Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "success": boolean,
  "data": {
    "total_tests_run": "number",
    "pass_rate": "number", // percentage
    "last_test_run": "string (ISO date)",
    "recent_tests": [
      {
        "id": "string",
        "type": "string",
        "status": "string",
        "executed_at": "string (ISO date)"
      }
    ]
  }
}
```

**Authentication Required:** Yes