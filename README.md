# Fyles

A cloud storage application aimed for small groups to access shared storage hosted on AWS S3.

[Demo Video]()

## Usage

To get started clone the repo by either downloading the zip or typing 

```
git clone https://github.com/VishnuVardhanBR/fyles
```

Install the required dependencies for both the /backend and /frontend by running the following command in both the directories.

```
npm install
```


You'll need to create configuration files for both the frontend and backend. 

Create a .env file in /backend and provide the following information:

|KEY | VALUE|
|--|--|
|JWT_SECRET_KEY|Generate a UUID and paste here.|
|AWS_ACCESS_KEY_ID|Create a AWS Key ID from the AWS dashboard.|
|AWS_SECRET_ACCESS_KEY|Create a AWS Access Key from the AWS dashboard.|
|AWS_DEFAULT_REGION|Set a default region out of all the available [options](https://www.economize.cloud/resources/aws/regions-zones-map/), example: ap-south-1|
|BUCKET_NAME|Create an S3 Bucket and paste the bucket name here.|
|DB_URI|Create a [Free](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) MongoDB Atlas Database and paste the DB_URI here.|
|REGISTER_KEY|A unique key to be inputted to be able to register.|

Create a .env file in /frontend and provide the follwing information:
|KEY | VALUE|
|--|--|
|REACT_APP_BACKEND_URL|The public IP of your backend along with the port. (default 8080)|

Please ensure that your backend has a valid SSL certificate. 

To run the backend, use a process manager such as pm2.
```
npm install -g pm2 
pm2 start index.js
```

To run the frontend, first build the react app and serve it. 

```
npm run build
serve -s build
```

