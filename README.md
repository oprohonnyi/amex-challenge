# Challenge

## Author

Oleksii Prohonnyi (oprohonnyi@gmail.com)

## Description

The project contains a framework, a caching fetch library, and a web application.

The framework contains:

- a server
- a client runtime
- an MSW mock server, to allow you to run this project without a network connection.

The application will render a very basic directory of people.

The caching fetch library provides the interface to cache the the api responses.

- `useCachingFetch` - a hook to cache the api response, if successful, and not request the same url if called twice
- `preloadCachingFetch` - a function for server side rendered pages to preload the api and store it into the cache
- `serializeCache` - serialize the cache
- `initializeCache` - init cache deserializing the argument
- `wipeCache` - clean up the cache

## Onboarding

```bash
npm i
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

You should see a welcome page with 2 links to other pages.

When visiting the links:

- on http://127.0.0.1:3000/appWithoutSSRData you will see
  - `Error: UseCachingFetch has not been implemented`
- on http://127.0.0.1:3000/appWithSSRData you will see
  - ```{
    "statusCode": 500,
    "error": "Internal Server Error",
    "message": "preloadCachingFetch has not been implemented"
    }
    ```

## Out of Scope

To fit into the deadline the following parts of the assesment were not fully completed:

- Configuration of the project due to suggestions provided below
- Cleanup of hydration react warnings for the SSR logic
- Advanced error handling and handling of the possible invalid input

## Futher suggestions

As there is no specific requirements or information about how the project going to be scaled/maintained/utilized it is hard to give a specific roadmap and technology stack selection recommendations. Most of suggestions are based on the previous development experience.

### Framework

In case it is planned to keep using the Node.js backend for the application and do not build a separate project utilizing another technology, I recommend to use `ExpressJS` for server-side business logic and API. It is lightweight, flexible, fast, has a large developer community (ready to use plugins for development).

If the application will grow towards being a static, customer-facing application - the recommendation is to use `NextJS` framework, it is React-based, SEO optimized, well-performant and popular in community (which brings a wide range of possibilities, from hiring the team to solving the issues).

### State management

In case the application will be a client-side SPA, with the large number of components and application state to share. I recommend to use `Redux` to optimize the architecture (application layers) and state changes across the codebase.

In case an app won't be a big enterprise project but still needs some state management, simplification of UI-related updates (themization, personalization), I recommend to go with the `Context API` as a lightweight and simple solution out of box.

### Components library

To not invent a wheel and guarantee an easy productivity, consistency, ease of testing, usability of the UI/UX I recommend to use one of the component libraries: `Bootstrap`, `Material UI`, `Ant`, `Chakra UI`, etc. Depending on the customization and personalization requirements, technical stack used (e.g. if any CSS pre-processors are in place) the specific one could be chosen.

### CSS processors

In case it is expected to have a rich styling in the application, it makes sense to use a CSS pre-processors like `SASS`, `LESS`. If the application is server-side rendered `styled-components` could be a good choice to keep the codebase clean and well structured by encapsulating components logic and styles together in one module/file.

### Testing

I recommend to use `Mocha` as a testing framework/runner as it is both useful for testing React applications and Node.js server logic.
I recommend to use `Enzyme` for writing integration tests.

### Build tools

In case the application will grow and have many static files or needs a well-defined dependency graph build tool, the recommendation is to use `Webpack`.

If the application is fairly small and/or has no many static files, I recommend to use `Grunt`, `Gulp` as `Webpack` could be an overkill.

### Worth mentioning

- `Axios` for API calls
- `Ally.js` for accessibility
- `i18next` for internationalization
