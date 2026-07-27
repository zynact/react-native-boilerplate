# React Native Production Boilerplate Roadmap (v1.0)

## Vision

Build a **production-ready, feature-first React Native boilerplate** that evolves incrementally through real-world applications. The boilerplate should provide a solid foundation without becoming bloated, while allowing optional capabilities to be plugged in as projects require them.

---

# Core Principles

## Production First

The boilerplate should always be production-ready and suitable for starting a real application immediately.

---

## Incremental Evolution

The boilerplate grows alongside production projects.

Only abstractions that prove reusable across multiple projects should become part of the boilerplate.

---

## Feature First

Business logic belongs inside features.

Shared code should only contain reusable functionality.

---

## Modular by Design

The core should remain lightweight.

Capabilities that are not required by every project should be installable as modules.

---

## Opinionated, Not Bloated

Only include functionality that is useful across almost every project.

Do not install packages "just in case."

Every dependency must have a documented purpose.

---

## Strong Type Safety

The project follows strict TypeScript.

Not allowed:

- `any`
- `as any`
- unnecessary type assertions
- `@ts-ignore`
- unnecessary `@ts-expect-error`
- disabling ESLint to bypass typing
- bypassing the compiler to make builds pass

Problems should be solved through proper typing.

---

## Dependency Rules

- No duplicate libraries
- No unnecessary packages
- No abandoned libraries
- No dead dependencies
- Every dependency must have a reason to exist

---

# Always Included (Core)

## Foundation

- React Native (Latest Stable)
- TypeScript
- New Architecture
- pnpm

---

## Developer Experience

- ESLint
- Prettier
- EditorConfig
- Husky
- lint-staged
- Commitlint

---

## Environment

- `.env.example`
- `.env.development`
- `.env.staging`
- `.env.production`
- Environment validation

---

## Architecture

- Feature-first architecture
- Path aliases
- Naming conventions
- Coding standards
- Import conventions
- Feature boundaries
- Selective barrel exports

---

## Navigation

- Root navigation architecture
- Bottom tabs
- Nested navigation
- Bottom sheets
- Dialogs
- Fullscreen modals
- Deep linking support

---

## State Management

- Redux Toolkit
- RTK Query
- Single Base API
- Feature endpoint injection

---

## Authentication

- Access Token
- Refresh Token
- Logout API
- Automatic refresh flow

---

## Core Infrastructure

- Networking abstraction
- Storage abstraction
- Theme engine
- Core services
- Centralized error handling

---

## Shared UI

Reusable primitives only.

---

## Production Configuration

- Android release configuration
- iOS release configuration
- Signing configuration
- Fastlane

---

## Documentation

Core project documentation.

---

# Pluggable Modules

These should **not** be included by default.

## Realtime

- Socket.IO
- WebSocket
- Server-Sent Events (SSE)

---

## Payments

- Stripe

---

## Crash Reporting

- Sentry

---

## Maps

- Google Maps

---

## Device Features

- Camera
- Biometrics
- NFC
- Bluetooth
- Contacts
- Location
- File Picker
- Share
- Clipboard

---

## Media

- Image Picker
- Image Cropper
- Audio
- Video

---

# Explicitly Not Included

The following are intentionally excluded from the boilerplate.

- Firebase
- Analytics
- Social Authentication
- AI SDKs

---

# Phase 1 – Foundation

## Project Setup

- React Native
- TypeScript
- pnpm
- New Architecture

### Configure

- ESLint
- Prettier
- EditorConfig
- Husky
- lint-staged
- Commitlint

### Environment

- Multiple environments
- Validation

---

# Phase 2 – Project Architecture

## Folder Structure

```text
src/

    core/

    shared/

    features/

    assets/
```

---

## Core

```text
core/

    api/

    auth/

    config/

    navigation/

    providers/

    services/

    storage/

    theme/
```

---

## Shared

```text
shared/

    components/

    hooks/

    utils/

    constants/

    types/

    validation/
```

---

## Features

```text
features/

    auth/

    home/

    profile/

    ...
```

Each feature owns:

- Screens
- Components
- Hooks
- APIs
- Types
- Navigation
- Validation
- Business logic

---

Define

- Naming conventions
- Import conventions
- Path aliases
- Feature boundaries
- Selective barrel exports

---

# Phase 3 – Navigation

Navigation should be feature-driven and easily expandable.

```text
RootNavigator

├── SplashNavigator

├── AuthNavigator

├── AppNavigator
│
│   ├── MainTabsNavigator
│   ├── Feature Navigators...
│
├── ModalNavigator

├── BottomSheetNavigator

└── DialogNavigator
```

