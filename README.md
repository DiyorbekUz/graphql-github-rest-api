# graphql-github-rest-api

## First set .env file
![Query](/images/env.png)

```
we use sequelize first: CREATE DATABASE task; than write .env file settings

2: npm install;
```


## Query
> users </br>
> api_keys </br>
> getHello


## Mutation
> register </br>
> login </br>
> commits </br>
> api_key </br>
> delete_api </br>
> add_admin

# Queries
### users Query

![Query](/images/userquery.png)

> we need to be admin to use this query

## api_keys
> we need to be admin to use this query, we always need to send token in header. This query returned all API KEYS


### getHello Query
> Simple query returned Hello world

# Mutations

### register adn login we are not need token | input > username and password
> This mutation returned token and API KEY than we set header token and API KEY
![Query](/images/login.png)


### commits
> We need token and API_KEY,we always need to send token and apiKey. This query returned all Commit information [author, message, tree, url, comment_count, verification]
![Query](/images/commits.png)


### api_key | input > api_key (optional) and generate (optional)
> Create new API KEY mutation we are need token and this mutation use only admins
![Query](/images/api_key.png)
<b> if you want random API KEY you choose generate, but you want custom API KEY input choose api_key and input api_key </b>
 
### delete_api | input > apiId 
> delete API KEY only use admins

### add_admin mutation | input > userId
> Set user as admin only use admins