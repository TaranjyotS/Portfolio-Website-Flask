# Deploy the app on AWS s3

**Pre-requisite**: For static website to be deployed on AWS s3 make sure to set up an [API endpoint](#set-up-an-api-endpoint-using-aws-api-gateway).

1. Create an S3 Bucket
- Log in to the AWS Management Console and navigate to S3.

2. Create a new bucket:
- Choose a globally unique name.
- Select the region closest to your target audience.

3. Configure the bucket:
- Disable "Block all public access" (to make your site public).
- Enable "Static website hosting" under the "Properties" tab:
    - Index document: index.html
    - Error document: 404.html (if you have one)
- Save changes.

4. Upload Files to S3
- Navigate to the "Objects" tab in your S3 bucket.
- Upload your static files:
    - Drag and drop all files from the `/build` directory into the bucket.
- Set permissions:
    - Make sure all files are publicly accessible by setting the proper permissions in the "Permissions" tab.

5.  Update Bucket Policy
- Add a bucket policy to allow public access to all objects. Replace `your-bucket-name` with your actual bucket name.
    - Apply the policy.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

6. Access Your Static Site
- Navigate to the "Properties" tab in your S3 bucket.
- Find the "Static website hosting" section.
- Use the "Endpoint" URL provided to access your static portfolio website.

## Set up an API endpoint using AWS API Gateway

### Step 1: Create an AWS Lambda Function
1. Log in to AWS Management Console and go to the AWS Lambda service.

2. Create a New Lambda Function:
- Click on "Create function."
- Choose "Author from scratch."
- Enter a name for your function, such as FormProcessorFunction.
- Select a runtime (e.g., Python 3.x).
- Create or choose an execution role that has basic Lambda permissions.

3. Write the Lambda Function Code:
- Click on your newly created function.
- Go to the "Code" tab.
- Replace the existing code with a script that processes form data.

4. Click `deploy` to deploy the Lambda Function.

```py
import json

def lambda_handler(event, context):
    try:
        # Ensure the event body contains JSON data
        if 'body' not in event:
            raise ValueError("No body in request")

        form_data = json.loads(event['body'])
        name = form_data.get('name')
        email = form_data.get('email')
        message = form_data.get('message')
        
        # Validate required fields
        if not name or not email or not message:
            raise ValueError("Missing required fields")

        # Process the form data (e.g., send an email, save to a database)
        # Example response
        response = {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Form submitted successfully",
                "name": name,
                "email": email,
                "message": message
            }),
            "headers": {
                "Content-Type": "application/json"
            }
        }
    except ValueError as e:
        response = {
            "statusCode": 400,
            "body": json.dumps({"message": "Bad Request", "error": str(e)}),
            "headers": {
                "Content-Type": "application/json"
            }
        }
    except Exception as e:
        response = {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error", "error": str(e)}),
            "headers": {
                "Content-Type": "application/json"
            }
        }
    
    return response
```

### Step 2: Set Up AWS API Gateway

1. Go to AWS API Gateway.
- Navigate to the API Gateway service in the AWS Management Console.

2. Create a New API.
- Click on "Create API."
- Choose "HTTP API" for simplicity.
- Click "Build."

3. Configure API Settings:
- Enter an API name, such as FormSubmissionAPI.
- Click "Next."

4. Create an Integration
- Select "Add integration."
- Choose "Lambda function."
- Select the region where your Lambda function is located.
- Choose the Lambda function you created (FormProcessorFunction).
- Click "Create."

5. Create a Route
- Go to the "Routes" tab.
- Click "Create" to add a new route.
- Define a route such as /contact.
- Select "POST" as the method.
- Link the route to your Lambda function integration.

6. Deploy the API
- Click on "Deployments" in the left menu.
- Click "Create" to create a new stage (e.g., prod).
- Deploy your API.

7. Get the API URL
- Go to the "Stages" tab.
- *Note* the URL for the stage you deployed (e.g., https://abcd1234.execute-api.region.amazonaws.com/prod).

### Step 3: Update your contact form

Update the action attribute of your HTML form to point to the new API Gateway endpoint.

```html
<form id="contact-form" action="https://abcd1234.execute-api.region.amazonaws.com/prod/contact" method="POST">
```

### Step 4: Test your endpoint

Use tools like `Postman` or `curl` to test the API endpoint and ensure that it correctly processes `POST` requests.

```bash
curl -X POST https://abcd1234.execute-api.region.amazonaws.com/prod/contact \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john.doe@example.com", "message": "Hello World"}'
```

### Step 5: View Lambda logs

- In the CloudWatch console, select "Logs" from the left-hand menu.
- Find the log group corresponding to your Lambda function (usually named /aws/lambda/<function-name>).
- Click on the log group to see log streams.
- Select the most recent log stream to view the logs.
