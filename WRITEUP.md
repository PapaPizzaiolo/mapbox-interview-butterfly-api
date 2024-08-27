# Butterfly API - Rating and Refactor

## Requirements and Initial Steps

From the [README.md](./README.md)

> Butterfly critique is already a pretty great API, but we think it would be even better if it let users critique butterflies. Your task is to create new API endpoints that:  1. Allow a user to rate butterflies on a scale of 0 through 5  2. Allow retrieval of a list of a user's rated butterflies, sorted by rating

To satisify the requirements, we could use a join between butterflies, users, and ratings to get a user's ratings. However, unlike relational databases, lowdb doesn't support native joins. To retrieve a user's rated butterflies, we need to implement in the application using ops like `filter()`.

```json
{
  "ratings": [
    {
      "id": "generated-nanoid",
      "userId": "user-id",
      "butterflyId": "butterfly-id",
      "rating": 4
    }
  ]
}
```

```javascript
const userRatings = db.get('ratings')
  .filter({ userId: 'user-id' })
  .value();
```

And

```javascript
const ratedButterflies = userRatings.map(rating => ({
  ...db.get('butterflies').find({ id: rating.butterflyId }).value(),
  rating: rating.rating
})).sort((a, b) => b.rating - a.rating);
```

## Rating API

`PUT /ratings/{id}`

- Updates an existing rating
- Requires the rating value in the request body

`GET /ratings/{id}`

- Retrieves a specific rating by its ID
- Returns the rating details or a 404 error if not found

`POST /ratings`

- Creates a new rating
- Requires userId, butterflyId, and rating in the request body
- Validates the user and butterfly exist before creating the rating
- Returns the newly created rating with a 201 status code and a Location header

`DELETE /ratings/{id}`
- Deletes a specific rating by its ID
- Returns a 204 status code on success or a 404 error if not found

## Completed Tasks
- [x] Satisify new requirements
- [x] Split routes out into their own module
- [x] Split test suites based on `src` organization
- [x] JSDoc comments
- [x] Move all database functions to `src/db`
- [x] Attach db object to req so routes can be defined in their own module
- [x] 100% test coverage
- [x] Add validator for ratings
- [x] Add ratings to `butterflies.db.json` and `test.db.json`
- [x] Use more accurate status codes where applicable, like 201 with location header for create operations and 204 for deleted
- [x] Get all ratings for a butterfly

## Future Tasks and Improvements
- [ ] Add pagination to endpoints that may return large datasets
- [ ] Consider adding Swagger UI
- [ ] Consider user authentication
- [ ] Consider rejecting butterflies if scientific name is duplicated
- [ ] Consider a different output format for ratings where butterfly and user are joined
