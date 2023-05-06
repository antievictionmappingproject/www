# Codebase for AEMP's Main Website

Welcome! This repository contains the codebase for the
forthcoming (as of September 2022) version of the Anti-Eviction
Mapping Project's main website.

The codebase is actively being developed by Nathan Kim and
Jonas Luebbers. Please see the [contact](#contact) section at
the bottom of this document for questions regarding this site.

## Contents

- [Quick links](#quick-links)
- [Quickstart](#quickstart)
- [Tech stack](#tech-stack)
- [Guidelines](#guidelines)
- [Contact](#contact)

## Quick links

- [Wireframes](https://www.figma.com/file/vtGLMNb9KS1ETCeKdyxHjW/AEMP-guidelines-%2B-website?node-id=246%3A91)
- [Meeting notes](https://docs.google.com/document/d/1C8AvojK6xQElfFkO5u5cMS4ZKwRNeIKp4z94uoYA4zQ/edit#heading=h.tzm6i68shypk)
- [Slack channel](https://antievictionmap.slack.com/archives/C9ZHW3TPZ)
- [Staging site](https://aemp-www.netlify.app)
- [Production site (not yet updated)](https://antievictionmap.com)

## Quickstart

Prerequisites:

- Node v18+ ([direct download](https://nodejs.org/en/download/)
  or through the [nvm](https://github.com/nvm-sh/nvm) utility)

  - We use v18 or higher because these versions include the
    `fetch` utility

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

In a terminal:

```sh
npm install --global pnpm # if you don't have pnpm already
cd <directory of your choice>
git clone https://github.com/antievictionmappingproject/www
cd www
pnpm install --frozen-lockfile
pnpm dev # to see a local preview of the site
```

You might have some issues if you are new to the terminal or
web development, especially if you are on a machine without
`pnpm`, `git`, or anything else installed for you in advance.
There are so many ways this could happen that it is not
reasonable to list or address them all here. Instead, please
reach out to Nathan, who will happily assist and debug with
you.

Please also reach out to Nathan if you'd like to be added to
the Sanity API. This is very useful to see the structure of
queries and test new content structures. You may be able to get
by with just using "\*" to query.

## Tech stack

Described only briefly here.

### Wireframes through Figma

We use Figma, which is sort of the industry giant application
for designing mockups and wireframes. It is fairly intuitive to
use, is free, and doesn't require installing anything (although
you can).

Our current wireframes can be found
[here](https://www.figma.com/file/vtGLMNb9KS1ETCeKdyxHjW/AEMP-guidelines-%2B-website?node-id=246%3A91).

### CMS through Sanity.io

We use Sanity as our content management system (CMS). A CMS is
an interface that accepts content input and often attempts to
make content programmatically accessible.

People contributing content can add it through the Sanity
interface. Our frontend code then queries this and presents it
to the end user.

Please contact Jonas if you'd like to be added to the Sanity
CMS for edits or additions.

### General frontend development through Svelte and SvelteKit

Svelte is a JavaScript framework for building UIs. Compared to
frameworks like React, it uses a compilation step to analyze
your code and only output end-user code that is absolutely
necessary (and does not send a library bundle to the client).

SvelteKit is the Svelte team's officially endorsed
meta-framework, which augments Svelte's UI-building
capabilities through a filesystem-based router, functions for
prerendering the UI or rendering it server-side, and functions
to load data without sending too much code or data to the end
user.

We want to prioritize sustainability through this choice, which
we see in Svelte's relative independence from Meta (unlike
React) and through Svelte and SvelteKit's intentional
minimalism in JavaScript shipped to and executed by the client
browser. However, there are many times more users of React than
Svelte, and it may be more sustainable for AEMP to pick a
framework that more users are familiar with rather than having
contributors have to learn a new framework. There are also
many, many frameworks out there that may fulfill or suceed the
same goal of sustainability and ethical use better than Svelte.

So, while recognizing that work has already gone into building
out the UI in this configuration and that constant refactoring
is a burden, we are open to ongoing discussions about the tools
we use and the values embodied in them. This applies to the
frontend development kit foremost as it's kind of the largest
toolset that we use, but also to every other framework and tool
used in this codebase as well.

### Typescript

We use Typescript, as it is helpful especially for correctly
accessing the Sanity API's queries and responses. If it is a
burden for you for any reason, please feel free to just turn it
off in whatever file you are working on, most easily through
simply naming it with a `.js` extension or, for Svelte,
removing `lang="ts"` from the `<script>` tag.

## Guidelines

A more in-depth set of guidelines, including some technical
best-practices, may be found in our GUIDELINES.md document in
the same repository. Some of it bears repeating, though:

1. We aren't simply building a cool tech thing or piece of
   software, but an interface and surface to lift and amplify
   work of tenant organizers in AEMP and beyond. We want to
   center that work in building this site.
2. We want our work to be accessible in all senses of the word.
   We want to incorporate all of the lessons learned and taught
   by the web-based a11y movement, in other words designing for
   low-bandwidth users, users of screen readers, and users of
   many devices. We also want our work to be accessible to all
   people disempowered by the powers of racial capitalism; by
   using language understood by all, by promoting work that
   cares for all, by curating our content with the people
   harmed by our current societal structure.
3. As a community of developers, designers, organizers, and
   humans, we treat each other with respect, love, and care. We
   have no tolerance for racism, sexism, homophobia,
   transphobia, or classism within this community or any
   affiliated one.

If you'd like to contribute to the site, please reach out first
to the person/people listed under the topic(s) your
contribution falls under. We can show you around, and in
general promote a culture of actively helping one another!

## Contact

If you're on the AEMP Slack workspace, it may be helpful to DM
any one of these people on there instead of emailing them, or
to send a message into the
[#website-redesign](https://antievictionmap.slack.com/archives/C9ZHW3TPZ)
channel.

- Code
  - Nathan Kim (nathanckim18[at]gmail.com)
  - Jonas Luebbers (hello[at]jonasluebbers.com)
- Admin
- Design
  - Jonas Luebbers