Every feature owns its own navigator.

Example

```text
features/

appointments/

    navigation/

        AppointmentNavigator.tsx
```

Root only composes navigators.

Support

- Bottom Tabs
- Nested Navigation
- Bottom Sheets
- Dialogs
- Fullscreen Modals
- Deep Linking

---

# Phase 4 – State Management

## Redux Toolkit

- Store
- Middleware
- Feature slices

---

## RTK Query

Architecture

```text
baseApi

↓

injectEndpoints()

↓

feature.api.ts
```

Rules

- Single Base API
- Endpoint Injection
- Cache Tags
- Feature-owned APIs
- Centralized Error Handling

---

# Phase 5 – Authentication

Infrastructure only.

Support

- Access Token
- Refresh Token
- Logout API

Flow

```text
Request

↓

401

↓

Refresh

↓

Retry

↓

Continue

OR

Logout
```

Requirements

- Single refresh request
- Queue pending requests
- Ignore authentication endpoints
- Clear application state on logout

---

# Phase 6 – Networking

Define the networking architecture.

Core

- Base networking abstraction
- Centralized configuration
- Request/Response handling
- Error handling
- Extension points for authentication
- Extension points for uploads/downloads

Optional Modules

- Socket.IO
- WebSocket
- Server-Sent Events (SSE)

Networking implementation details should remain configurable and not be assumed until explicitly decided.

---

# Phase 7 – Theme Engine

A configurable design system.

```text
theme/

colors.ts

typography.ts

spacing.ts

radius.ts

shadows.ts

index.ts
```

Projects replace values without changing implementation.

---

# Phase 8 – Core Services

Centralized reusable services.

```text
services/

toast/

storage/

permissions/

network/

modal/

bottom-sheet/

dialog/

clipboard/

share/

linking/

logger/
```

Purpose

- Centralize reusable services
- Avoid duplicated implementations
- Keep features independent

---

# Phase 9 – Shared Components

Reusable primitives only.

- Button
- Text
- Input
- Card
- Loader
- Skeleton
- Avatar
- Badge
- Chip
- EmptyState
- ErrorState

Business components remain inside features.

---

# Phase 10 – Error Handling

Centralized error handling.

```text
Application Error

↓

Mapper

↓

User Feedback

↓

Logger
```

Support

- Validation
- Unauthorized
- Network
- Server
- Unknown

---

# Phase 11 – Production Configuration

Android

- Release Signing
- Upload Key
- Build Configuration

iOS

- Bundle Configuration
- Release Configuration

Support

- Environment switching
- Release verification

---

# Phase 12 – Automation

## Project Setup

```bash
pnpm setup
```

Automates

- Application Name
- Android Package Name
- iOS Bundle Identifier
- Display Name
- Environment Configuration
- Signing Configuration
- Fastlane Configuration

---

## Fastlane

```bash
pnpm setup:fastlane
```

Support

- Google Play
- Firebase Distribution
- TestFlight
- App Store

---

## Code Generators

Generate

```bash
pnpm generate feature

pnpm generate screen

pnpm generate component

pnpm generate hook

pnpm generate api

pnpm generate slice

pnpm generate form
```

---

## Install Optional Modules

```bash
pnpm add:socketio

pnpm add:websocket

pnpm add:sse

pnpm add:stripe

pnpm add:sentry

pnpm add:maps

pnpm add:camera
```

Each module should

- Install required dependencies
- Configure the project
- Generate starter files
- Update project configuration
- Update documentation

---

# Phase 13 – Documentation

Document

- Project Architecture
- Folder Structure
- Navigation
- State Management
- Authentication
- Networking
- Theme Engine
- Core Services
- Coding Standards
- Setup Guide
- Release Guide
- Generator Guide

---

# Project Standards

## Architecture

- Feature-first architecture
- Modular design
- Easily expandable
- Production-ready foundation
- Business logic isolated within features

---

## Code Quality

- Strict TypeScript
- No `any`
- No TypeScript bypasses
- Strict ESLint
- Consistent formatting
- Clear dependency boundaries

---

## Dependency Management

- Every dependency must have a purpose
- No duplicate packages
- No unnecessary dependencies
- Keep the core lightweight
- Optional functionality belongs in pluggable modules

---

## Long-Term Goal

The boilerplate should serve as a stable platform for all future React Native applications. New features should only become part of the core after proving their value across multiple production projects. The architecture should remain stable, extensible, and easy to maintain while allowing optional capabilities to be added through generators and setup commands without requiring major refactoring.
