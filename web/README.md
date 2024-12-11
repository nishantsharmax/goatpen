### Demo INE CTF


# Backend setup 

1. Run the following command to start the PostgreSQL database container and the pgAdmin instance container:

```
docker-compose up -d
```

2. Open the pgAdmin web interface in your web browser. (http://localhost:5050/) and log in using the email: `admin@admin.com` and password: `root`.

3. In the left-hand pane, right-click on the **Servers** node, and select **Register > Server**. 

4. In the General tab, enter a name for your server.

5. Next, in the Connection tab, enter hostname as `postgres` and set port to `5432`. Check that the Maintenance database is set to `postgres`. Ensure that the Username that you want to use to connect to the database is set to `admin` and the password is set to `root`. 
 
6. That's it, click on **Save**. You can try running a few simple queries to verify that the database is working correctly.

7. Now, go to the project directory, and apply the prisma migration to initalize the models:

```
npx prisma migrate dev --name init
```

You can now check the pgAdmin dashboard, to ensure that all  the tables/relationships mentioned in the prisma schema file have been created in the database.

7. Start the app with `yarn dev`. 

8. Next, you will need an admin user to interact with the admin specific API's. For this, first load the provided postman collection document and run the **register** user request. Make sure this request doesn't contain any Cookie header.

9. This newly created user will have a default role of 'user' in the database. So, go to the pgAdmin dashboard, run the following query to to update the user's role to 'admin':

```
UPDATE public."user"
SET role = 'admin'
WHERE username = '<username>';
```

Ensure that the role has been updated to 'admin' for your user.

10. Now, run the **login** request from postman using the new user credentials. Make sure this request doesn't contain any Cookie header. On success, an access token will be granted and automatically added to the Cookie in all subsequent requests.