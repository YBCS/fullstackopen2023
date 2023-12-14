# this is 2023 version of full stack open

contains suggestions and my own thought tracker
part 1 a to d I think instructions on directory structure can be clearer
give back to community by doing your best 👌🏽


to start a template 
# npm 7+, extra double-dash is needed:
npm create vite@latest part1 -- --template react

Recommended structure:

part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  phonebook
  countries

git how to unstage a file ?
  - `git reset .`
  - what is `git restore .`  for ? is that even a command

# part 2 notes
  - never mutate state directly in React!
  - .filter, .concat, .map => creates new object so original is not mutated
  - in useState, null is a suitable default value when the state stores just one information instead of a list of items
  - if we are trying to keep unique fields; its best to validate in server
  - can learn a lot from the model solutions : phonebook

# part 3 notes
  - ## section a
    - a simple backend
  - ## section b
    - connect with FE
    - use cors library for node
    - first deploy BE
      - need to create a seperate repository
      - in my case it exist in `monoRepoFullStackOpen/phonebook_backend`
    - deploy FE
      - in FE, change the base url
      - in FE `npm run build`
      - in BE, use `express.static(build)`
      - copy static directory to the BE directory
      - commit and push code
  - ## section c
    - Use mongodb
    - When using Render, the database url is given by defining the proper env in the dashboard:
    - questions
      - if I try to update a resource which is no longer in db; what happens


# part 4 BE structure
  - ## section a 
    - how to organize BE according to good practise
    - Automated Testing begins
    - run tests with match `npm test -- -t 'when list has only one blog, equals the likes of that'`
    - run single test with `only` option
  - ## section b
    - WARNING - If you find yourself using async/await and then methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and don't mix the two.
    - NB: when you are writing your tests it is better to not execute all of your tests, only execute the ones you are working on.
    - running single test file
      - `npm test -- tests/blog_api.test.js`
    - in express we can use `express-async-errors` to handle try catch elegantly ?