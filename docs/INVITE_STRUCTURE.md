# E-Invite Structure & Element Flow

This document defines the structural hierarchy and user flow of the Gyan–Akshita e-invite.

## High-level flow

```mermaid
flowchart TD
    A[Landing / Cover] --> B[Couple Introduction]
    B --> C[Wedding Details]
    C --> D[Event Sections]
    D --> E[Individual Event Details]
    E --> F[Venue / Location]
    F --> G[RSVP]
    G --> H[Confirmation / Thank You]

    A --> I[Primary Navigation]
    I --> C
    I --> D
    I --> F
    I --> G
```

## Page/component hierarchy

```mermaid
flowchart TB
    ROOT[E-Invite]

    ROOT --> COVER[1. Cover / Hero]
    COVER --> PHOTO[Couple Cover Photo]
    COVER --> NAMES[Couple Names]
    COVER --> DATE[Wedding Date]
    COVER --> CTA[Enter / Explore Invite]

    ROOT --> INTRO[2. Couple / Welcome]
    INTRO --> STORY[Short Welcome or Introductory Message]
    INTRO --> COUPLE[Couple Visual / Portrait]

    ROOT --> WEDDING[3. Wedding Overview]
    WEDDING --> DATE2[Date]
    WEDDING --> VENUE[Venue]
    WEDDING --> SUMMARY[Wedding Information]

    ROOT --> EVENTS[4. Events]
    EVENTS --> EVENT1[Event Card]
    EVENTS --> EVENT2[Event Card]
    EVENTS --> EVENT3[Event Card]
    EVENT1 --> EDETAIL1[Event Details]
    EVENT2 --> EDETAIL2[Event Details]
    EVENT3 --> EDETAIL3[Event Details]

    ROOT --> LOCATION[5. Location]
    LOCATION --> MAP[Map / Location]
    LOCATION --> DIRECTIONS[Directions / Navigation]

    ROOT --> RSVP[6. RSVP]
    RSVP --> FORM[RSVP Form]
    FORM --> SUBMIT[Submit]
    SUBMIT --> CONFIRM[Confirmation]

    ROOT --> FOOTER[7. Footer]
    FOOTER --> CONTACT[Contact / Relevant Information]
```

## Functional elements

| Section | Core elements | Purpose |
|---|---|---|
| Cover | Couple photo, names, date, entry CTA | First visual impression |
| Introduction | Welcome message, couple visual | Establishes the invitation context |
| Wedding overview | Date, venue, key information | Gives the essential event information |
| Events | Event cards and event details | Lets guests explore each function |
| Location | Venue information, map, directions | Helps guests reach the venue |
| RSVP | Guest response form, submit action | Captures attendance |
| Confirmation | Submission confirmation | Confirms that RSVP was received |
| Footer | Relevant contact/information | Provides supporting information |

## User journey

```mermaid
flowchart LR
    START([Open Invite]) --> COVER[View Cover]
    COVER --> EXPLORE[Explore Invite]
    EXPLORE --> EVENTS[Browse Events]
    EVENTS --> DETAILS[View Event Details]
    DETAILS --> LOCATION[Check Venue]
    LOCATION --> RSVP[RSVP]
    RSVP --> CONFIRM[Confirmation]
    CONFIRM --> END([Invite Complete])
```

## Design principle

The invite should follow a simple progression:

**Visual introduction → essential wedding information → event discovery → venue/location → RSVP → confirmation**

The cover should remain visually dominant, while navigation should allow a guest to reach the practical information quickly without forcing them through every section.
