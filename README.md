## Assignment: Graphql

### Tasks:

1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).  
   1.1. npm run test - 100%
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
   Constraints and logic for gql queries should be done based on restful implementation.  
   For each subtask provide an example of POST body in the PR.  
   All dynamic values should be sent via "variables" field.  
   If the properties of the entity are not specified, then return the id of it.  
   `userSubscribedTo` - these are users that the current user is following.  
   `subscribedToUser` - these are users who are following the current user.
   - Get gql requests:  
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.
   ```
   query {
      users {
         id
         firstName
      }
      profiles {
         id
         birthday
         memberTypeId
      }
      posts {
         id
         title
      }
      memberTypes {
         id
         monthPostsLimit
      }
   }
   ```
   ---
   2.2. Get user, profile, post, memberType by id - 4 operations in one query.
   ```
   query variables (graphql)
         {
            "userId": "f3bcd21e-de39-44be-8d1f-37e4fecb1943",
            "profileId": "c35b4768-148a-4dfc-aaff-89887da786cb",
            "postId": "746dcf4b-32f7-44b8-a76b-ea4f42323e05",
            "memberTypeId": "basic"
         }
   ```
---
2.3. Get users with their posts, profiles, memberTypes.
      
   ```
   query ($userId: ID, $profileId: ID, $postId: ID, $memberTypeId: String) {
      user(id: $userId) {
         id
         lastName
      }
      profile(id: $profileId) {
         avatar
         country
      }
      post(id: $postId) {
         content
         title
      }
      memberType(id: $memberTypeId) {
         id
         discount
         monthPostsLimit
      }
   }
   ```
---
2.4. Get user by id with his posts, profile, memberType.
      
   ```
   query {
      users {
         id
         lastName,
         firstName,
         posts {
               title
         },
         profile {
               avatar
         },
         memberType {
               id,
         }
      }
   }
   ```
   ---
2.5. Get users with their `userSubscribedTo`, profile.
   ```graphql
      query {
         users {
            id,
            firstName,
            profile {
               id,
               avatar
               sex
            },
            userSubscribedTo  {
               email,
               firstName,
            }
         }
      }
   ```
---
   
---
2.6. Get user by id with his `subscribedToUser`, posts. Write this `json` variable to get userData
```json
      {
       "userId": "27e90a48-9afc-46f3-8b80-ffd62bf7575f"
      }
   ```
   ```
      query($userId: ID) {
         user(id: $userId) {
            id,
            firstName,
            posts {
                  id,
                  title,
                  content
            },
            subscribedToUser {
                  id,
                  firstName,
                  lastName
            }
         }
      }
```
---
2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).
   ```
   query {
      users {
         id
         firstName
         lastName
         userSubscribedTo {
            email
            firstName
            userSubscribedTo {
               id,
               firstName
            },
            subscribedToUser {
               id
               firstName
            },
         },
         subscribedToUser {
            id,
            firstName
            userSubscribedTo {
               id,
               firstName
               lastName
            },
         },
      }
   }
   ```
---

- Create gql requests:
  2.8. Create user.
  ```json
   {
      "user": {
         "firstName": "Federer",
         "lastName": "Roger",
         "email": "roger@tennis.kz"
      }
   }
   ```
   ```
      mutation($user: UserCreateInput) {
         createUser(user: $user) {
            id
            firstName
            lastName
            email
         }
      }
   ```
---
  2.9. Create profile.
  ```json
{
  "profile": {
    "avatar": "DjokerNole",
    "sex": "Bobsy",
    "birthday": 100,
    "country": "Serbia",
    "street": "Djoko",
    "city": "Aussie",
    "memberTypeId": "basic",
    "userId": "1f3ffee2-b8c8-4c5b-a994-aa387e3c4c1b"
  }
}
```
```
mutation ($profile: ProfileCreateInput){
    createProfile(profile: $profile) {
        avatar,
        userId,
        memberTypeId,
    }
}
```
---
  2.10. Create post.
  ```json
{
  "post": {
    "title": "Grunt",
    "content": "RG is mine",
    "userId": "347a0bad-3d1d-481a-936e-17cbbe9e1ef4"
  }
}
```
```
mutation($post: PostCreateInput) {
    createPost(post: $post) {
        title
        userId
        content
    }
}
```
---
  2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.

  [inputDataTypes](./src/routes/graphql/types/inputDataTypes.ts) - see the inputDataTypes

  ---
