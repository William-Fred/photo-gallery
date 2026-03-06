---
name: photo-project-planner
description: plan and track the architecture, milestones, tasks, risks and next actions for the photo gallery project using asp.net core web api, react, postgres, cloudflare r2, docker, github actions, azure container apps and azure static web apps in a github monorepo.
---

# Photo Project Planner

This skill helps plan and track development of the **photo gallery project**.

The project stack is fixed:

Backend: ASP.NET Core Web API  
Frontend: React  
Database: PostgreSQL  
Image Storage: Cloudflare R2  
Hosting: Azure Container Apps (API)  
Frontend Hosting: Azure Static Web Apps  
CI/CD: GitHub Actions  
Local Development: Docker Compose  
Repository: GitHub Monorepo

---

# Project Constraints

The project must:

- use a **monorepo**
- be **cheap to host**
- support **cloud learning**
- be built incrementally
- break work into **small trackable tasks**

---

# Planning Output Format

All project planning responses must follow this structure.

## Vision

Short description of the goal of the system.

Example:

A personal photo gallery system that allows uploading images via an admin interface, storing image metadata in PostgreSQL and image files in Cloudflare R2, and displaying a public gallery.

---

## Architecture

Describe system architecture including:

- frontend (React)
- backend (ASP.NET Core Web API)
- database (PostgreSQL)
- storage (Cloudflare R2)
- deployment
- docker setup
- monorepo structure

---

## Monorepo Structure

Recommended structure:


repo/
apps/
api/ (.NET Web API)
web/ (React)

docs/
project-plan.md

infra/

docker-compose.yml

README.md


---

## Milestones

Break the project into milestones.

Example:

1 Repository Setup  
2 Local Development Environment  
3 Database + API Foundation  
4 Image Upload  
5 React Admin Upload UI  
6 Gallery View  
7 Authentication  
8 Cloud Deployment  
9 CI/CD

---

## Tasks

Break milestones into **small actionable tasks**.

Each task should:

- be clear
- be implementable within a few hours
- reference the technology used

Example:

- Create ASP.NET Core Web API project
- Add Dockerfile for API
- Add Postgres container to docker-compose
- Configure EF Core connection
- Create Image metadata model

---

## Risks

Identify potential technical risks such as:

- large file uploads
- storage integration issues
- cloud configuration complexity
- docker networking issues

---

## Next Actions

Always output the **next concrete development steps**.

Example:

1 Create GitHub repository
2 Initialize monorepo folder structure
3 Create ASP.NET Core Web API project
4 Create React application
5 Add Docker Compose

---

## Progress Tracking

Use simple task tracking when possible:


Milestone 1 - Repo Setup

[ ] Create repository
[ ] Setup monorepo structure
[ ] Add README
[ ] Add project-plan.md