- Update gql requests:

  2.12. Update user.
  ```json
   {
      "user": {
         "id": "347a0bad-3d1d-481a-936e-17cbbe9e1ef4",
         "firstName": "Nadal",
         "lastName": "Rafa",
         "email": "rafa@tennis.kz"
      }
   }
   ```
   ```
      mutation ($user: UserUpdateInput)  {
            updateUser(user: $user){
               id
               firstName
               lastName
               email
            }
         }
   ```
---
  2.13. Update profile.
  ```json
      {
         "profile": {
            "id": "baf40ae0-d973-49e4-8803-8a8717cb37f7",
            "memberTypeId": "business"
         }
      }
```
```
mutation ($profile: ProfileUpdateInput)  {
  updateProfile(profile: $profile){
    city
    userId
  }
}
```
---
  2.14. Update post.
   ```json
   {
      "post": {
         "id": "bc92a8f6-f813-4c82-8142-00c9100ea55e",
         "title": "Roland Garros",
         "content": "RG is mine, Nole leave me alone!",
         "userId": "347a0bad-3d1d-481a-936e-17cbbe9e1ef4"
      }
   }
   ```
   ```
      mutation ($post: PostUpdateInput)  {
            updatePost(post: $post){
               title
               content
               userId
            }
         }
   ```
---
  2.15. Update memberType.
  ```json
   {
      "memberType": {
         "id": "basic",
         "monthPostsLimit": 40
      }
   }
```
```
mutation ($memberType: MemberTypeUpdateInput)  {
  updateMemberType(memberType: $memberType){
    monthPostsLimit
    id
  }
}
```
---
  2.16. Subscribe to; unsubscribe from.  **id** is user that will subscribeTo/unsubscribeFrom **userId**
   ```json
      {
         "id": "347a0bad-3d1d-481a-936e-17cbbe9e1ef4",
         "userId": "1f3ffee2-b8c8-4c5b-a994-aa387e3c4c1b"
      }
   ```
```
mutation ($id: ID, $userId: ID)  {
  userSubscribedTo(id: $id, userId: $userId){
    id
    firstName
  }
}
```
---
  2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.

  [inputDataTypes](./src/routes/graphql/types/inputDataTypes.ts) - see the inputDataTypes

---

3. Solve `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.
   You can use only one "findMany" call per loader to consider this task completed.
   It's ok to leave the use of the dataloader even if only one entity was requested. But additionally (no extra score) you can optimize the behavior for such cases => +1 db call is allowed per loader.
   3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).
4. Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.
   4.1. Provide a link to the line of code where it was used.
   4.2. Specify a POST body of gql query that ends with an error due to the operation of the rule. Request result should be with `errors` field (and with or without `data:null`) describing the error.

### Description:

All dependencies to complete this task are already installed.
You are free to install new dependencies as long as you use them.
App template was made with fastify, but you don't need to know much about fastify to get the tasks done.
All templates for restful endpoints are placed, just fill in the logic for each of them.
Use the "db" property of the "fastify" object as a database access methods ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).
Body, params have fixed structure for each restful endpoint due to jsonSchema (schema.ts files near index.ts).

### Description for the 1 task:

If the requested entity is missing - send 404 http code.
If operation cannot be performed because of the client input - send 400 http code.
You can use methods of "reply" to set http code or throw an [http error](https://github.com/fastify/fastify-sensible#fastifyhttperrors).
If operation is successfully completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).

Relation fields are only stored in dependent/child entities. E.g. profile stores "userId" field.
You are also responsible for verifying that the relations are real. E.g. "userId" belongs to the real user.
So when you delete dependent entity, you automatically delete relations with its parents.
But when you delete parent entity, you need to delete relations from child entities yourself to keep the data relevant.
(In the next rss-school task, you will use a full-fledged database that also can automatically remove child entities when the parent is deleted, verify keys ownership and instead of arrays for storing keys, you will use additional "join" tables)

To determine that all your restful logic works correctly => run the script "npm run test".
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).

### Description for the 2 task:

You are free to create your own gql environment as long as you use predefined graphql endpoint (./src/routes/graphql/index.ts).
(or stick to the [default code-first](https://github.dev/graphql/graphql-js/blob/ffa18e9de0ae630d7e5f264f72c94d497c70016b/src/__tests__/starWarsSchema.ts))

### Description for the 3 task:

If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.

### Description for the 4 task:

If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.
E.g. User can refer to other users via properties `userSubscribedTo`, `subscribedToUser` and users within them can also have `userSubscribedTo`, `subscribedToUser` and so on.
Your task is to add a new rule (created by "graphql-depth-limit") in [validation](https://graphql.org/graphql-js/validation/) to limit such nesting to (for example) 6 levels max.

```

```
